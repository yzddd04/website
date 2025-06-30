#!/bin/bash

# Bot Statistik Sosial Media - Menu Utama - Linux Version

menu() {
    clear
    echo "========================================"
    echo "    BOT STATISTIK SOSIAL MEDIA"
    echo "    Menu Utama"
    echo "========================================"
    echo
    echo "1. 📦 INSTALL ALL DEPENDENCIES"
    echo "2. 🔧 FIX MISSING IMPORTS"
    echo "3. Setup MongoDB"
    echo "4. Cek Status MongoDB"
    echo "5. Cek Status Database"
    echo "6. Inisialisasi Database"
    echo "7. Manajemen Username"
    echo "8. Sistem Readiness Check"
    echo "9. 🔧 PERBAIKI KONEKSI MONGODB (OTOMATIS)"
    echo "10. ⚡ QUICK FIX MONGODB"
    echo "11. 🚗 PERBAIKI CHROMEDRIVER"
    echo "12. 🎯 AUTO FIX SEMUA MASALAH"
    echo "13. Jalankan Bot (Foreground)"
    echo "14. Jalankan Bot (Background/Service)"
    echo "15. Cek Status Bot"
    echo "16. Hentikan Bot Service"
    echo "17. Lihat Log Bot Service"
    echo "18. Keluar"
    echo
    echo "========================================"
    read -p "Pilih menu (1-18): " choice

    case $choice in
        1) install ;;
        2) fix_imports ;;
        3) setup_mongo ;;
        4) check_mongo ;;
        5) check_db ;;
        6) init_db ;;
        7) manage_users ;;
        8) readiness ;;
        9) fix_mongodb ;;
        10) quick_fix ;;
        11) fix_chromedriver ;;
        12) auto_fix_all ;;
        13) run_bot ;;
        14) run_service ;;
        15) check_bot ;;
        16) stop_service ;;
        17) view_log ;;
        18) exit_script ;;
        *) menu ;;
    esac
}

install() {
    clear
    ./install_deps.sh
    menu
}

fix_imports() {
    clear
    ./fix_imports.sh
    menu
}

setup_mongo() {
    clear
    echo "========================================"
    echo "   SETUP MONGODB CLOUD"
    echo "========================================"
    echo
    echo "Project ini hanya menggunakan MongoDB Cloud (Atlas)."
    echo "Tidak perlu install MongoDB lokal."
    echo "Pastikan connection string sudah benar dan IP server sudah di-whitelist di MongoDB Atlas."
    echo "Cek koneksi MongoDB Cloud:"
    python3 test_connection.py
    echo
    read -p "Tekan Enter untuk kembali ke menu utama..."
    menu
}

check_mongo() {
    clear
    ./check_mongodb.sh
    menu
}

check_db() {
    clear
    ./check_database.sh
    menu
}

init_db() {
    clear
    ./init_database.sh
    menu
}

manage_users() {
    clear
    ./manage_usernames.sh
    menu
}

readiness() {
    clear
    ./check_readiness.sh
    menu
}

fix_mongodb() {
    clear
    ./fix_mongodb.sh
    menu
}

quick_fix() {
    clear
    ./quick_fix.sh
    menu
}

fix_chromedriver() {
    clear
    ./fix_chromedriver.sh
    menu
}

auto_fix_all() {
    clear
    ./auto_fix_all.sh
    menu
}

run_bot() {
    clear
    ./run_bot.sh
    menu
}

run_service() {
    clear
    ./run_as_service.sh
    menu
}

check_bot() {
    clear
    ./check_bot_status.sh
    menu
}

stop_service() {
    clear
    ./stop_service.sh
    menu
}

view_log() {
    clear
    ./view_log.sh
    menu
}

exit_script() {
    echo
    echo "Terima kasih telah menggunakan Bot Statistik Sosial Media!"
    echo
    exit 0
}

# Start the menu
menu 