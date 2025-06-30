#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import subprocess
import sys
import os

def install_package(package):
    """Install a single package"""
    try:
        print(f"Installing {package}...")
        result = subprocess.run([sys.executable, '-m', 'pip', 'install', package, '--upgrade'], 
                              capture_output=True, text=True, timeout=60)
        if result.returncode == 0:
            print(f"✓ {package} installed successfully")
            return True
        else:
            print(f"✗ {package} installation failed: {result.stderr}")
            return False
    except Exception as e:
        print(f"✗ {package} installation error: {e}")
        return False

def test_import(package):
    """Test if a package can be imported"""
    try:
        __import__(package)
        print(f"✓ {package} import successful")
        return True
    except ImportError:
        print(f"✗ {package} import failed")
        return False

def main():
    """Main function to install all dependencies"""
    print("=== INSTALLING ALL DEPENDENCIES ===")
    print()
    
    # List of required packages
    packages = [
        'selenium',
        'webdriver-manager', 
        'pymongo',
        'certifi',
        'dnspython',
        'requests',
        'psutil'
    ]
    
    # Install packages
    print("Installing packages...")
    success_count = 0
    
    for package in packages:
        if install_package(package):
            success_count += 1
        print()
    
    # Test imports
    print("Testing imports...")
    import_success_count = 0
    
    import_tests = [
        ('selenium', 'selenium'),
        ('webdriver_manager', 'webdriver-manager'),
        ('pymongo', 'pymongo'),
        ('certifi', 'certifi'),
        ('requests', 'requests'),
        ('psutil', 'psutil')
    ]
    
    for import_name, package_name in import_tests:
        if test_import(import_name):
            import_success_count += 1
        print()
    
    # Results
    print("="*50)
    print("INSTALLATION RESULTS")
    print("="*50)
    print(f"Packages installed: {success_count}/{len(packages)}")
    print(f"Imports successful: {import_success_count}/{len(import_tests)}")
    
    if success_count == len(packages) and import_success_count == len(import_tests):
        print("\n🎉 ALL DEPENDENCIES INSTALLED SUCCESSFULLY!")
        print("Your bot is ready to run!")
        return True
    else:
        print("\n❌ SOME DEPENDENCIES FAILED")
        print("Please try manual installation:")
        print("pip install selenium webdriver-manager pymongo certifi dnspython requests psutil")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 