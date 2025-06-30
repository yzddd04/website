#!/bin/bash

# Stop Bot Service - Linux Version
echo "========================================"
echo "    STOP BOT SERVICE"
echo "========================================"
echo

# Change to script directory
cd "$(dirname "$0")"

echo "Menghentikan bot service..."
echo

pkill -f "python.*bot" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "Tidak ada proses Python bot yang berjalan."
else
    echo "Bot service berhasil dihentikan!"
fi

echo
echo "Membersihkan proses Chrome yang tersisa..."
pkill -f "chrome" 2>/dev/null
pkill -f "chromedriver" 2>/dev/null

echo
echo "Selesai!"
read -p "Press Enter to continue..." 