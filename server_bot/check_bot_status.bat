@echo off
title Status Bot
color 0D

echo ========================================
echo    STATUS BOT
echo ========================================
echo.

cd /d "%~dp0"

python check_bot_status.py

echo.
pause 