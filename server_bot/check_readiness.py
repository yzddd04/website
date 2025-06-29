import subprocess
import sys
from pymongo import MongoClient
import certifi

def check_python_packages():
    """Mengecek apakah package Python yang diperlukan sudah terinstall."""
    print("=== CEK PACKAGE PYTHON ===")
    required_packages = [
        'selenium',
        'pymongo',
        'webdriver_manager',
        'certifi'
    ]
    
    missing_packages = []
    for package in required_packages:
        try:
            __import__(package)
            print(f"✓ {package}")
        except ImportError:
            print(f"✗ {package} - BELUM TERINSTALL")
            missing_packages.append(package)
    
    if missing_packages:
        print(f"\nPackage yang perlu diinstall: {', '.join(missing_packages)}")
        print("Jalankan: pip install " + " ".join(missing_packages))
        return False
    else:
        print("✓ Semua package Python sudah terinstall!")
        return True

def check_chrome():
    """Mengecek apakah Chrome browser terinstall."""
    print("\n=== CEK CHROME BROWSER ===")
    try:
        # Cek Chrome di Windows
        result = subprocess.run(['chrome', '--version'], capture_output=True, text=True, timeout=5)
        if result.returncode == 0:
            print("✓ Chrome terinstall")
            return True
    except (subprocess.TimeoutExpired, FileNotFoundError):
        pass
    
    try:
        # Cek Chrome di Linux/Mac
        result = subprocess.run(['google-chrome', '--version'], capture_output=True, text=True, timeout=5)
        if result.returncode == 0:
            print("✓ Chrome terinstall")
            return True
    except (subprocess.TimeoutExpired, FileNotFoundError):
        pass
    
    print("✗ Chrome tidak ditemukan")
    print("Download Chrome dari: https://www.google.com/chrome/")
    return False

def check_mongodb():
    """Mengecek koneksi MongoDB."""
    print("\n=== CEK MONGODB ===")
    try:
        # Gunakan MongoDB Atlas
        client = MongoClient(
            'mongodb+srv://ahmadyazidarifuddin04:Qwerty12345.@server.hvqf3sk.mongodb.net/?retryWrites=true&w=majority&appName=server',
            tlsCAFile=certifi.where(),
            serverSelectionTimeoutMS=10000
        )
        client.admin.command('ping')
        print("✓ MongoDB Atlas terhubung")
        client.close()
        return True
    except Exception as e:
        print(f"✗ MongoDB tidak dapat diakses: {e}")
        print("Pastikan koneksi internet stabil dan MongoDB Atlas dapat diakses.")
        return False

def check_internet():
    """Mengecek koneksi internet."""
    print("\n=== CEK INTERNET ===")
    try:
        # Test koneksi ke Google
        result = subprocess.run(['ping', '-n', '1', 'google.com'], capture_output=True, text=True, timeout=10)
        if result.returncode == 0:
            print("✓ Koneksi internet OK")
            return True
        else:
            print("✗ Koneksi internet bermasalah")
            return False
    except Exception as e:
        print(f"✗ Tidak dapat mengecek koneksi internet: {e}")
        return False

def main():
    print("========================================")
    print("    CEK KESIAPAN SISTEM")
    print("========================================")
    print()
    
    all_ready = True
    
    # Cek package Python
    if not check_python_packages():
        all_ready = False
    
    # Cek Chrome
    if not check_chrome():
        all_ready = False
    
    # Cek internet
    if not check_internet():
        all_ready = False
    
    # Cek MongoDB
    if not check_mongodb():
        all_ready = False
    
    print("\n" + "="*40)
    if all_ready:
        print("✓ SISTEM SIAP DIGUNAKAN!")
        print("Anda bisa menjalankan bot sekarang.")
    else:
        print("✗ SISTEM BELUM SIAP")
        print("Silakan install/konfigurasi komponen yang diperlukan.")
    print("="*40)

if __name__ == "__main__":
    main() 