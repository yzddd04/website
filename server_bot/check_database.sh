#!/bin/bash

# Status Database - Linux Version
echo "========================================"
echo "    STATUS DATABASE"
echo "========================================"
echo

# Change to script directory
cd "$(dirname "$0")"

python3 check_database.py

echo
read -p "Press Enter to continue..." 