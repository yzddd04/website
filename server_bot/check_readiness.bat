@echo off
title Sistem Readiness Check
color 0E

echo ========================================
echo    SISTEM READINESS CHECK
echo ========================================
echo.

cd /d "%~dp0"

python check_readiness.py

echo.
pause 