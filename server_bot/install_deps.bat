@echo off
title Install Dependencies
color 0E

echo ========================================
echo    INSTALL ALL DEPENDENCIES
echo ========================================
echo.

cd /d "%~dp0"

echo Installing all required dependencies...
echo This will install:
echo - selenium (web automation)
echo - webdriver-manager (ChromeDriver management)
echo - pymongo (MongoDB driver)
echo - certifi (SSL certificates)
echo - dnspython (DNS resolution)
echo - requests (HTTP requests)
echo.

python install_deps.py

if errorlevel 1 (
    echo.
    echo ❌ Some dependencies failed to install
    echo.
    echo Try manual installation:
    echo pip install selenium webdriver-manager pymongo certifi dnspython requests
    echo.
    echo Or run the auto-fix:
    echo auto_fix_all.bat
) else (
    echo.
    echo ✅ All dependencies installed successfully!
    echo.
    echo You can now run:
    echo - auto_fix_all.bat (to fix remaining issues)
    echo - run_bot.bat (to start the bot)
    echo - menu_utama.bat (to access main menu)
)

echo.
pause 