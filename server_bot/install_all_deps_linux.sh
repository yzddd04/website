#!/bin/bash

# Script install dependencies Python ke venv (jika ada) atau pipx (jika tidak)
# Jalankan: bash install_all_deps_linux.sh

set -e

cd "$(dirname "$0")"

if [ -d "venv" ]; then
    echo "[INFO] Menggunakan virtual environment: venv"
    source venv/bin/activate
    PIP_CMD="pip"
else
    echo "[INFO] venv tidak ditemukan. Menginstall pipx jika perlu."
    if ! command -v pipx &> /dev/null; then
        python3 -m pip install --user pipx
        export PATH="$HOME/.local/bin:$PATH"
    fi
    PIP_CMD="pipx runpip python3"
fi

echo "[STEP] Upgrade pip..."
$PIP_CMD install --upgrade pip

echo "[STEP] Install dependencies..."
$PIP_CMD install pymongo selenium webdriver-manager certifi dnspython requests psutil

echo "[STEP] Cek hasil instalasi..."
python3 -c "import pymongo, selenium, webdriver_manager, certifi, dnspython, requests, psutil; print('Semua dependencies terinstall!')"

echo "\n✅ Semua dependencies Python sudah terinstall di environment Linux!"
echo "Jika ingin menjalankan bot, aktifkan venv dulu: source venv/bin/activate"
echo "Atau jalankan script Python dengan: venv/bin/python nama_script.py" 