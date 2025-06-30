#!/bin/bash

# Inisialisasi Database - Linux Version
echo "========================================"
echo "    INISIALISASI DATABASE"
echo "========================================"
echo

# Change to script directory
cd "$(dirname "$0")"

echo "Memeriksa koneksi database..."
python3 -c "from pymongo import MongoClient; client = MongoClient('mongodb+srv://ahmadyazidarifuddin04:Qwerty12345.@server.hvqf3sk.mongodb.net/?retryWrites=true&w=majority&appName=server'); client.admin.command('ping'); print('Database OK!')" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "Error: Tidak dapat terhubung ke database MongoDB Cloud!"
    echo "Pastikan koneksi internet stabil dan MongoDB Cloud dapat diakses"
    read -p "Press Enter to continue..."
    exit 1
fi

echo "Database terhubung!"
echo

python3 init_database.py

echo
read -p "Press Enter to continue..." 