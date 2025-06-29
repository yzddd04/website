@echo off
title Stop Bot Service
color 0C

echo ========================================
echo    STOP BOT SERVICE
echo ========================================
echo.

cd /d "%~dp0"

echo Menghentikan bot service...
echo.

taskkill /F /IM python.exe 2>nul
if errorlevel 1 (
    echo Tidak ada proses Python yang berjalan.
) else (
    echo Bot service berhasil dihentikan!
)

echo.
echo Membersihkan proses Chrome yang tersisa...
taskkill /F /IM chrome.exe /T 2>nul
taskkill /F /IM chromedriver.exe /T 2>nul

echo.
echo Selesai!
pause 