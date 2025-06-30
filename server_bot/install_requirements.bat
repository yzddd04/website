@echo off
title Install Requirements
color 0A

echo ========================================
echo    INSTALL FROM REQUIREMENTS.TXT
echo ========================================
echo.

cd /d "%~dp0"

echo Installing dependencies from requirements.txt...
echo.

python -m pip install -r requirements.txt

if errorlevel 1 (
    echo.
    echo ❌ Installation failed
    echo.
    echo Try running as administrator or check Python/pip installation
) else (
    echo.
    echo ✅ Dependencies installed successfully!
    echo.
    echo You can now run:
    echo - auto_fix_all.bat (to fix remaining issues)
    echo - run_bot.bat (to start the bot)
    echo - menu_utama.bat (to access main menu)
)

echo.
pause 