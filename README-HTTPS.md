# Website HTTPS Configuration

Website ini telah dikonfigurasi untuk berjalan dengan HTTPS. Berikut adalah panduan lengkap untuk menjalankan website dengan keamanan SSL/TLS.

## 🚀 Cara Menjalankan Website dengan HTTPS

### Opsi 1: Menggunakan Script Otomatis (Direkomendasikan)

```bash
cd /home/ubuntu/website
./scripts/start-https.sh
```

Script ini akan:
- Generate SSL certificates secara otomatis
- Install semua dependencies
- Build frontend
- Start backend dan frontend dengan HTTPS

### Opsi 2: Menggunakan Nginx sebagai Reverse Proxy

```bash
cd /home/ubuntu/website
./scripts/start-nginx.sh
```

Script ini akan:
- Generate SSL certificates
- Build frontend
- Start nginx dengan konfigurasi HTTPS
- Serve website di port 443 (HTTPS)

### Opsi 3: Manual Setup

1. **Generate SSL Certificates:**
   ```bash
   cd /home/ubuntu/website
   ./scripts/generate-ssl.sh
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   cd frontend && npm install && cd ..
   cd backend && npm install && cd ..
   ```

3. **Build Frontend:**
   ```bash
   cd frontend
   npm run build
   cd ..
   ```

4. **Start Backend:**
   ```bash
   cd backend
   npm run dev
   ```

5. **Start Frontend (di terminal terpisah):**
   ```bash
   cd frontend
   npm run dev
   ```

## 🌐 Akses Website

Setelah menjalankan salah satu opsi di atas, website akan tersedia di:

- **Frontend Development:** https://localhost:5173
- **Backend API:** https://localhost:5001
- **Nginx (Production):** https://localhost (port 443)
- **Health Check:** https://localhost/health

## 🔧 Konfigurasi

### SSL Certificates
- **Lokasi:** `/home/ubuntu/website/ssl/`
- **Certificate:** `cert.pem`
- **Private Key:** `key.pem`
- **Validitas:** 365 hari (self-signed)

### Nginx Configuration
- **File:** `/home/ubuntu/website/nginx/conf/nginx.conf`
- **Features:**
  - HTTP to HTTPS redirect
  - SSL/TLS security headers
  - Rate limiting
  - Gzip compression
  - Static file caching
  - CORS support

### Backend Configuration
- **Port:** 5001 (HTTPS)
- **SSL:** Auto-detection of certificates
- **Fallback:** HTTP jika SSL certificates tidak ditemukan

### Frontend Configuration
- **Port:** 5173 (HTTPS)
- **Proxy:** API calls ke backend HTTPS
- **SSL:** Menggunakan certificates yang sama

## 🛡️ Fitur Keamanan

### SSL/TLS Security
- TLS 1.2 dan 1.3
- Strong cipher suites
- HSTS (HTTP Strict Transport Security)
- Security headers

### Rate Limiting
- API endpoints: 10 requests/second
- Login endpoint: 5 requests/minute

### Security Headers
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin

## 🔍 Troubleshooting

### SSL Certificate Issues
```bash
# Regenerate certificates
rm -rf ssl/
./scripts/generate-ssl.sh
```

### Port Already in Use
```bash
# Check what's using the port
sudo netstat -tulpn | grep :443
sudo netstat -tulpn | grep :5001
sudo netstat -tulpn | grep :5173
```

### Nginx Issues
```bash
# Test configuration
nginx/nginx.exe -t -c /home/ubuntu/website/nginx/conf/nginx.conf

# Reload configuration
nginx/nginx.exe -s reload

# Stop nginx
nginx/nginx.exe -s stop
```

### Browser Security Warnings
Karena menggunakan self-signed certificates, browser akan menampilkan warning. Untuk development, ini normal dan bisa diabaikan dengan:
- Chrome: Advanced → Proceed to localhost
- Firefox: Advanced → Accept the Risk and Continue

## 📝 Notes

- **Development:** Self-signed certificates untuk development
- **Production:** Gunakan certificates dari Certificate Authority (Let's Encrypt, dll)
- **Ports:** Pastikan port 80, 443, 5001, dan 5173 tidak digunakan aplikasi lain
- **Firewall:** Pastikan port-port tersebut terbuka di firewall

## 🚀 Production Deployment

Untuk production, ganti self-signed certificates dengan certificates dari CA:

1. **Let's Encrypt (Gratis):**
   ```bash
   sudo apt install certbot
   sudo certbot certonly --standalone -d yourdomain.com
   ```

2. **Update nginx.conf:**
   ```nginx
   ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
   ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
   ```

3. **Auto-renewal:**
   ```bash
   sudo crontab -e
   # Add: 0 12 * * * /usr/bin/certbot renew --quiet
   ``` 