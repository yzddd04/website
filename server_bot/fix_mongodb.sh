#!/bin/bash

# Fix MongoDB Connection - Linux Version
echo "========================================"
echo "    FIX MONGODB CLOUD CONNECTION"
echo "========================================"
echo

# Change to script directory
cd "$(dirname "$0")"

echo "Running automatic MongoDB connection fix..."
echo "This will:"
echo "1. Install/update required dependencies"
echo "2. Test MongoDB Cloud connection"
echo "3. Provide troubleshooting steps if needed"
echo

python3 simple_fix.py

if [ $? -ne 0 ]; then
    echo
    echo "❌ Automatic fix failed"
    echo
    echo "Manual troubleshooting required:"
    echo "1. Check internet connection"
    echo "2. Verify MongoDB Atlas is accessible"
    echo "3. Check if IP is whitelisted"
    echo "4. Verify connection string credentials"
    echo
    echo "Try running: check_mongodb.sh"
else
    echo
    echo "✅ MongoDB Cloud connection fixed successfully!"
    echo
    echo "You can now run:"
    echo "- check_mongodb.sh (to verify connection)"
    echo "- init_database.sh (to initialize database)"
    echo "- manage_usernames.sh (to manage users)"
    echo "- run_bot.sh (to start the bot)"
fi

echo
read -p "Press Enter to continue..." 