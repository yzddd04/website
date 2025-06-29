@echo off
title Setup MongoDB
color 0B

echo ========================================
echo    SETUP MONGODB
echo ========================================
echo.

cd /d "%~dp0"

echo Mengecek instalasi MongoDB...
echo.

where mongod >nul 2>&1
if errorlevel 1 (
    echo ✗ MongoDB tidak terinstall atau tidak ada di PATH
    echo.
    echo Untuk menginstall MongoDB:
    echo 1. Download dari https://www.mongodb.com/try/download/community
    echo 2. Install dengan default settings
    echo 3. Pastikan "Install MongoDB as a Service" dicentang
    echo.
    echo Atau gunakan MongoDB Compass untuk GUI
    echo.
    pause
    exit /b 1
) else (
    echo ✓ MongoDB terinstall
)

echo.
echo Membuat direktori data MongoDB...
if not exist "C:\data\db" (
    mkdir "C:\data\db" 2>nul
    if errorlevel 1 (
        echo ✗ Gagal membuat direktori C:\data\db
        echo Coba jalankan sebagai Administrator
    ) else (
        echo ✓ Direktori C:\data\db dibuat
    )
) else (
    echo ✓ Direktori C:\data\db sudah ada
)

echo.
echo Mengecek service MongoDB...
sc query MongoDB >nul 2>&1
if errorlevel 1 (
    echo ✗ Service MongoDB tidak ditemukan
    echo.
    echo Untuk menjalankan MongoDB manual:
    echo mongod --dbpath C:\data\db
    echo.
    echo Atau install sebagai service:
    echo mongod --install --dbpath C:\data\db
) else (
    echo ✓ Service MongoDB ditemukan
    echo.
    echo Untuk start service:
    echo net start MongoDB
    echo.
    echo Untuk stop service:
    echo net stop MongoDB
)

echo.
echo Setup selesai!
pause 