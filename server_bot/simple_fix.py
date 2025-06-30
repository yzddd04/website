#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import subprocess
import sys
import os

def install_packages():
    """Install required packages"""
    print("Installing required packages...")
    packages = ['pymongo', 'certifi', 'dnspython']
    
    for package in packages:
        try:
            subprocess.check_call([sys.executable, '-m', 'pip', 'install', package, '--upgrade', '--quiet'])
            print(f"✓ {package}")
        except:
            print(f"✗ {package}")
    
    print()

def test_simple_connection():
    """Test simple MongoDB connection"""
    print("Testing MongoDB Cloud connection...")
    
    test_code = '''
import certifi
from pymongo import MongoClient

try:
    uri = "mongodb+srv://ahmadyazidarifuddin04:Qwerty12345.@server.hvqf3sk.mongodb.net/?retryWrites=true&w=majority&appName=server"
    client = MongoClient(uri, tlsCAFile=certifi.where(), serverSelectionTimeoutMS=10000)
    client.admin.command('ping')
    print("✓ SUCCESS: MongoDB Cloud connection working!")
    client.close()
    exit(0)
except Exception as e:
    print(f"✗ FAILED: {type(e).__name__}")
    exit(1)
'''
    
    try:
        result = subprocess.run([sys.executable, '-c', test_code], 
                              capture_output=True, text=True, timeout=15)
        print(result.stdout)
        return result.returncode == 0
    except subprocess.TimeoutExpired:
        print("✗ TIMEOUT: Connection took too long")
        return False
    except Exception as e:
        print(f"✗ ERROR: {e}")
        return False

def main():
    print("=== MONGODB CLOUD CONNECTION FIX ===")
    print()
    
    # Step 1: Install packages
    install_packages()
    
    # Step 2: Test connection
    if test_simple_connection():
        print("🎉 MONGODB CLOUD CONNECTION SUCCESSFUL!")
        print("Your project is ready to use!")
        return True
    else:
        print("❌ CONNECTION STILL FAILED")
        print()
        print("Please check manually:")
        print("1. Internet connection")
        print("2. MongoDB Atlas service status")
        print("3. IP whitelist in MongoDB Atlas")
        print("4. Connection string credentials")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 