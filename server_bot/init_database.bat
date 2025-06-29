@echo off
title Inisialisasi Database
color 0B

echo ========================================
echo    INISIALISASI DATABASE
echo ========================================
echo.

cd /d "%~dp0"

echo Memeriksa koneksi database...
python -c "from pymongo import MongoClient; client = MongoClient('mongodb://localhost:27017/'); client.admin.command('ping'); print('Database OK!')" 2>nul
if errorlevel 1 (
    echo Error: Tidak dapat terhubung ke database MongoDB!
    echo Pastikan MongoDB berjalan di localhost:27017
    pause
    exit /b 1
)

echo Database terhubung!
echo.

python init_database.py

echo.
pause 