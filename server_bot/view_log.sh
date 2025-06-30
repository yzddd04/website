#!/bin/bash

# Bot Service Log - Linux Version
echo "========================================"
echo "    BOT SERVICE LOG"
echo "========================================"
echo

# Change to script directory
cd "$(dirname "$0")"

if [ -f "bot_service.log" ]; then
    echo "Menampilkan log bot service..."
    echo
    cat bot_service.log
else
    echo "File log tidak ditemukan!"
    echo "Bot mungkin belum pernah dijalankan sebagai service."
fi

echo
read -p "Press Enter to continue..." 