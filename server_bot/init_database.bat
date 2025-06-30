@echo off
title Inisialisasi Database
color 0B

echo ========================================
echo    INISIALISASI DATABASE
echo ========================================
echo.

cd /d "%~dp0"

echo Memeriksa koneksi database...
python -c "from pymongo import MongoClient; client = MongoClient('mongodb+srv://ahmadyazidarifuddin04:Qwerty12345.@server.hvqf3sk.mongodb.net/?retryWrites=true&w=majority&appName=server'); client.admin.command('ping'); print('Database OK!')" 2>nul
if errorlevel 1 (
    echo Error: Tidak dapat terhubung ke database MongoDB Cloud!
    echo Pastikan koneksi internet stabil dan MongoDB Cloud dapat diakses
    pause
    exit /b 1
)

echo Database terhubung!
echo.

python init_database.py

echo.
pause 