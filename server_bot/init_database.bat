@echo off
title Inisialisasi Database
color 0B

echo ========================================
echo    INISIALISASI DATABASE
echo ========================================
echo.

cd /d "%~dp0"

echo Memeriksa koneksi database MongoDB Atlas...
python -c "from pymongo import MongoClient; import certifi; client = MongoClient('mongodb+srv://ahmadyazidarifuddin04:Qwerty12345.@server.hvqf3sk.mongodb.net/?retryWrites=true&w=majority&appName=server', tlsCAFile=certifi.where()); client.admin.command('ping'); print('Database MongoDB Atlas OK!')" 2>nul
if errorlevel 1 (
    echo Error: Tidak dapat terhubung ke database MongoDB Atlas!
    echo Pastikan koneksi internet stabil dan MongoDB Atlas dapat diakses
    pause
    exit /b 1
)

echo Database MongoDB Atlas terhubung!
echo.

python init_database.py

echo.
pause 