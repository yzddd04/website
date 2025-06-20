from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
from datetime import datetime, timedelta
import re
import os, subprocess, sys

# CATATAN:
# Jika muncul pesan seperti:
#   DevTools listening on ws://...
#   WARNING: All log messages before absl::InitializeLog() is called are written to STDERR
#   I0000 ... voice_transcription.cc:58 ...
# Itu BUKAN error, melainkan pesan standar dari Chrome/Chromium saat mode headless.
# Pesan tersebut bisa diabaikan dan tidak mempengaruhi jalannya bot.

# --- FUNGSI BANTU UNTUK TIKTOK ---
def get_tiktok_odometer_value(odometer_element):
    """Membaca nilai dari elemen odometer TokCounter."""
    try:
        value_spans = odometer_element.find_elements(By.CLASS_NAME, "odometer-value")
        return ''.join([span.text for span in value_spans])
    except Exception:
        return "N/A"

def get_tiktok_stats(driver):
    """Mengambil semua statistik (Followers, Likes, Videos, Following) untuk TikTok."""
    try:
        all_odometers = driver.find_elements(By.CLASS_NAME, "odometer-inside")
        follower_count = get_tiktok_odometer_value(all_odometers[0]) if len(all_odometers) >= 1 else "N/A"
        like_count = get_tiktok_odometer_value(all_odometers[1]) if len(all_odometers) >= 2 else "N/A"
        
        video_count = "N/A"
        try:
            video_odometer = driver.find_element(By.XPATH, "/html/body/div/div/div[3]/div[4]/div[3]//div[contains(@class, 'odometer-inside')]")
            video_count = get_tiktok_odometer_value(video_odometer)
        except Exception: pass

        following_count = "N/A"
        try:
            following_odometer = driver.find_element(By.XPATH, "/html/body/div/div/div[3]/div[4]/div[2]//div[contains(@class, 'odometer-inside')]")
            following_count = get_tiktok_odometer_value(following_odometer)
        except Exception: pass
        
        return follower_count, like_count, video_count, following_count
    except Exception:
        return "N/A", "N/A", "N/A", "N/A"

# --- FUNGSI BANTU UNTUK INSTAGRAM ---
def get_instagram_followers(driver):
    """Mengambil jumlah followers Instagram dari livecounts.nl."""
    try:
        follower_odometer_container = driver.find_element(By.XPATH, "//div[@aria-label='Follower Count']")
        value_elements = follower_odometer_container.find_elements(By.XPATH, ".//span[contains(@class, 'odometer-value')] | .//span[contains(@class, 'odometer-formatting-mark')]")
        follower_text = ''.join([elem.text for elem in value_elements])
        follower_count = re.sub(r'[^\d]', '', follower_text)
        return follower_count if follower_count else "N/A"
    except Exception:
        return "N/A"

def wait_for_instagram_animation(driver):
    """Menunggu animasi odometer Instagram selesai."""
    main_container_xpath = "//div[@aria-label='Follower Count']"
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, main_container_xpath)))
    animating_element_xpath = "//div[@aria-label='Follower Count' and contains(@class, 'odometer-animating')]"
    try:
        WebDriverWait(driver, 2).until(EC.invisibility_of_element_located((By.XPATH, animating_element_xpath)))
    except Exception:
        pass # Lanjutkan jika tidak ada animasi

def handle_tiktok_cookie_popup(driver):
    """Mencari dan mengklik tombol persetujuan cookie di TokCounter."""
    try:
        cookie_button_xpath = "/html/body/div/div/div[1]/button"
        cookie_button = WebDriverWait(driver, 5).until(
            EC.element_to_be_clickable((By.XPATH, cookie_button_xpath))
        )
        cookie_button.click()
        time.sleep(1) # Beri waktu agar overlay hilang
    except Exception:
        # Jika tidak ditemukan setelah 5 detik, lanjutkan saja.
        pass

# --- PENGATURAN AWAL ---
users_to_monitor = []

# 1. Minta username Instagram
try:
    num_ig_users = int(input("Masukkan jumlah username Instagram yang ingin dipantau (0 jika tidak ada): "))
except ValueError:
    num_ig_users = 0

if num_ig_users > 0:
    print("--- Masukkan Username Instagram ---")
    for i in range(num_ig_users):
        username = input(f"  - Username Instagram ke-{i+1}: ")
        if username:
            users_to_monitor.append({'username': username, 'platform': 'instagram'})

# 2. Minta username TikTok
try:
    num_tiktok_users = int(input("\nMasukkan jumlah username TikTok yang ingin dipantau (0 jika tidak ada): "))
