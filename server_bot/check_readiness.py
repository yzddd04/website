import sys
import os
import platform
from pymongo import MongoClient

def check_python_version():
    """Mengecek versi Python."""
    print("=== CEK VERSI PYTHON ===")
    version = sys.version_info
    print(f"Python version: {version.major}.{version.minor}.{version.micro}")
    
    if version.major >= 3 and version.minor >= 7:
        print("OK Versi Python memenuhi syarat (3.7+)")
        return True
    else:
        print("X Versi Python terlalu lama. Minimal Python 3.7")
        return False

def check_dependencies():
    """Mengecek dependencies Python."""
    print("\n=== CEK DEPENDENCIES ===")
    dependencies = ['pymongo', 'selenium', 'webdriver_manager', 'psutil']
    missing = []
    
    for dep in dependencies:
        try:
            __import__(dep)
            print(f"OK {dep}")
        except ImportError:
            print(f"X {dep} - tidak terinstall")
            missing.append(dep)
    
    if missing:
        print(f"\nDependencies yang perlu diinstall: {', '.join(missing)}")
        print("Jalankan: pip3 install " + " ".join(missing))
        return False
    else:
        print("\nOK Semua dependencies terinstall")
        return True

def check_mongodb():
    """Mengecek koneksi MongoDB."""
    print("\n=== CEK MONGODB ===")
    try:
        client = MongoClient('mongodb+srv://ahmadyazidarifuddin04:Qwerty12345.@server.hvqf3sk.mongodb.net/?retryWrites=true&w=majority&appName=server', serverSelectionTimeoutMS=5000)
        client.admin.command('ping')
        print("OK MongoDB Cloud terhubung")
        client.close()
        return True
    except Exception as e:
        print(f"X MongoDB tidak dapat diakses: {e}")
        print("Pastikan koneksi internet stabil dan MongoDB Cloud dapat diakses")
        return False

def check_database_data():
    """Mengecek data username di database botwebsite.members."""
    print("\n=== CEK DATA DATABASE ===")
    try:
        client = MongoClient('mongodb+srv://ahmadyazidarifuddin04:Qwerty12345.@server.hvqf3sk.mongodb.net/botwebsite?retryWrites=true&w=majority&appName=server')
        db = client['botwebsite']
        members = db['members'].find({})
        ig_count = 0
        tiktok_count = 0
        for member in members:
            if member.get('socialLinks', {}).get('instagram', '').strip():
                ig_count += 1
            if member.get('socialLinks', {}).get('tiktok', '').strip():
                tiktok_count += 1
        print(f"Data Instagram: {ig_count}")
        print(f"Data TikTok: {tiktok_count}")
        if ig_count == 0 and tiktok_count == 0:
            print("X Database kosong. Tidak ada username untuk dipantau")
            print("Gunakan menu 'Manajemen Username' untuk menambah data di members")
            client.close()
            return False
        else:
            print("OK Database memiliki data username")
            client.close()
            return True
    except Exception as e:
        print(f"X Error mengakses database: {e}")
        return False

def check_chrome():
    """Mengecek Chrome browser."""
    print("\n=== CEK CHROME BROWSER ===")
    
    system = platform.system().lower()
    
    if system == "linux":
        # Check for Chrome on Linux
        chrome_paths = [
            "/usr/bin/google-chrome",
            "/usr/bin/google-chrome-stable",
            "/usr/bin/chromium-browser",
            "/usr/bin/chromium"
        ]
        
        chrome_found = False
        for path in chrome_paths:
            if os.path.exists(path):
                print(f"OK Chrome ditemukan: {path}")
                chrome_found = True
                break
        
        # Also check if chrome is in PATH
        if not chrome_found:
            try:
                import subprocess
                result = subprocess.run(['google-chrome', '--version'], 
                                      capture_output=True, text=True, timeout=5)
                if result.returncode == 0:
                    print(f"OK Chrome ditemukan: {result.stdout.strip()}")
                    chrome_found = True
            except:
                pass
        
        if not chrome_found:
            print("X Chrome tidak ditemukan")
            print("Install Chrome dengan: sudo apt install google-chrome-stable")
            return False
        
    elif system == "windows":
        # Windows paths
        chrome_paths = [
            r"C:\Program Files\Google\Chrome\Application\chrome.exe",
            r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
            r"C:\Users\%USERNAME%\AppData\Local\Google\Chrome\Application\chrome.exe"
        ]
        
        chrome_found = False
        for path in chrome_paths:
            expanded_path = os.path.expandvars(path)
            if os.path.exists(expanded_path):
                print(f"OK Chrome ditemukan: {expanded_path}")
                chrome_found = True
                break
        
        if not chrome_found:
            print("X Chrome tidak ditemukan")
            print("Download Chrome dari: https://www.google.com/chrome/")
            return False
    
    else:
        # macOS
        chrome_paths = [
            "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
        ]
        
        chrome_found = False
        for path in chrome_paths:
            if os.path.exists(path):
                print(f"OK Chrome ditemukan: {path}")
                chrome_found = True
                break
        
        if not chrome_found:
            print("X Chrome tidak ditemukan")
            print("Install Chrome dari: https://www.google.com/chrome/")
            return False
    
    return True

def check_internet():
    """Mengecek koneksi internet."""
    print("\n=== CEK KONEKSI INTERNET ===")
    try:
        import urllib.request
        urllib.request.urlopen('http://www.google.com', timeout=5)
        print("OK Koneksi internet tersedia")
        return True
    except Exception:
        print("X Tidak dapat terhubung ke internet")
        print("Pastikan koneksi internet stabil")
        return False

def main():
    """Fungsi utama untuk mengecek kesiapan sistem."""
    print("=== SISTEM READINESS CHECK ===")
    print("Mengecek kesiapan sistem untuk menjalankan bot...")
    print("=" * 50)
    
    checks = [
        check_python_version(),
        check_dependencies(),
        check_mongodb(),
        check_database_data(),
        check_chrome(),
        check_internet()
    ]
    
    print("\n" + "=" * 50)
    print("=== HASIL CHECK ===")
    
    passed = sum(checks)
    total = len(checks)
    
    if passed == total:
        print("SEMUA CHECK BERHASIL")
        print(f"OK SEMUA CHECK BERHASIL ({passed}/{total})")
        print("Sistem siap untuk menjalankan bot!")
        print("\nAnda bisa menjalankan bot dengan:")
        print("- Menu utama -> Jalankan Bot (Foreground)")
        print("- Menu utama -> Jalankan Bot (Background/Service)")
        print("- Atau langsung: ./run_bot.sh")
    else:
        print(f"X {total - passed} CHECK GAGAL ({passed}/{total})")
        print("Sistem belum siap untuk menjalankan bot.")
        print("\nSilakan perbaiki masalah di atas terlebih dahulu.")
        
        if not check_python_version():
            print("- Install Python 3.7+")
        if not check_dependencies():
            print("- Install dependencies: pip3 install pymongo selenium webdriver-manager psutil")
        if not check_mongodb():
            print("- Install dan jalankan MongoDB")
        if not check_database_data():
            print("- Inisialisasi database dengan contoh data")
        if not check_chrome():
            print("- Install Google Chrome")
        if not check_internet():
            print("- Periksa koneksi internet")

if __name__ == "__main__":
    main() 