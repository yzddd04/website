@echo off
title Install Dependencies
color 0C

echo ========================================
echo    INSTALL DEPENDENCIES
echo ========================================
echo.

cd /d "%~dp0"

echo Menginstall dependencies Python...
echo.

pip install pymongo selenium webdriver-manager psutil

echo.
echo ========================================
echo    INSTALASI SELESAI
echo ========================================
echo.
echo Dependencies yang diinstall:
echo - pymongo (MongoDB driver)
echo - selenium (Web automation)
echo - webdriver-manager (Chrome driver manager)
echo - psutil (Process monitoring)
echo.
echo Sekarang Anda bisa menjalankan bot!
echo.
pause 