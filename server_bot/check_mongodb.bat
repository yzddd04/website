@echo off
title Check MongoDB Status
color 0E

echo ========================================
echo    CHECK MONGODB ATLAS STATUS
echo ========================================
echo.

cd /d "%~dp0"

echo Mengecek status MongoDB Atlas...
echo.

python -c "from pymongo import MongoClient; import certifi; client = MongoClient('mongodb+srv://ahmadyazidarifuddin04:Qwerty12345.@server.hvqf3sk.mongodb.net/?retryWrites=true&w=majority&appName=server', tlsCAFile=certifi.where(), serverSelectionTimeoutMS=10000); client.admin.command('ping'); print('✓ MongoDB Atlas terhubung')" 2>nul
if errorlevel 1 (
    echo ✗ MongoDB Atlas tidak dapat diakses
    echo.
    echo Solusi:
    echo 1. Pastikan koneksi internet stabil
    echo 2. Cek apakah MongoDB Atlas dapat diakses
    echo 3. Cek apakah credentials benar
    echo.
    echo Untuk mengecek koneksi internet:
    echo ping google.com
) else (
    echo.
    echo MongoDB Atlas siap digunakan!
)

echo.
pause 