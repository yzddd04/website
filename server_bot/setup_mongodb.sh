#!/bin/bash

# Setup MongoDB - Linux Version
echo "========================================"
echo "    SETUP MONGODB"
echo "========================================"
echo

# Change to script directory
cd "$(dirname "$0")"

echo "Mengecek instalasi MongoDB..."
echo

if command -v mongod >/dev/null 2>&1; then
    echo "✓ MongoDB terinstall"
else
    echo "✗ MongoDB tidak terinstall atau tidak ada di PATH"
    echo
    echo "Untuk menginstall MongoDB di Ubuntu/Debian:"
    echo "1. Import MongoDB GPG key:"
    echo "   wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -"
    echo "2. Add MongoDB repository:"
    echo "   echo 'deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse' | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list"
    echo "3. Update package list: sudo apt update"
    echo "4. Install MongoDB: sudo apt install mongodb-org"
    echo "5. Start MongoDB service: sudo systemctl start mongod"
    echo "6. Enable MongoDB service: sudo systemctl enable mongod"
    echo
    echo "Atau gunakan MongoDB Compass untuk GUI"
    echo
    read -p "Press Enter to continue..."
    exit 1
fi

echo
echo "Membuat direktori data MongoDB..."
if [ ! -d "/data/db" ]; then
    sudo mkdir -p /data/db 2>/dev/null
    if [ $? -ne 0 ]; then
        echo "✗ Gagal membuat direktori /data/db"
        echo "Coba jalankan dengan sudo"
    else
        echo "✓ Direktori /data/db dibuat"
    fi
else
    echo "✓ Direktori /data/db sudah ada"
fi

echo
echo "Mengecek service MongoDB..."
if systemctl is-active --quiet mongod; then
    echo "✓ Service MongoDB aktif"
    echo
    echo "Untuk stop service: sudo systemctl stop mongod"
    echo "Untuk start service: sudo systemctl start mongod"
    echo "Untuk restart service: sudo systemctl restart mongod"
else
    echo "✗ Service MongoDB tidak aktif"
    echo
    echo "Untuk menjalankan MongoDB manual:"
    echo "mongod --dbpath /data/db"
    echo
    echo "Atau start service:"
    echo "sudo systemctl start mongod"
fi

echo
echo "Setup selesai!"
read -p "Press Enter to continue..." 