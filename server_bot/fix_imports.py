#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import subprocess
import sys
import os

def run_command(command):
    """Run a command and return success status"""
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True, timeout=120)
        return result.returncode == 0, result.stdout, result.stderr
    except Exception as e:
        return False, "", str(e)

def install_dependencies():
    """Install all required dependencies"""
    print("=== INSTALLING DEPENDENCIES ===")
    
    # Try different installation methods
    methods = [
        "python -m pip install selenium webdriver-manager pymongo certifi dnspython requests --upgrade",
        "pip install selenium webdriver-manager pymongo certifi dnspython requests --upgrade",
        "python -m pip install -r requirements.txt"
    ]
    
    for method in methods:
        print(f"Trying: {method}")
        success, stdout, stderr = run_command(method)
        if success:
            print("✓ Installation successful")
            return True
        else:
            print(f"✗ Failed: {stderr}")
    
    return False

def test_imports():
    """Test if all required modules can be imported"""
    print("\n=== TESTING IMPORTS ===")
    
    imports = [
        'selenium',
        'selenium.webdriver',
        'selenium.webdriver.chrome.service',
        'selenium.webdriver.common.by',
        'selenium.webdriver.support.ui',
        'selenium.webdriver.support',
        'webdriver_manager',
        'webdriver_manager.chrome',
        'pymongo',
        'certifi',
        'requests'
    ]
    
    success_count = 0
    for module in imports:
        try:
            __import__(module)
            print(f"✓ {module}")
            success_count += 1
        except ImportError as e:
            print(f"✗ {module}: {e}")
    
    return success_count == len(imports)

def main():
    """Main function"""
    print("=== FIX MISSING IMPORTS ===")
    print("This will install all required dependencies to fix import errors")
    print()
    
    # Step 1: Install dependencies
    if install_dependencies():
        print("\n✅ Dependencies installed successfully!")
    else:
        print("\n❌ Failed to install dependencies")
        print("Please try manual installation:")
        print("pip install selenium webdriver-manager pymongo certifi dnspython requests")
        return False
    
    # Step 2: Test imports
    if test_imports():
        print("\n🎉 ALL IMPORTS WORKING!")
        print("Your bot files should now work without import errors")
        return True
    else:
        print("\n❌ Some imports still failing")
        print("Please check Python environment and try again")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 