#!/bin/bash

# Script ini akan memastikan Google Chrome dan ChromeDriver versi Linux terinstall dan cocok
# Jalankan: bash linux_chrome_setup.sh

set -e

# 1. Install Google Chrome jika belum ada
echo "[1/3] Mengecek Google Chrome..."
if ! command -v google-chrome &> /dev/null; then
    echo "Google Chrome belum terinstall. Menginstall..."
    wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
    echo 'deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main' | sudo tee /etc/apt/sources.list.d/google-chrome.list
    sudo apt update
    sudo apt install -y google-chrome-stable
else
    echo "Google Chrome sudah terinstall: $(google-chrome --version)"
fi

# 2. Download ChromeDriver Linux yang cocok
echo "[2/3] Mengecek versi Google Chrome..."
CHROME_VERSION=$(google-chrome --version | grep -oP '\d+\.\d+\.\d+\.\d+')
CHROME_MAJOR=$(echo $CHROME_VERSION | cut -d. -f1)
echo "Versi Chrome: $CHROME_VERSION (major: $CHROME_MAJOR)"

CHROMEDRIVER_VERSION=$(wget -qO- https://chromedriver.storage.googleapis.com/LATEST_RELEASE_$CHROME_MAJOR)
echo "Versi ChromeDriver yang cocok: $CHROMEDRIVER_VERSION"

CHROMEDRIVER_URL="https://chromedriver.storage.googleapis.com/${CHROMEDRIVER_VERSION}/chromedriver_linux64.zip"
echo "Download ChromeDriver dari: $CHROMEDRIVER_URL"

wget -O chromedriver_linux64.zip "$CHROMEDRIVER_URL"
unzip -o chromedriver_linux64.zip
rm chromedriver_linux64.zip
chmod +x chromedriver
sudo mv -f chromedriver /usr/local/bin/chromedriver

# 3. Cek hasil
if command -v chromedriver &> /dev/null; then
    echo "[3/3] ChromeDriver terinstall: $(chromedriver --version)"
else
    echo "Gagal menginstall ChromeDriver!"
    exit 1
fi

echo "\n✅ Google Chrome dan ChromeDriver Linux sudah siap!"
echo "Jika masih ada error Selenium, pastikan jalankan script Python dengan python3 dan chromedriver ada di PATH."
echo "Troubleshooting hanya untuk Linux:"
echo "- Pastikan Google Chrome dan ChromeDriver versi sama"
echo "- Cek: which google-chrome && which chromedriver"
echo "- Cek permission: chmod +x /usr/local/bin/chromedriver"
echo "- Coba restart terminal jika PATH belum terupdate" 