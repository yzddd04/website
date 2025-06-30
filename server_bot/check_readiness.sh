#!/bin/bash

# Sistem Readiness Check - Linux Version
echo "========================================"
echo "    SISTEM READINESS CHECK"
echo "========================================"
echo

# Change to script directory
cd "$(dirname "$0")"

python3 check_readiness.py

echo
read -p "Press Enter to continue..." 