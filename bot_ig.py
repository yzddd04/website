from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
from collections import Counter
from datetime import datetime, timedelta
import re

# --- FUNGSI BANTU ---
def get_follower_count_from_spans(driver):
    """Mengambil jumlah followers menggunakan struktur HTML odometer yang lebih andal."""
    try:
        # 1. Cari kontainer utama follower count berdasarkan atribut 'aria-label' yang unik.
        follower_odometer_container = driver.find_element(By.XPATH, "//div[@aria-label='Follower Count']")

        # 2. Di dalam kontainer itu, temukan semua elemen span yang berisi angka (class='odometer-value')
        #    atau tanda baca (class='odometer-formatting-mark').
        value_elements = follower_odometer_container.find_elements(By.XPATH, ".//span[contains(@class, 'odometer-value')] | .//span[contains(@class, 'odometer-formatting-mark')]")
        
        # 3. Gabungkan teks dari setiap elemen untuk membentuk string angka yang lengkap (contoh: "1,234,567").
        follower_text = ''.join([elem.text for elem in value_elements])
        
        # 4. Bersihkan string dari karakter non-digit (seperti koma) untuk mendapatkan angka murni.
        follower_count = re.sub(r'[^\d]', '', follower_text)
        
        return follower_count if follower_count else "N/A"
        
    except Exception as e:
        print(f"Error mengambil follower count: {e}")
        return "N/A"

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
# Tidak menggunakan headless mode agar window terlihat

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

# 3. Buka setiap username di tab terpisah
print("Membuka tab untuk setiap user...")
for i, username in enumerate(usernames):
    # Buka tab baru untuk user kedua dan seterusnya
    if i > 0:
        driver.execute_script("window.open('about:blank', '_blank');")
        driver.switch_to.window(driver.window_handles[i])
    
    driver.get(f"https://livecounts.nl/instagram-realtime/?u={username}")
    print(f"  - Tab untuk '{username}' dibuka.")

# --- LOOP UTAMA ---
print("\nSemua tab siap. Memulai pengambilan data terjadwal...\n")
print("Username".ljust(20) + "Followers".rjust(15))
print("-" * 35)

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
                # 1. Tunggu kontainer follower count utama muncul.
                main_container_xpath = "//div[@aria-label='Follower Count']"
                WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.XPATH, main_container_xpath))
                )

                # 2. Tunggu hingga animasi angka selesai (jika ada).
                # Odometer menambahkan kelas 'odometer-animating' selama perubahan angka.
                # Kita tunggu sampai elemen dengan kelas itu tidak terlihat lagi (animasi selesai).
                animating_element_xpath = "//div[@aria-label='Follower Count' and contains(@class, 'odometer-animating')]"
                try:
                    # Beri waktu maksimal 2 detik untuk animasi selesai.
                    WebDriverWait(driver, 2).until(
                        EC.invisibility_of_element_located((By.XPATH, animating_element_xpath))
                    )
                except Exception:
                    # Jika timeout, berarti tidak ada animasi atau animasi macet.
                    # Kita lanjutkan saja untuk mencoba membaca nilainya.
                    pass

                # 3. Ambil follower count setelah angka stabil.
                follower_count = get_follower_count_from_spans(driver)
                
                print(f"{username_for_tab.ljust(20)} {follower_count.rjust(15)}")

            except Exception as e:
                print(f"{username_for_tab.ljust(20)} {'Error'.rjust(15)} - {type(e).__name__}")
        
        print("-" * 35)

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
