@echo off
title Bot Service - Background Mode
color 0D

echo ========================================
echo    BOT SERVICE - BACKGROUND MODE
echo ========================================
echo.
echo Bot akan berjalan di background
echo Log akan disimpan di bot_service.log
echo.
echo Untuk menghentikan bot:
echo 1. Buka Task Manager
echo 2. Cari proses "python.exe" atau "bot_local.py"
echo 3. End Task
echo.
echo Atau gunakan: taskkill /F /IM python.exe
echo.

cd /d "%~dp0"

echo Memeriksa kesiapan sistem...
python check_readiness.py > temp_readiness.txt 2>&1
findstr /C:"SEMUA CHECK BERHASIL" temp_readiness.txt >nul
if errorlevel 1 (
    echo.
    echo Sistem belum siap untuk menjalankan bot!
    echo Silakan jalankan "Sistem Readiness Check" terlebih dahulu.
    echo.
    del temp_readiness.txt
    pause
    exit /b 1
)

del temp_readiness.txt
echo.
echo Sistem siap! Memulai bot di background...
start /B python bot_local.py > bot_service.log 2>&1

echo Bot berhasil dimulai di background!
echo Log file: bot_service.log
echo.
echo Tekan tombol apa saja untuk keluar...
pause >nul 