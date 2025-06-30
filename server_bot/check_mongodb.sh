#!/bin/bash

# Check MongoDB Status - Linux Version
echo "========================================"
echo "    CHECK MONGODB STATUS"
echo "========================================"
echo

# Change to script directory
cd "$(dirname "$0")"

echo "Mengecek status MongoDB Cloud..."
echo

python3 test_connection.py
if [ $? -ne 0 ]; then
    echo
    echo "✗ MongoDB Cloud tidak dapat diakses"
    echo
    echo "Solusi:"
    echo "1. Pastikan koneksi internet stabil"
    echo "2. Cek apakah MongoDB Cloud service aktif"
    echo "3. Verifikasi connection string"
    echo "4. Cek firewall atau proxy settings"
    echo
    echo "Untuk troubleshooting:"
    echo "- Coba akses MongoDB Atlas dashboard"
    echo "- Periksa network connectivity"
    echo "- Pastikan IP address diizinkan di MongoDB Atlas"
else
    echo
    echo "MongoDB Cloud siap digunakan!"
fi

echo
read -p "Press Enter to continue..." 