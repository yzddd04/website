@echo off
title Test MongoDB Atlas Connection
color 0A

echo ========================================
echo    TEST MONGODB ATLAS CONNECTION
echo ========================================
echo.

cd /d "%~dp0"

echo Testing MongoDB Atlas connection...
python test_connection.py

echo.
pause 