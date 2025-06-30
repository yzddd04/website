#!/bin/bash

# Install Dependencies - Linux Version
echo "========================================"
echo "    INSTALL DEPENDENCIES"
echo "========================================"
echo

# Change to script directory
cd "$(dirname "$0")"

echo "Menginstall dependencies Python..."
echo

pip3 install pymongo selenium webdriver-manager psutil

echo
echo "========================================"
echo "    INSTALASI SELESAI"
echo "========================================"
echo
echo "Dependencies yang diinstall:"
echo "- pymongo (MongoDB driver)"
echo "- selenium (Web automation)"
echo "- webdriver-manager (Chrome driver manager)"
echo "- psutil (Process monitoring)"
echo
echo "Sekarang Anda bisa menjalankan bot!"
echo
read -p "Press Enter to continue..." 