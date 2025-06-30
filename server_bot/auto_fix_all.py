#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import subprocess
import sys
import os
import time

def print_header(title):
    """Print formatted header"""
    print("\n" + "="*50)
    print(f"    {title}")
    print("="*50)

def install_dependencies():
    """Install all required dependencies"""
    print_header("INSTALLING DEPENDENCIES")
    
    packages = [
        'pymongo', 'certifi', 'dnspython',
        'selenium', 'webdriver-manager', 'requests'
    ]
    
    for package in packages:
        try:
            print(f"Installing {package}...")
            subprocess.check_call([sys.executable, '-m', 'pip', 'install', package, '--upgrade', '--quiet'])
            print(f"✓ {package}")
        except:
            print(f"✗ {package}")
    
    print()

def test_mongodb_connection():
    """Test MongoDB Cloud connection"""
    print_header("TESTING MONGODB CONNECTION")
    
    test_code = '''
import certifi
from pymongo import MongoClient

try:
    uri = "mongodb+srv://ahmadyazidarifuddin04:Qwerty12345.@server.hvqf3sk.mongodb.net/?retryWrites=true&w=majority&appName=server"
    client = MongoClient(uri, tlsCAFile=certifi.where(), serverSelectionTimeoutMS=10000)
    client.admin.command('ping')
    print("✓ MongoDB Cloud connection successful!")
    client.close()
    exit(0)
except Exception as e:
    print(f"✗ MongoDB connection failed: {type(e).__name__}")
    exit(1)
'''
    
    try:
        result = subprocess.run([sys.executable, '-c', test_code], 
                              capture_output=True, text=True, timeout=15)
        print(result.stdout)
        return result.returncode == 0
    except subprocess.TimeoutExpired:
        print("✗ MongoDB test timeout")
        return False
    except Exception as e:
        print(f"✗ MongoDB test failed: {e}")
        return False

def test_selenium_setup():
    """Test Selenium and ChromeDriver setup"""
    print_header("TESTING SELENIUM SETUP")
    
    test_code = '''
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import os

try:
    # Method 1: webdriver-manager
    print("Testing webdriver-manager...")
    service = Service(ChromeDriverManager().install())
    options = webdriver.ChromeOptions()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    
    driver = webdriver.Chrome(service=service, options=options)
    driver.get("https://www.google.com")
    print("✓ webdriver-manager works!")
    driver.quit()
    exit(0)
    
except Exception as e:
    print(f"✗ webdriver-manager failed: {type(e).__name__}")
    
    try:
        # Method 2: local chromedriver
        if os.path.exists("chromedriver.exe"):
            print("Testing local chromedriver...")
            service = Service("chromedriver.exe")
            options = webdriver.ChromeOptions()
            options.add_argument("--headless")
            options.add_argument("--no-sandbox")
            options.add_argument("--disable-dev-shm-usage")
            
            driver = webdriver.Chrome(service=service, options=options)
            driver.get("https://www.google.com")
            print("✓ Local chromedriver works!")
            driver.quit()
            exit(0)
        else:
            print("✗ Local chromedriver not found")
            exit(1)
            
    except Exception as e2:
        print(f"✗ Local chromedriver failed: {type(e2).__name__}")
        exit(1)
'''
    
    try:
        result = subprocess.run([sys.executable, '-c', test_code], 
                              capture_output=True, text=True, timeout=30)
        print(result.stdout)
        return result.returncode == 0
    except subprocess.TimeoutExpired:
        print("✗ Selenium test timeout")
        return False
    except Exception as e:
        print(f"✗ Selenium test failed: {e}")
        return False

def run_fix_scripts():
    """Run individual fix scripts"""
    print_header("RUNNING FIX SCRIPTS")
    
    # Run MongoDB fix
    print("Running MongoDB fix...")
    try:
        subprocess.run([sys.executable, 'fix_mongodb_connection.py'], 
                      capture_output=True, text=True, timeout=60)
        print("✓ MongoDB fix completed")
    except:
        print("✗ MongoDB fix failed")
    
    # Run ChromeDriver fix
    print("Running ChromeDriver fix...")
    try:
        subprocess.run([sys.executable, 'fix_chromedriver.py'], 
                      capture_output=True, text=True, timeout=120)
        print("✓ ChromeDriver fix completed")
    except:
        print("✗ ChromeDriver fix failed")

def main():
    """Main auto-fix function"""
    print("=== COMPREHENSIVE AUTO-FIX ===")
    print("Fixing all common issues automatically...")
    print()
    
    # Step 1: Install dependencies
    install_dependencies()
    
    # Step 2: Run fix scripts
    run_fix_scripts()
    
    # Step 3: Test MongoDB
    print()
    mongodb_ok = test_mongodb_connection()
    
    # Step 4: Test Selenium
    print()
    selenium_ok = test_selenium_setup()
    
    # Step 5: Results
    print_header("FIX RESULTS")
    
    if mongodb_ok and selenium_ok:
        print("🎉 ALL FIXES SUCCESSFUL!")
        print("✅ MongoDB Cloud: Working")
        print("✅ Selenium/ChromeDriver: Working")
        print()
        print("Your bot is ready to run!")
        print("You can now:")
        print("- Run: run_bot.bat")
        print("- Run: menu_utama.bat")
        return True
    else:
        print("❌ SOME FIXES FAILED")
        print(f"MongoDB: {'✅ Working' if mongodb_ok else '❌ Failed'}")
        print(f"Selenium: {'✅ Working' if selenium_ok else '❌ Failed'}")
        print()
        print("Manual troubleshooting may be required:")
        if not mongodb_ok:
            print("- Check internet connection")
            print("- Verify MongoDB Atlas status")
            print("- Check IP whitelist")
        if not selenium_ok:
            print("- Update Chrome browser")
            print("- Check antivirus settings")
            print("- Run as administrator")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 