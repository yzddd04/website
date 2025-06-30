@echo off
title Fix Missing Imports
color 0C

echo ========================================
echo    FIX MISSING IMPORTS
echo ========================================
echo.

cd /d "%~dp0"

echo Fixing missing imports...
echo This will install all required dependencies to resolve import errors
echo.

python fix_imports.py

if errorlevel 1 (
    echo.
    echo ❌ Failed to fix imports
    echo.
    echo Try these alternatives:
    echo 1. Run as administrator
    echo 2. Check Python installation
    echo 3. Try: pip install selenium webdriver-manager pymongo certifi dnspython requests
    echo 4. Run: install_requirements.bat
) else (
    echo.
    echo ✅ Imports fixed successfully!
    echo.
    echo Your bot files should now work without import errors
    echo You can now run:
    echo - auto_fix_all.bat (to fix remaining issues)
    echo - run_bot.bat (to start the bot)
    echo - menu_utama.bat (to access main menu)
)

echo.
pause 