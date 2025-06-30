#!/bin/bash

# Fix Missing Imports - Linux Version
echo "========================================"
echo "    FIX MISSING IMPORTS"
echo "========================================"
echo

# Change to script directory
cd "$(dirname "$0")"

echo "Fixing missing imports..."
echo "This will install all required dependencies to resolve import errors"
echo

python3 fix_imports.py

if [ $? -ne 0 ]; then
    echo
    echo "❌ Failed to fix imports"
    echo
    echo "Try these alternatives:"
    echo "1. Run with sudo if needed"
    echo "2. Check Python installation: python3 --version"
    echo "3. Try: pip3 install selenium webdriver-manager pymongo certifi dnspython requests"
    echo "4. Run: install_requirements.sh"
else
    echo
    echo "✅ Imports fixed successfully!"
    echo
    echo "Your bot files should now work without import errors"
    echo "You can now run:"
    echo "- auto_fix_all.sh (to fix remaining issues)"
    echo "- run_bot.sh (to start the bot)"
    echo "- menu_utama.sh (to access main menu)"
fi

echo
read -p "Press Enter to continue..." 