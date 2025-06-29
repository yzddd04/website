@echo off
title Status Database
color 0E

echo ========================================
echo    STATUS DATABASE
echo ========================================
echo.

cd /d "%~dp0"

python check_database.py

echo.
pause 