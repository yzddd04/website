from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
from collections import Counter
from datetime import datetime, timedelta

# Minta input username dari pengguna
username = input("Masukkan username TokCounter: ")
print(f"Akan memantau user: {username}\n")

print("Menyiapkan browser...")

options = webdriver.ChromeOptions()
options.add_argument("--start-maximized")
options.add_argument("--disable-notifications")
options.add_argument("--disable-gpu")
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")

# Opsi untuk menekan log tidak penting dari browser
options.add_argument('--log-level=3')
options.add_experimental_option('excludeSwitches', ['enable-logging'])

# Opsi untuk run di background (headless)
# options.add_argument("--headless")

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

print(f"Membuka situs TokCounter untuk user: {username}...")
driver.get(f"https://tokcounter.com/id?user={username}")

# --- Handle Cookie Consent Pop-up ---
try:
    cookie_button_xpath = "/html/body/div[1]/div/div[1]/button"
    print("Mencari tombol persetujuan pengguna...")
    # Tunggu maksimal 10 detik hingga tombol bisa diklik
    cookie_button = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, cookie_button_xpath))
    )
    print("Tombol ditemukan, mengklik 'Agree'...")
    cookie_button.click()
    time.sleep(2)  # Beri waktu agar overlay hilang
except Exception:
    # Jika tombol tidak ditemukan, anggap tidak ada pop-up
    print("Tombol persetujuan tidak ditemukan, melanjutkan...")
# ------------------------------------

print("Menunggu halaman dimuat dan odometer muncul...")
wait = WebDriverWait(driver, 30)

def get_odometer_value(odometer_element):
    try:
        value_spans = odometer_element.find_elements(By.CLASS_NAME, "odometer-value")
        return ''.join([span.text for span in value_spans])
    except Exception:
        return "Error"

try:
    wait.until(EC.presence_of_element_located((By.CLASS_NAME, "odometer-inside")))
    print("Odometer ditemukan. Memulai pengambilan data terjadwal...\n")
    
    while True:
        now = datetime.now()
        wait_seconds_int = (3 - now.second % 5 + 5) % 5
        if wait_seconds_int == 0:
            wait_seconds_int = 5
        sleep_duration = wait_seconds_int - (now.microsecond / 1_000_000)
        target_time = now + timedelta(seconds=sleep_duration)
        if sleep_duration > 0:
            time.sleep(sleep_duration)

        try:
            # Follower & Like
            all_odometers = driver.find_elements(By.CLASS_NAME, "odometer-inside")
            follower_count = get_odometer_value(all_odometers[0]) if len(all_odometers) >= 1 else "Not Found"
            like_count = get_odometer_value(all_odometers[1]) if len(all_odometers) >= 2 else "Not Found"

            # Video
            try:
                video_odometer_xpath = "/html/body/div/div/div[3]/div[4]/div[3]//div[contains(@class, 'odometer-inside')]"
                video_odometer = driver.find_element(By.XPATH, video_odometer_xpath)
                video_count = get_odometer_value(video_odometer)
            except Exception:
                video_count = "Not Found"

            # Mengikuti
            try:
                following_odometer_xpath = "/html/body/div/div/div[3]/div[4]/div[2]//div[contains(@class, 'odometer-inside')]"
                following_odometer = driver.find_element(By.XPATH, following_odometer_xpath)
                following_count = get_odometer_value(following_odometer)
            except Exception:
                following_count = "Not Found"

            print(f"[{target_time.strftime('%Y-%m-%d %H:%M:%S')}] {follower_count} | {like_count} | {video_count} | {following_count}")

        except Exception as e:
            print(f"[{target_time.strftime('%Y-%m-%d %H:%M:%S')}] Terjadi error besar pada siklus ini: {e}")

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
