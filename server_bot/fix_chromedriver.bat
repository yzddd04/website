@echo off
title Fix ChromeDriver
color 0C

echo ========================================
echo    FIX CHROMEDRIVER ISSUES
echo ========================================
echo.

cd /d "%~dp0"

echo Running automatic ChromeDriver fix...
echo This will:
echo 1. Install/update Selenium packages
echo 2. Detect Chrome browser version
echo 3. Fix webdriver-manager issues
echo 4. Download compatible ChromeDriver
echo 5. Test Selenium setup
echo.

python fix_chromedriver.py

if errorlevel 1 (
    echo.
    echo ❌ ChromeDriver fix failed
    echo.
    echo Manual troubleshooting required:
    echo 1. Update Chrome browser to latest version
    echo 2. Check antivirus software (may block ChromeDriver)
    echo 3. Run as administrator
    echo 4. Check Windows Defender settings
    echo 5. Try running: python -m pip install --upgrade selenium webdriver-manager
) else (
    echo.
    echo ✅ ChromeDriver fixed successfully!
    echo.
    echo You can now run:
    echo - run_bot.bat (to start the bot)
    echo - menu_utama.bat (to access main menu)
)

echo.
pause 