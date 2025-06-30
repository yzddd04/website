#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import subprocess
import sys
import os
import shutil
import zipfile
import requests
import platform
from pathlib import Path

def install_packages():
    """Install required packages"""
    print("Installing required packages...")
    packages = ['selenium', 'webdriver-manager', 'requests']
    
    for package in packages:
        try:
            subprocess.check_call([sys.executable, '-m', 'pip', 'install', package, '--upgrade', '--quiet'])
            print(f"✓ {package}")
        except:
            print(f"✗ {package}")
    
    print()

def get_chrome_version():
    """Get Chrome browser version (Linux & Windows)"""
    system = platform.system().lower()
    if system == "windows":
        try:
            import winreg
            key = winreg.OpenKey(winreg.HKEY_CURRENT_USER, r"Software\Google\Chrome\BLBeacon")
            version, _ = winreg.QueryValueEx(key, "version")
            winreg.CloseKey(key)
            return version
        except:
            try:
                chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
                if os.path.exists(chrome_path):
                    result = subprocess.run([chrome_path, "--version"], 
                                          capture_output=True, text=True, timeout=10)
                    version = result.stdout.strip().split()[-1]
                    return version
            except:
                pass
    else:
        # Linux/Mac
        for chrome_cmd in ["google-chrome", "google-chrome-stable", "chromium-browser", "chromium"]:
            try:
                result = subprocess.run([chrome_cmd, "--version"], capture_output=True, text=True, timeout=10)
                if result.returncode == 0:
                    version = result.stdout.strip().split()[-1]
                    return version
            except:
                continue
    return None

def download_chromedriver(version):
    """Download ChromeDriver sesuai OS"""
    print(f"Downloading ChromeDriver for Chrome version: {version}")
    
    # Extract major version
    major_version = version.split('.')[0]
    
    # ChromeDriver download URL
    base_url = "https://chromedriver.storage.googleapis.com"
    
    system = platform.system().lower()
    if system == "windows":
        zip_name = "chromedriver_win32.zip"
        driver_name = "chromedriver.exe"
    elif system == "darwin":
        zip_name = "chromedriver_mac64.zip"
        driver_name = "chromedriver"
    else:
        zip_name = "chromedriver_linux64.zip"
        driver_name = "chromedriver"
    
    try:
        # Get latest version for this Chrome major version
        version_url = f"{base_url}/LATEST_RELEASE_{major_version}"
        response = requests.get(version_url, timeout=10)
        driver_version = response.text.strip()
        
        # Download ChromeDriver
        download_url = f"{base_url}/{driver_version}/{zip_name}"
        print(f"Downloading from: {download_url}")
        
        response = requests.get(download_url, timeout=30)
        
        # Save to temp file
        temp_zip = "chromedriver_temp.zip"
        with open(temp_zip, 'wb') as f:
            f.write(response.content)
        
        # Extract
        with zipfile.ZipFile(temp_zip, 'r') as zip_ref:
            zip_ref.extractall(".")
        
        # Clean up
        os.remove(temp_zip)
        
        # Make executable
        if os.path.exists(driver_name):
            if system != "windows":
                os.chmod(driver_name, 0o755)
            print(f"✓ ChromeDriver downloaded: {driver_name}")
            return driver_name
        
    except Exception as e:
        print(f"✗ Failed to download ChromeDriver: {e}")
    
    return None

def fix_webdriver_manager():
    """Fix webdriver-manager issues"""
    print("Fixing webdriver-manager...")
    
    try:
        # Clear webdriver-manager cache
        cache_dir = os.path.expanduser("~/.wdm")
        if os.path.exists(cache_dir):
            shutil.rmtree(cache_dir)
            print("✓ Cleared webdriver-manager cache")
        
        # Reinstall webdriver-manager
        subprocess.check_call([sys.executable, '-m', 'pip', 'uninstall', 'webdriver-manager', '-y'])
        subprocess.check_call([sys.executable, '-m', 'pip', 'install', 'webdriver-manager', '--upgrade'])
        print("✓ Reinstalled webdriver-manager")
        
    except Exception as e:
        print(f"✗ Failed to fix webdriver-manager: {e}")

def test_selenium():
    """Test Selenium with Chrome (Linux & Windows)"""
    print("Testing Selenium setup...")
    
    system = platform.system().lower()
    driver_name = "chromedriver.exe" if system == "windows" else "./chromedriver"
    test_code = f'''
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import os

try:
    # Method 1: Use webdriver-manager
    print("Testing webdriver-manager method...")
    service = Service(ChromeDriverManager().install())
    options = webdriver.ChromeOptions()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    
    driver = webdriver.Chrome(service=service, options=options)
    driver.get("https://www.google.com")
    print("✓ webdriver-manager method works!")
    driver.quit()
    
except Exception as e:
    print(f"✗ webdriver-manager method failed: {e}")
    
    try:
        # Method 2: Use local chromedriver
        print("Testing local chromedriver method...")
        if os.path.exists(r"{driver_name}"):
            service = Service(r"{driver_name}")
            options = webdriver.ChromeOptions()
            options.add_argument("--headless")
            options.add_argument("--no-sandbox")
            options.add_argument("--disable-dev-shm-usage")
            
            driver = webdriver.Chrome(service=service, options=options)
            driver.get("https://www.google.com")
            print("✓ Local chromedriver method works!")
            driver.quit()
        else:
            print("✗ Local chromedriver not found")
            
    except Exception as e2:
        print(f"✗ Local chromedriver method failed: {e2}")
'''
    
    try:
        result = subprocess.run([sys.executable, '-c', test_code], 
                              capture_output=True, text=True, timeout=60)
        print(result.stdout)
        return result.returncode == 0
    except subprocess.TimeoutExpired:
        print("✗ Test timeout")
        return False
    except Exception as e:
        print(f"✗ Test failed: {e}")
        return False

def main():
    """Main function to fix ChromeDriver issues"""
    print("=== CHROMEDRIVER FIXER ===")
    print("Automatically fixing ChromeDriver and Selenium issues...")
    print()
    
    # Step 1: Install packages
    install_packages()
    
    # Step 2: Get Chrome version
    chrome_version = get_chrome_version()
    if chrome_version:
        print(f"Chrome version detected: {chrome_version}")
    else:
        print("Could not detect Chrome version")
    
    # Step 3: Fix webdriver-manager
    fix_webdriver_manager()
    
    # Step 4: Download ChromeDriver manually if needed
    if chrome_version:
        chromedriver_path = download_chromedriver(chrome_version)
        if chromedriver_path:
            print(f"ChromeDriver available at: {chromedriver_path}")
    
    # Step 5: Test Selenium
    print()
    if test_selenium():
        print("🎉 CHROMEDRIVER FIXED SUCCESSFULLY!")
        print("Selenium is now working properly!")
        return True
    else:
        print("❌ CHROMEDRIVER FIX FAILED")
        print()
        print("Manual troubleshooting required:")
        print("1. Update Chrome browser to latest version")
        print("2. Check Chrome installation (sudo apt install google-chrome-stable)")
        print("3. Check permissions: chmod +x ./chromedriver")
        print("4. Try running: ./fix_chromedriver.sh")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 