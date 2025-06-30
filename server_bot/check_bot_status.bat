@echo off
chcp 65001 >nul
title STATUS BOT
color 0E

echo ========================================
echo           STATUS BOT
echo ========================================
echo.

REM Cek proses python.exe, pythonw.exe, chromedriver.exe
setlocal enabledelayedexpansion
set /a found=0
for %%P in (python.exe pythonw.exe chromedriver.exe) do (
    tasklist /FI "IMAGENAME eq %%P" 2>NUL | find /I "%%P" >NUL && set /a found=!found!+1
)

REM Cek file log
set log_file=bot_service.log
set recent=0
if exist %log_file% (
    for /f %%A in ('powershell -Command "$log = Get-Item '%log_file%'; $diff = (New-TimeSpan -Start $log.LastWriteTime -End (Get-Date)).TotalMinutes; if ($diff -le 2) { Write-Output 1 } else { Write-Output 0 }"') do set recent=%%A
)

echo === STATUS BOT ===
if %found% gtr 0 (
    echo ✓ Bot sedang berjalan (proses python/pythonw/chromedriver ditemukan)
) else if %recent%==1 (
    echo ✓ Bot kemungkinan masih aktif (log baru diupdate)
) else (
    echo X Bot tidak sedang berjalan
)

echo.
echo Chrome/python processes: %found%
echo.
echo Log file: %log_file%
if exist %log_file% (
    for %%A in (%log_file%) do (
        echo   Size: %%~zA bytes
        echo   Last modified: %%~tA
    )
) else (
    echo   (Log file not found)
)

echo.
echo Press any key to continue . . .
pause >nul
endlocal 