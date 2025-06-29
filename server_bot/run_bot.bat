@echo off
title Bot Statistik Sosial Media - Otomatis
color 0A

echo ========================================
echo    BOT STATISTIK SOSIAL MEDIA
echo    Mode: Otomatis dari Database
echo ========================================
echo.

cd /d "%~dp0"

echo Memeriksa kesiapan sistem...
python check_readiness.py > temp_readiness.txt 2>&1
echo ====== DEBUG OUTPUT readiness check ======
type temp_readiness.txt
echo ==========================================
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
echo Sistem siap! Memulai bot...
echo.

python bot_local.py

echo.
echo Bot selesai.
pause 