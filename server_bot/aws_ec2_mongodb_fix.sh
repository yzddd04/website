#!/bin/bash

# Script otomatis untuk memperbaiki error TLS/SSL MongoDB Atlas di AWS EC2
# Jalankan: bash aws_ec2_mongodb_fix.sh

set -e

echo "========================================"
echo "  AUTO FIX MONGODB ATLAS (AWS EC2)"
echo "========================================"
echo

echo "[1/4] Update CA certificates dan OpenSSL..."
sudo apt update
sudo apt install --reinstall ca-certificates openssl -y
sudo update-ca-certificates

echo "[2/4] Cek versi OpenSSL dan CA certificates..."
openssl version
ls -l /etc/ssl/certs/ca-certificates.crt

# Cek public IP EC2
PUBLIC_IP=$(curl -s http://checkip.amazonaws.com)
echo "[3/4] Public IP EC2 Anda: $PUBLIC_IP"
echo "Pastikan IP ini sudah di-whitelist di MongoDB Atlas (Network Access > IP Whitelist)"
echo "Buka: https://cloud.mongodb.com/ > Project > Network Access > Add IP Address"
echo "Masukkan: $PUBLIC_IP"

# Cek koneksi keluar ke MongoDB Atlas
MONGO_HOST="ac-qjn9fhm-shard-00-00.hvqf3sk.mongodb.net"
echo "[4/4] Cek koneksi keluar ke $MONGO_HOST:27017 ..."
if command -v nc &> /dev/null; then
    nc -vz $MONGO_HOST 27017 || echo "[WARNING] Tidak bisa konek ke $MONGO_HOST:27017, cek firewall/security group EC2."
else
    echo "[INFO] netcat (nc) tidak ditemukan, lewati tes koneksi port."
fi

echo
cat <<EOF
========================================
Jika masih gagal konek MongoDB Atlas:
- Pastikan IP EC2 sudah di-whitelist di Atlas
- Pastikan security group EC2 mengizinkan outbound ke port 27017
- Coba restart instance EC2 setelah update
- Cek log error Python untuk detail
========================================
EOF 