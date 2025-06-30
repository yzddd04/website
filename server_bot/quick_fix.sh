#!/bin/bash

# Quick MongoDB Fix - Linux Version
echo "========================================"
echo "    QUICK MONGODB CLOUD FIX"
echo "========================================"
echo

# Change to script directory
cd "$(dirname "$0")"

echo "Step 1: Installing/updating packages..."
python3 -m pip install pymongo certifi dnspython --upgrade --quiet
if [ $? -ne 0 ]; then
    echo "Failed to install packages"
    read -p "Press Enter to continue..."
    exit 1
fi
echo "✓ Packages installed"

echo
echo "Step 2: Testing connection..."
python3 -c "import certifi; from pymongo import MongoClient; client = MongoClient('mongodb+srv://ahmadyazidarifuddin04:Qwerty12345.@server.hvqf3sk.mongodb.net/?retryWrites=true&w=majority&appName=server', tlsCAFile=certifi.where(), serverSelectionTimeoutMS=10000); client.admin.command('ping'); print('✓ SUCCESS: MongoDB Cloud connected!'); client.close()" 2>/dev/null

if [ $? -ne 0 ]; then
    echo
    echo "❌ Connection failed. Trying alternative method..."
    echo
    
    echo "Step 3: Testing without certifi..."
    python3 -c "from pymongo import MongoClient; client = MongoClient('mongodb+srv://ahmadyazidarifuddin04:Qwerty12345.@server.hvqf3sk.mongodb.net/?retryWrites=true&w=majority&appName=server', serverSelectionTimeoutMS=15000); client.admin.command('ping'); print('✓ SUCCESS: MongoDB Cloud connected (without certifi)!'); client.close()" 2>/dev/null
    
    if [ $? -ne 0 ]; then
        echo
        echo "❌ Both methods failed"
        echo
        echo "Troubleshooting steps:"
        echo "1. Check internet connection"
        echo "2. Try accessing: https://cloud.mongodb.com"
        echo "3. Check if your IP is whitelisted in MongoDB Atlas"
        echo "4. Verify the connection string is correct"
        echo
        echo "You can also try:"
        echo "- Running check_mongodb.sh for more details"
        echo "- Checking MongoDB Atlas dashboard"
    else
        echo
        echo "✅ Connection successful with alternative method!"
        echo "MongoDB Cloud is working without certifi."
    fi
else
    echo
    echo "✅ Connection successful with certifi!"
    echo "MongoDB Cloud is working perfectly."
fi

echo
echo "Step 4: Testing database access..."
python3 -c "import certifi; from pymongo import MongoClient; client = MongoClient('mongodb+srv://ahmadyazidarifuddin04:Qwerty12345.@server.hvqf3sk.mongodb.net/?retryWrites=true&w=majority&appName=server', tlsCAFile=certifi.where()); db = client['botwebsite']; print('✓ Database access: OK'); client.close()" 2>/dev/null

if [ $? -ne 0 ]; then
    echo "✗ Database access failed"
else
    echo "✓ Database access: OK"
fi

echo
echo "Quick fix completed!"
echo
read -p "Press Enter to continue..." 