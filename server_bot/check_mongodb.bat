@echo off
title Check MongoDB Status
color 0E

echo ========================================
echo    CHECK MONGODB STATUS
echo ========================================
echo.

cd /d "%~dp0"

echo Mengecek status MongoDB...
echo.

python -c "from pymongo import MongoClient; client = MongoClient('mongodb://localhost:27017/', serverSelectionTimeoutMS=5000); client.admin.command('ping'); print('✓ MongoDB berjalan di localhost:27017')" 2>nul
if errorlevel 1 (
    echo ✗ MongoDB tidak berjalan atau tidak dapat diakses
    echo.
    echo Solusi:
    echo 1. Pastikan MongoDB sudah terinstall
    echo 2. Jalankan MongoDB service
    echo 3. Cek apakah port 27017 tidak diblokir
    echo.
    echo Untuk Windows:
    echo - Buka Services (services.msc)
    echo - Cari "MongoDB" dan start service
    echo.
    echo Atau jalankan MongoDB secara manual:
    echo mongod --dbpath C:\data\db
) else (
    echo.
    echo MongoDB siap digunakan!
)

echo.
pause 