except ValueError:
    num_tiktok_users = 0

if num_tiktok_users > 0:
    print("--- Masukkan Username TikTok ---")
    for i in range(num_tiktok_users):
        username = input(f"  - Username TikTok ke-{i+1}: ")
        if username:
            users_to_monitor.append({'username': username, 'platform': 'tiktok'})

if not users_to_monitor:
    print("Tidak ada username yang dimasukkan. Keluar.")
    exit()

# --- SETUP BROWSER ---
print("\nMenyiapkan browser...")
options = webdriver.ChromeOptions()
options.add_argument("--headless=new")
options.add_argument("--start-maximized")
options.add_argument("--disable-notifications")
options.add_argument('--log-level=3')
options.add_experimental_option('excludeSwitches', ['enable-logging', 'enable-automation'])
options.add_experimental_option('useAutomationExtension', False)
# User-Agent Chrome normal
options.add_argument('user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36')
# Anti-detect
options.add_argument('--disable-blink-features=AutomationControlled')

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
# Patch navigator.webdriver agar undefined (anti headless detect)
driver.execute_cdp_cmd('Page.addScriptToEvaluateOnNewDocument', {
    'source': 'Object.defineProperty(navigator, "webdriver", {get: () => undefined})'
})

# --- BUKA TABS ---
print("Membuka tab untuk setiap user...")
base_urls = {
    'instagram': "https://livecounts.nl/instagram-realtime/?u={username}",
    'tiktok': "https://tokcounter.com/id?user={username}"
}

for i, user in enumerate(users_to_monitor):
    if i > 0:
        driver.execute_script("window.open('about:blank', '_blank');")
        driver.switch_to.window(driver.window_handles[-1])
    
    url = base_urls[user['platform']].format(username=user['username'])
    driver.get(url)
    print(f"  - Tab untuk '{user['username']}' ({user['platform']}) dibuka.")
    
    # Tambahkan penanganan cookie khusus untuk TikTok
    if user['platform'] == 'tiktok':
        handle_tiktok_cookie_popup(driver)

# --- LOOP UTAMA ---
print("\nSemua tab siap. Memulai pengambilan data...\n")

header = f"{'Username'.ljust(20)} {'Platform'.ljust(12)} {'Followers'.rjust(15)} {'Likes'.rjust(15)} {'Videos'.rjust(7)} {'Following'.rjust(9)}"
print(header)
print("-" * len(header))

try:
    while True:
        now = datetime.now()
        wait_seconds = (5 - now.second % 5)
        time.sleep(wait_seconds)
        
        print(f"--- Siklus {datetime.now().strftime('%H:%M:%S')} ---")

        for i, handle in enumerate(driver.window_handles):
            driver.switch_to.window(handle)
            user_info = users_to_monitor[i]
            username_for_tab = user_info['username']
            platform = user_info['platform']
            
            try:
                if platform == 'instagram':
                    wait_for_instagram_animation(driver)
                    follower_count = get_instagram_followers(driver)
                    print(f"{username_for_tab.ljust(20)} {platform.ljust(12)} {follower_count.rjust(15)} {'---'.rjust(15)} {'---'.rjust(7)} {'---'.rjust(9)}")
                
                elif platform == 'tiktok':
                    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CLASS_NAME, "odometer-inside")))
                    followers, likes, videos, following = get_tiktok_stats(driver)
                    print(f"{username_for_tab.ljust(20)} {platform.ljust(12)} {followers.rjust(15)} {likes.rjust(15)} {videos.rjust(7)} {following.rjust(9)}")

            except Exception as e:
                print(f"  [{username_for_tab.ljust(15)}] Gagal mengambil data: {type(e).__name__}")
        
except KeyboardInterrupt:
    print("\nBot dihentikan oleh pengguna.")
except Exception as e:
    print(f"\nTerjadi kesalahan fatal: {e}")
finally:
    print("\nMenutup browser...")
    try:
        if 'driver' in locals() and driver:
            driver.quit()
            print("driver.quit() sudah dipanggil.")
    except Exception as e:
        print(f"Gagal menutup browser dengan benar: {e}")
    
    # Paksa kill proses Chrome/Chromedriver jika masih ada (khusus Linux/Ubuntu)
    if sys.platform.startswith('linux'):
        try:
            subprocess.call('pkill -f chrome', shell=True)
            subprocess.call('pkill -f chromedriver', shell=True)
            print("Proses Chrome dan Chromedriver dipaksa berhenti (Linux/Ubuntu).")
        except Exception as e:
            print(f"Gagal memaksa kill proses: {e}")
    print("Bot selesai.")
