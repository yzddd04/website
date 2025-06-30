# Bot Statistik Sosial Media - Otomatis

Sistem bot untuk memantau statistik Instagram dan TikTok secara otomatis dengan interval 5 detik.

## Fitur

- ✅ **Otomatis dari Database**: Bot mengambil username dari database MongoDB
- ✅ **Interval 5 Detik**: Pengambilan data setiap 5 detik
- ✅ **Multi-Platform**: Support Instagram dan TikTok
- ✅ **Headless Mode**: Berjalan tanpa GUI browser
- ✅ **Anti-Detection**: Menggunakan teknik anti-deteksi
- ✅ **Error Handling**: Penanganan error yang robust
- ✅ **Menu Utama**: Interface yang mudah digunakan
- ✅ **Background Service**: Bisa berjalan di background
- ✅ **Monitoring**: Cek status bot dan database
- ✅ **MongoDB Setup**: Setup otomatis untuk MongoDB
- ✅ **Database Init**: Inisialisasi database dengan contoh data
- ✅ **Readiness Check**: Cek kesiapan sistem secara menyeluruh

## Persyaratan

### Software
- Python 3.7+
- MongoDB (berjalan di localhost:27017)
- Chrome/Chromium browser

### Dependencies Python
```bash
pip install pymongo selenium webdriver-manager psutil
```

## Cara Penggunaan Cepat

### 1. Menu Utama (Recommended)
```bash
# Windows
menu_utama.bat
```

Menu utama menyediakan semua fitur dalam satu interface:
- Install Dependencies
- Setup MongoDB
- Cek Status MongoDB
- Cek Status Database
- Inisialisasi Database
- Manajemen Username
- Sistem Readiness Check
- Jalankan Bot (Foreground/Background)
- Cek Status Bot
- Hentikan Bot Service
- Lihat Log

## Setup Awal

### 1. Install MongoDB
1. Download MongoDB Community dari https://www.mongodb.com/try/download/community
2. Install dengan default settings
3. Pastikan "Install MongoDB as a Service" dicentang
4. Atau gunakan menu utama: "Setup MongoDB"

### 2. Install Dependencies
```bash
# Menggunakan menu utama
menu_utama.bat -> Install Dependencies

# Atau manual
install_dependencies.bat
```

### 3. Cek Status
```bash
# Cek MongoDB
menu_utama.bat -> Cek Status MongoDB

# Cek Database
menu_utama.bat -> Cek Status Database
```

### 4. Inisialisasi Database
```bash
# Menggunakan menu utama
menu_utama.bat -> Inisialisasi Database

# Atau manual
init_database.bat
```

### 5. Readiness Check
```bash
# Menggunakan menu utama
menu_utama.bat -> Sistem Readiness Check

# Atau manual
check_readiness.bat
```

## Struktur Database

### Database: `bot_stats`

#### Collection: `instagram_stats`
```json
{
  "username": "string",
  "followers": "string",
  "timestamp": "datetime"
}
```

#### Collection: `tiktok_stats`
```json
{
  "username": "string",
  "followers": "number",
  "likes": "number",
  "videos": "number",
  "following": "number",
  "timestamp": "datetime"
}
```

## Cara Penggunaan Manual

### 1. Setup Awal
1. Pastikan MongoDB berjalan di `localhost:27017`
2. Install dependencies Python
3. Inisialisasi database dengan contoh data
4. Jalankan readiness check untuk memastikan sistem siap
5. Jalankan script manajemen username untuk menambah username

### 2. Menambah Username
```bash
# Windows
manage_usernames.bat

# Linux/Mac
python add_username.py
```

### 3. Mengecek Status Database
```bash
# Windows
check_database.bat

# Linux/Mac
python check_database.py
```

### 4. Menjalankan Bot
```bash
# Windows - Foreground
run_bot.bat

# Windows - Background Service
run_as_service.bat

# Linux/Mac
python bot_cloud.py
```

### 5. Monitoring
```bash
# Cek status bot
check_bot_status.bat

# Lihat log
view_log.bat

# Hentikan service
stop_service.bat
```

## File Scripts

