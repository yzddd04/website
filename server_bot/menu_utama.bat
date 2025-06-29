@echo off
title Bot Statistik Sosial Media - Menu Utama
color 0A

:menu
cls
echo ========================================
echo    BOT STATISTIK SOSIAL MEDIA
echo    Menu Utama
echo ========================================
echo.
echo 1. Install Dependencies
echo 2. Setup MongoDB
echo 3. Cek Status MongoDB
echo 4. Cek Status Database
echo 5. Inisialisasi Database
echo 6. Manajemen Username
echo 7. Sistem Readiness Check
echo 8. Jalankan Bot (Foreground)
echo 9. Jalankan Bot (Background/Service)
echo 10. Cek Status Bot
echo 11. Hentikan Bot Service
echo 12. Lihat Log Bot Service
echo 13. Keluar
echo.
echo ========================================
set /p choice="Pilih menu (1-13): "

if "%choice%"=="1" goto install
if "%choice%"=="2" goto setup_mongo
if "%choice%"=="3" goto check_mongo
if "%choice%"=="4" goto check_db
if "%choice%"=="5" goto init_db
if "%choice%"=="6" goto manage_users
if "%choice%"=="7" goto readiness
if "%choice%"=="8" goto run_bot
if "%choice%"=="9" goto run_service
if "%choice%"=="10" goto check_bot
if "%choice%"=="11" goto stop_service
if "%choice%"=="12" goto view_log
if "%choice%"=="13" goto exit
goto menu

:install
cls
call install_dependencies.bat
goto menu

:setup_mongo
cls
call setup_mongodb.bat
goto menu

:check_mongo
cls
call check_mongodb.bat
goto menu

:check_db
cls
call check_database.bat
goto menu

:init_db
cls
call init_database.bat
goto menu

:manage_users
cls
call manage_usernames.bat
goto menu

:readiness
cls
call check_readiness.bat
goto menu

:run_bot
cls
call run_bot.bat
goto menu

:run_service
cls
call run_as_service.bat
goto menu

:check_bot
cls
call check_bot_status.bat
goto menu

:stop_service
cls
call stop_service.bat
goto menu

:view_log
cls
call view_log.bat
goto menu

:exit
echo.
echo Terima kasih telah menggunakan Bot Statistik Sosial Media!
echo.
pause
exit 