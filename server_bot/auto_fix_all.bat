@echo off
title Auto Fix All Issues
color 0B

echo ========================================
echo    AUTO FIX ALL ISSUES
echo ========================================
echo.

cd /d "%~dp0"

echo Running comprehensive auto-fix...
echo This will fix:
echo 1. MongoDB Cloud connection issues
echo 2. ChromeDriver/Selenium issues
echo 3. Missing dependencies
echo 4. Configuration problems
echo.

python auto_fix_all.py

if errorlevel 1 (
    echo.
    echo ❌ Some fixes failed
    echo.
    echo You can try individual fixes:
    echo - fix_mongodb.bat (for MongoDB issues)
    echo - fix_chromedriver.bat (for ChromeDriver issues)
    echo - quick_fix.bat (for quick MongoDB fix)
    echo.
    echo Or check the troubleshooting guide:
    echo - MONGODB_TROUBLESHOOTING.md
) else (
    echo.
    echo ✅ All fixes successful!
    echo.
    echo Your bot is now ready to run:
    echo - run_bot.bat (start the bot)
    echo - menu_utama.bat (access main menu)
    echo - check_readiness.bat (verify everything works)
)

echo.
pause 