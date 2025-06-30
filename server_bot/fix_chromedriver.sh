#!/bin/bash

# Fix ChromeDriver - Linux Version
echo "========================================"
echo "    FIX CHROMEDRIVER ISSUES"
echo "========================================"
echo

# Change to script directory
cd "$(dirname "$0")"

echo "Running automatic ChromeDriver fix..."
echo "This will:"
echo "1. Install/update Selenium packages"
echo "2. Detect Chrome browser version"
echo "3. Fix webdriver-manager issues"
echo "4. Download compatible ChromeDriver"
echo "5. Test Selenium setup"
echo

python3 fix_chromedriver.py

if [ $? -ne 0 ]; then
    echo
    echo "❌ ChromeDriver fix failed"
    echo
    echo "Manual troubleshooting required:"
    echo "1. Update Chrome browser to latest version"
    echo "2. Check if Chrome is installed: google-chrome --version"
    echo "3. Install Chrome if needed: sudo apt install google-chrome-stable"
    echo "4. Check if chromedriver is in PATH"
    echo "5. Try running: python3 -m pip install --upgrade selenium webdriver-manager"
else
    echo
    echo "✅ ChromeDriver fixed successfully!"
    echo
    echo "You can now run:"
    echo "- run_bot.sh (to start the bot)"
    echo "- menu_utama.sh (to access main menu)"
fi

echo
read -p "Press Enter to continue..." 