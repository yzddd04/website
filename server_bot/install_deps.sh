#!/bin/bash

# Install Dependencies - Linux Version
echo "========================================"
echo "    INSTALL ALL DEPENDENCIES"
echo "========================================"
echo

# Change to script directory
cd "$(dirname "$0")"

echo "Installing all required dependencies..."
echo "This will install:"
echo "- selenium (web automation)"
echo "- webdriver-manager (ChromeDriver management)"
echo "- pymongo (MongoDB driver)"
echo "- certifi (SSL certificates)"
echo "- dnspython (DNS resolution)"
echo "- requests (HTTP requests)"
echo

python3 install_deps.py

if [ $? -ne 0 ]; then
    echo
    echo "❌ Some dependencies failed to install"
    echo
    echo "Try manual installation:"
    echo "pip3 install selenium webdriver-manager pymongo certifi dnspython requests"
    echo
    echo "Or run the auto-fix:"
    echo "auto_fix_all.sh"
else
    echo
    echo "✅ All dependencies installed successfully!"
    echo
    echo "You can now run:"
    echo "- auto_fix_all.sh (to fix remaining issues)"
    echo "- run_bot.sh (to start the bot)"
    echo "- menu_utama.sh (to access main menu)"
fi

echo
read -p "Press Enter to continue..." 