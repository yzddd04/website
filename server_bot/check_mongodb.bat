@echo off
title Check MongoDB Status
color 0E

echo ========================================
echo    CHECK MONGODB STATUS
echo ========================================
echo.

cd /d "%~dp0"

echo Mengecek status MongoDB Cloud...
echo.

python test_connection.py
if errorlevel 1 (
    echo.
    echo ✗ MongoDB Cloud tidak dapat diakses
    echo.
    echo Solusi:
    echo 1. Pastikan koneksi internet stabil
    echo 2. Cek apakah MongoDB Cloud service aktif
    echo 3. Verifikasi connection string
    echo 4. Cek firewall atau proxy settings
    echo.
    echo Untuk troubleshooting:
    echo - Coba akses MongoDB Atlas dashboard
    echo - Periksa network connectivity
    echo - Pastikan IP address diizinkan di MongoDB Atlas
) else (
    echo.
    echo MongoDB Cloud siap digunakan!
)

echo.
pause 