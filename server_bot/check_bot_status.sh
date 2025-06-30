#!/bin/bash

# STATUS BOT - Linux Version
echo "========================================"
echo "           STATUS BOT"
echo "========================================"
echo

# Change to script directory
cd "$(dirname "$0")"

# Check for Python processes
found=0
if pgrep -f "python.*bot" > /dev/null; then
    found=$((found + 1))
fi

if pgrep -f "chromedriver" > /dev/null; then
    found=$((found + 1))
fi

# Check log file
log_file="bot_service.log"
recent=0
if [ -f "$log_file" ]; then
    # Check if log was modified in last 2 minutes
    if [ $(($(date +%s) - $(stat -c %Y "$log_file"))) -le 120 ]; then
        recent=1
    fi
fi

echo "=== STATUS BOT ==="
if [ $found -gt 0 ]; then
    echo "✓ Bot sedang berjalan (proses python/chromedriver ditemukan)"
elif [ $recent -eq 1 ]; then
    echo "✓ Bot kemungkinan masih aktif (log baru diupdate)"
else
    echo "✗ Bot tidak sedang berjalan"
fi

echo
echo "Chrome/python processes: $found"
echo
echo "Log file: $log_file"
if [ -f "$log_file" ]; then
    echo "  Size: $(stat -c %s "$log_file") bytes"
    echo "  Last modified: $(stat -c %y "$log_file")"
else
    echo "  (Log file not found)"
fi

echo
read -p "Press Enter to continue..." 