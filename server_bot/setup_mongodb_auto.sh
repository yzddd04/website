#!/bin/bash

# Script otomatis install MongoDB di Ubuntu/Debian
# Jalankan: bash setup_mongodb_auto.sh

set -e

echo "========================================"
echo "    AUTO SETUP MONGODB (LINUX)"
echo "========================================"
echo

# 1. Cek apakah mongod sudah ada
if command -v mongod &> /dev/null; then
    echo "MongoDB sudah terinstall: $(mongod --version | head -n 1)"
    echo "Mengecek status service..."
    sudo systemctl status mongod || true
    echo "Jika ingin mengulang setup, uninstall dulu: sudo apt remove --purge mongodb-org"
    exit 0
fi

# 2. Import GPG key
if ! apt-key list | grep -q "MongoDB 7.0 Release Signing Key"; then
    echo "Importing MongoDB GPG key..."
    wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
fi

# 3. Tambah repo
if [ ! -f /etc/apt/sources.list.d/mongodb-org-7.0.list ]; then
    echo "Menambah repository MongoDB..."
    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
fi

# 4. Update dan install
sudo apt update
sudo apt install -y mongodb-org

# 5. Enable dan start service
sudo systemctl enable mongod
sudo systemctl start mongod

# 6. Cek status
sleep 2
echo
sudo systemctl status mongod --no-pager || true
echo
if pgrep mongod &> /dev/null; then
    echo "✅ MongoDB berhasil diinstall dan berjalan!"
    echo "Cek status: sudo systemctl status mongod"
    echo "Stop: sudo systemctl stop mongod | Start: sudo systemctl start mongod"
else
    echo "❌ MongoDB gagal berjalan. Cek log: sudo journalctl -u mongod"
fi 