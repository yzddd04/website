#!/bin/bash

# Bot Service - Background Mode - Linux Version
echo "========================================"
echo "    BOT SERVICE - BACKGROUND MODE"
echo "========================================"
echo
echo "Bot akan berjalan di background"
echo "Log akan disimpan di bot_service.log"
echo
echo "Untuk menghentikan bot:"
echo "1. Gunakan: pkill -f bot_local.py"
echo "2. Atau: killall python3"
echo "3. Atau gunakan: ./stop_service.sh"
echo

# Change to script directory
cd "$(dirname "$0")"

echo "Memeriksa kesiapan sistem..."
python3 check_readiness.py > temp_readiness.txt 2>&1
if grep -q "SEMUA CHECK BERHASIL" temp_readiness.txt; then
    echo
    echo "Sistem siap! Memulai bot di background..."
    nohup python3 bot_local.py > bot_service.log 2>&1 &
    echo "Bot berhasil dimulai di background!"
    echo "Log file: bot_service.log"
    echo "Process ID: $!"
else
    echo
    echo "Sistem belum siap untuk menjalankan bot!"
    echo "Silakan jalankan 'Sistem Readiness Check' terlebih dahulu."
    echo
    rm -f temp_readiness.txt
    read -p "Press Enter to continue..."
    exit 1
fi

rm -f temp_readiness.txt
echo
echo "Tekan tombol apa saja untuk keluar..."
read -n 1 