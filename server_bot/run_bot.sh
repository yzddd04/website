#!/bin/bash

# Bot Statistik Sosial Media - Otomatis - Linux Version
echo "========================================"
echo "    BOT STATISTIK SOSIAL MEDIA"
echo "    Mode: Otomatis dari Database"
echo "========================================"
echo

# Change to script directory
cd "$(dirname "$0")"

echo "Memeriksa kesiapan sistem..."
python3 check_readiness.py > temp_readiness.txt 2>&1
echo "====== DEBUG OUTPUT readiness check ======"
cat temp_readiness.txt
echo "=========================================="
if grep -q "SEMUA CHECK BERHASIL" temp_readiness.txt; then
    echo
    echo "Sistem siap! Memulai bot..."
    echo
    python3 bot_cloud.py
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
echo "Bot selesai."
read -p "Press Enter to continue..." 