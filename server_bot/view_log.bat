@echo off
title Bot Service Log
color 0F

echo ========================================
echo    BOT SERVICE LOG
echo ========================================
echo.

cd /d "%~dp0"

if exist bot_service.log (
    echo Menampilkan log bot service...
    echo.
    type bot_service.log
) else (
    echo File log tidak ditemukan!
    echo Bot mungkin belum pernah dijalankan sebagai service.
)

echo.
pause 