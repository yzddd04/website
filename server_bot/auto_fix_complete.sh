#!/bin/bash

# Auto Fix Complete - Linux Version
echo "========================================"
echo "    AUTO FIX COMPLETE - LINUX"
echo "========================================"
echo

# Change to script directory
cd "$(dirname "$0")"

echo "🔧 Starting comprehensive auto-fix..."
echo "This will fix all issues automatically"
echo

# Step 1: Install pip if not available
echo "Step 1: Installing/updating pip..."
if ! command -v pip3 &> /dev/null; then
    echo "Installing pip3..."
    sudo apt update && sudo apt install -y python3-pip
else
    echo "pip3 already installed"
fi

# Step 2: Upgrade pip
echo "Step 2: Upgrading pip..."
python3 -m pip install --upgrade pip

# Step 3: Install Chrome if not available
echo "Step 3: Installing Chrome..."
if ! command -v google-chrome &> /dev/null; then
    echo "Installing Google Chrome..."
    wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
    echo 'deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main' | sudo tee /etc/apt/sources.list.d/google-chrome.list
    sudo apt update
    sudo apt install -y google-chrome-stable
else
    echo "Chrome already installed"
fi

# Step 4: Install all Python dependencies
echo "Step 4: Installing Python dependencies..."
python3 -m pip install selenium>=4.15.0 webdriver-manager>=4.0.0 pymongo>=4.6.0 certifi>=2023.11.0 dnspython>=2.4.0 requests>=2.31.0 psutil>=5.9.0

# Step 5: Test ChromeDriver
echo "Step 5: Testing ChromeDriver..."
python3 -c "
import os
import sys
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

try:
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service)
    driver.quit()
    print('ChromeDriver test successful')
except Exception as e:
    print(f'ChromeDriver test failed: {e}')
    sys.exit(1)
"

# Step 6: Test MongoDB connection
echo "Step 6: Testing MongoDB connection..."
python3 -c "
import certifi
from pymongo import MongoClient

try:
    client = MongoClient(
        'mongodb+srv://ahmadyazidarifuddin04:Qwerty12345.@server.hvqf3sk.mongodb.net/?retryWrites=true&w=majority&appName=server',
        tlsCAFile=certifi.where(),
        serverSelectionTimeoutMS=10000
    )
    client.admin.command('ping')
    print('MongoDB connection successful')
    client.close()
except Exception as e:
    print(f'MongoDB connection failed: {e}')
    exit(1)
"

# Step 7: Fix file permissions
echo "Step 7: Fixing file permissions..."
chmod +x *.sh

# Step 8: Run readiness check
echo "Step 8: Running readiness check..."
python3 check_readiness.py

echo
echo "========================================"
echo "🎉 AUTO FIX COMPLETED!"
echo "========================================"
echo "✅ All issues have been fixed automatically"
echo "✅ Your bot should now be ready to run"
echo
echo "You can now:"
echo "- Run: ./menu_utama.sh"
echo "- Run: ./run_bot.sh"
echo "- Run: ./check_readiness.sh"
echo
read -p "Press Enter to continue..." 