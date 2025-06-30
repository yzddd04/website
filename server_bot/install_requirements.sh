#!/bin/bash

# Install Requirements - Linux Version
echo "========================================"
echo "    INSTALL FROM REQUIREMENTS.TXT"
echo "========================================"
echo

# Change to script directory
cd "$(dirname "$0")"

echo "Installing dependencies from requirements.txt..."
echo

python3 -m pip install -r requirements.txt

if [ $? -ne 0 ]; then
    echo
    echo "❌ Installation failed"
    echo
    echo "Try running with sudo or check Python/pip installation"
else
    echo
    echo "✅ Dependencies installed successfully!"
    echo
    echo "You can now run:"
    echo "- auto_fix_all.sh (to fix remaining issues)"
    echo "- run_bot.sh (to start the bot)"
    echo "- menu_utama.sh (to access main menu)"
fi

echo
read -p "Press Enter to continue..." 