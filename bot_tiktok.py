from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
from collections import Counter
from datetime import datetime, timedelta

# --- FUNGSI BANTU ---
def get_odometer_value(odometer_element):
    """Membaca nilai stabil dari satu elemen odometer."""
    try:
        # Metode paling andal: baca dari span 'odometer-value'
        value_spans = odometer_element.find_elements(By.CLASS_NAME, "odometer-value")
        return ''.join([span.text for span in value_spans])
    except Exception:
        return "Error"

def handle_cookie_popup(driver):
    """Mencari dan mengklik tombol persetujuan cookie jika ada."""
    try:
        cookie_button_xpath = "/html/body/div[1]/div/div[1]/button"
        # Tunggu maksimal 5 detik (lebih cepat)
        cookie_button = WebDriverWait(driver, 5).until(
            EC.element_to_be_clickable((By.XPATH, cookie_button_xpath))
        )
        cookie_button.click()
        time.sleep(1) # Beri waktu agar overlay hilang
    except Exception:
        # Jika tidak ditemukan, lanjutkan tanpa error
        pass

# --- PENGATURAN AWAL ---
# 1. Minta input jumlah username
try:
    num_users = int(input("Masukkan jumlah username yang ingin dipantau: "))
    if num_users <= 0:
        print("Jumlah harus lebih dari 0.")
        exit()
except ValueError:
    print("Input tidak valid. Harap masukkan angka.")
    exit()

# 2. Minta input semua username
usernames = []
for i in range(num_users):
    username = input(f"Masukkan username ke-{i+1}: ")
    if username: # Pastikan tidak kosong
        usernames.append(username)

if not usernames:
    print("Tidak ada username yang dimasukkan. Keluar.")
    exit()

print("\nMenyiapkan browser...")
options = webdriver.ChromeOptions()
options.add_argument("--headless=new")
options.add_argument("--start-maximized")
options.add_argument("--disable-notifications")
options.add_argument("--disable-gpu")
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")
options.add_argument('--log-level=3')
options.add_experimental_option('excludeSwitches', ['enable-logging'])

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

# 3. Buka setiap username di tab terpisah
print("Membuka tab untuk setiap user...")
for i, username in enumerate(usernames):
    # Buka tab baru untuk user kedua dan seterusnya
    if i > 0:
        driver.execute_script("window.open('about:blank', '_blank');")
        driver.switch_to.window(driver.window_handles[i])
    
    driver.get(f"https://tokcounter.com/id?user={username}")
    print(f"  - Tab untuk '{username}' dibuka. Menangani cookie...")
    handle_cookie_popup(driver)

# --- LOOP UTAMA ---
print("\nSemua tab siap. Memulai pengambilan data terjadwal...\n")
try:
    while True:
        # --- Logika Penjadwalan Presisi ---
        now = datetime.now()
        wait_seconds_int = (3 - now.second % 5 + 5) % 5
        if wait_seconds_int == 0: wait_seconds_int = 5
        sleep_duration = wait_seconds_int - (now.microsecond / 1_000_000)
        target_time = now + timedelta(seconds=sleep_duration)
        if sleep_duration > 0: time.sleep(sleep_duration)

        print(f"--- Siklus {target_time.strftime('%H:%M:%S')} ---")

        # --- Loop melalui setiap tab ---
        for i, handle in enumerate(driver.window_handles):
            driver.switch_to.window(handle)
            username_for_tab = usernames[i]
            
            try:
                # Tunggu elemen utama muncul di tab saat ini
                WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CLASS_NAME, "odometer-inside")))

                # Ambil semua data untuk user di tab ini
                all_odometers = driver.find_elements(By.CLASS_NAME, "odometer-inside")
                follower_count = get_odometer_value(all_odometers[0]) if len(all_odometers) >= 1 else "N/A"
                like_count = get_odometer_value(all_odometers[1]) if len(all_odometers) >= 2 else "N/A"

                video_count = "N/A"
                try:
                    video_odometer = driver.find_element(By.XPATH, "/html/body/div/div/div[3]/div[4]/div[3]//div[contains(@class, 'odometer-inside')]")
                    video_count = get_odometer_value(video_odometer)
                except Exception: pass

                following_count = "N/A"
                try:
                    following_odometer = driver.find_element(By.XPATH, "/html/body/div/div/div[3]/div[4]/div[2]//div[contains(@class, 'odometer-inside')]")
                    following_count = get_odometer_value(following_odometer)
                except Exception: pass
                
                print(f"  [{username_for_tab.ljust(15)}] {follower_count.rjust(12)} | {like_count.rjust(15)} | {video_count.rjust(5)} | {following_count.rjust(5)}")

            except Exception as e:
                print(f"  [{username_for_tab.ljust(15)}] Gagal mengambil data di tab ini: {type(e).__name__}")
        
        print("-" * 75)

except KeyboardInterrupt:
    print("\nBot dihentikan oleh pengguna.")
except Exception as e:
    print(f"\nTerjadi kesalahan fatal: {e}")
    try:
        driver.save_screenshot("fatal_error.png")
        print("Screenshot disimpan sebagai fatal_error.png")
    except:
        print("Gagal mengambil screenshot")
finally:
    print("\nMenutup browser...")
    try:
        driver.quit()
    except Exception:
        pass
    print("Bot selesai.")
