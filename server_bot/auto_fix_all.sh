#!/bin/bash

# Auto Fix All Issues - Linux Version
echo "========================================"
echo "    AUTO FIX ALL ISSUES"
echo "========================================"
echo

# Change to script directory
cd "$(dirname "$0")"

echo "Running comprehensive auto-fix..."
echo "This will fix:"
echo "1. MongoDB Cloud connection issues"
echo "2. ChromeDriver/Selenium issues"
echo "3. Missing dependencies"
echo "4. Configuration problems"
echo

python3 auto_fix_all.py

if [ $? -ne 0 ]; then
    echo
    echo "❌ Some fixes failed"
    echo
    echo "You can try individual fixes:"
    echo "- fix_mongodb.sh (for MongoDB issues)"
    echo "- fix_chromedriver.sh (for ChromeDriver issues)"
    echo "- quick_fix.sh (for quick MongoDB fix)"
    echo
    echo "Or check the troubleshooting guide:"
    echo "- MONGODB_TROUBLESHOOTING.md"
else
    echo
    echo "✅ All fixes successful!"
    echo
    echo "Your bot is now ready to run:"
    echo "- run_bot.sh (start the bot)"
    echo "- menu_utama.sh (access main menu)"
    echo "- check_readiness.sh (verify everything works)"
fi

echo
read -p "Press Enter to continue..." 