| File | Deskripsi |
|------|-----------|
| `menu_utama.bat` | **Menu utama** - Interface lengkap |
| `bot_cloud.py` | Script utama bot (otomatis dari database, cloud only) |
| `add_username.py` | Script manajemen username database |
| `check_database.py` | Script cek status database |
| `check_bot_status.py` | Script cek status bot yang berjalan |
| `init_database.py` | Script inisialisasi database |
| `check_readiness.py` | Script cek kesiapan sistem |
| `setup_mongodb.bat` | Script setup MongoDB |
| `check_mongodb.bat` | Script cek status MongoDB |
| `run_bot.bat` | Script batch untuk menjalankan bot |
| `run_as_service.bat` | Script batch untuk menjalankan bot sebagai service |
| `manage_usernames.bat` | Script batch untuk manajemen username |
| `check_database.bat` | Script batch untuk cek database |
| `check_bot_status.bat` | Script batch untuk cek status bot |
| `init_database.bat` | Script batch untuk inisialisasi database |
| `check_readiness.bat` | Script batch untuk readiness check |
| `stop_service.bat` | Script batch untuk hentikan bot service |
| `view_log.bat` | Script batch untuk lihat log bot |
| `install_dependencies.bat` | Script batch untuk install dependencies |

## Cara Kerja

1. **Inisialisasi**: Bot mengambil daftar username dari database
2. **Browser Setup**: Membuka tab untuk setiap username
3. **Loop Utama**: Setiap 5 detik:
   - Beralih ke tab yang sesuai
   - Mengambil data statistik
   - Menyimpan ke database
   - Menampilkan hasil di console

## Mode Berjalan

### 1. Foreground Mode
- Bot berjalan di terminal yang aktif
- Output real-time di console
- Dapat dihentikan dengan Ctrl+C

### 2. Background Service Mode
- Bot berjalan di background
- Output disimpan ke file log
- Dapat dihentikan dengan script `stop_service.bat`

## Readiness Check

Sistem readiness check akan memverifikasi:
- ✅ Versi Python (minimal 3.7)
- ✅ Dependencies Python (pymongo, selenium, webdriver-manager, psutil)
- ✅ Koneksi MongoDB
- ✅ Data di database
- ✅ Chrome browser
- ✅ Koneksi internet

## Troubleshooting

### Error: "MongoDB tidak terinstall"
- Download dan install MongoDB dari website resmi
- Atau gunakan menu utama: "Setup MongoDB"

### Error: "MongoDB tidak berjalan"
- Start MongoDB service: `net start MongoDB`
- Atau jalankan manual: `mongod --dbpath C:\data\db`
- Cek status dengan menu utama: "Cek Status MongoDB"

### Error: "Tidak ada username yang ditemukan di database"
- Pastikan MongoDB berjalan
- Inisialisasi database dengan contoh data: menu utama -> "Inisialisasi Database"
- Tambahkan username menggunakan menu utama atau `manage_usernames.bat`

### Error: "Tidak dapat terhubung ke database MongoDB"
- Pastikan MongoDB service berjalan
- Cek koneksi di `localhost:27017`

### Error: "Dependensi tidak terpenuhi"
- Install dependencies menggunakan menu utama atau `install_dependencies.bat`

### Bot berhenti mendadak
- Cek log error di console atau file log
- Pastikan koneksi internet stabil
- Restart bot jika diperlukan

### Bot tidak berhenti
- Gunakan `stop_service.bat` untuk memaksa berhenti
- Atau gunakan Task Manager untuk end task Python

## Monitoring

Bot akan menampilkan output real-time:
```
Username             Platform      Followers         Likes  Videos Following
--------------------------------------------------------------------------------
instagram_user       instagram          12345         ---     ---      ---
tiktok_user          tiktok            12345        67890     123      456
```

## Keamanan

- Bot menggunakan mode headless untuk keamanan
- Anti-detection untuk menghindari blocking
- Error handling untuk mencegah crash
- Graceful shutdown dengan Ctrl+C

## Catatan

- Bot akan berhenti jika tidak ada username di database
- Data disimpan dengan timestamp untuk tracking
- Interval 5 detik untuk menghindari rate limiting
- Support multi-username simultan
- Menu utama memudahkan penggunaan tanpa command line
- Setup MongoDB otomatis tersedia di menu utama
- Inisialisasi database dengan contoh data untuk testing
- Readiness check memastikan sistem siap sebelum menjalankan bot 