@echo off
title Fix MongoDB Connection
color 0A

echo ========================================
echo    FIX MONGODB CLOUD CONNECTION
echo ========================================
echo.

cd /d "%~dp0"

echo Running automatic MongoDB connection fix...
echo This will:
echo 1. Install/update required dependencies
echo 2. Test MongoDB Cloud connection
echo 3. Provide troubleshooting steps if needed
echo.

python simple_fix.py

if errorlevel 1 (
    echo.
    echo ❌ Automatic fix failed
    echo.
    echo Manual troubleshooting required:
    echo 1. Check internet connection
    echo 2. Verify MongoDB Atlas is accessible
    echo 3. Check if IP is whitelisted
    echo 4. Verify connection string credentials
    echo.
    echo Try running: check_mongodb.bat
) else (
    echo.
    echo ✅ MongoDB Cloud connection fixed successfully!
    echo.
    echo You can now run:
    echo - check_mongodb.bat (to verify connection)
    echo - init_database.bat (to initialize database)
    echo - manage_usernames.bat (to manage users)
    echo - run_bot.bat (to start the bot)
)

echo.
pause 