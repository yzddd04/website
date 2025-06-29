#!/bin/bash

# Script Deployment untuk AWS EC2
# Pastikan menjalankan script ini sebagai root atau dengan sudo

echo "========================================"
echo "    DEPLOYMENT SCRIPT AWS EC2"
echo "========================================"
echo

# Update system
echo "1. Updating system packages..."
sudo apt-get update
sudo apt-get upgrade -y

# Install Node.js
echo "2. Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Python and pip
echo "3. Installing Python and pip..."
sudo apt-get install -y python3 python3-pip python3-venv

# Install Chrome/Chromium
echo "4. Installing Chrome/Chromium..."
sudo apt-get install -y wget gnupg
wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" | sudo tee /etc/apt/sources.list.d/google-chrome.list
sudo apt-get update
sudo apt-get install -y google-chrome-stable

# Install PM2 for process management
echo "5. Installing PM2..."
sudo npm install -g pm2

# Create application directory
echo "6. Setting up application directory..."
APP_DIR="/opt/bot-website"
sudo mkdir -p $APP_DIR
sudo chown $USER:$USER $APP_DIR

# Copy application files (assuming they're in current directory)
echo "7. Copying application files..."
cp -r . $APP_DIR/
cd $APP_DIR

# Install Node.js dependencies
echo "8. Installing Node.js dependencies..."
cd website/server
npm install
cd ../
npm install

# Install Python dependencies
echo "9. Installing Python dependencies..."
cd ../server_bot
pip3 install -r requirements.txt

# Test MongoDB connection
echo "10. Testing MongoDB Atlas connection..."
python3 test_connection.py

if [ $? -eq 0 ]; then
    echo "✓ MongoDB Atlas connection successful!"
else
    echo "✗ MongoDB Atlas connection failed!"
    echo "Please check your internet connection and MongoDB Atlas configuration."
    exit 1
fi

# Initialize database
echo "11. Initializing database..."
python3 init_database.py

# Create PM2 ecosystem file
echo "12. Creating PM2 configuration..."
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [
    {
      name: 'bot-website-backend',
      cwd: '$APP_DIR/website/server',
      script: 'index.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
        MONGO_URI: 'mongodb+srv://ahmadyazidarifuddin04:Qwerty12345.@server.hvqf3sk.mongodb.net/?retryWrites=true&w=majority&appName=server'
      }
    },
    {
      name: 'bot-website-frontend',
      cwd: '$APP_DIR/website',
      script: 'npm',
      args: 'run dev -- --host 0.0.0.0 --port 3000',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
EOF

# Start services
echo "13. Starting services..."
cd $APP_DIR
pm2 start ecosystem.config.js
pm2 save
pm2 startup

echo "14. Setting up firewall..."
# Allow HTTP, HTTPS, and application ports
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 3000
sudo ufw allow 5000
sudo ufw --force enable

# Create nginx configuration
echo "15. Setting up Nginx reverse proxy..."
sudo apt-get install -y nginx

sudo tee /etc/nginx/sites-available/bot-website > /dev/null << EOF
server {
    listen 80;
    server_name _;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/bot-website /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

echo
echo "========================================"
echo "    DEPLOYMENT SELESAI!"
echo "========================================"
echo
echo "Services Status:"
pm2 status
echo
echo "Application URLs:"
echo "  Frontend: http://$(curl -s ifconfig.me):3000"
echo "  Backend API: http://$(curl -s ifconfig.me):5000"
echo "  Nginx (Port 80): http://$(curl -s ifconfig.me)"
echo
echo "Useful Commands:"
echo "  PM2 logs: pm2 logs"
echo "  Restart services: pm2 restart all"
echo "  Stop services: pm2 stop all"
echo
echo "Nginx:"
echo "  Status: sudo systemctl status nginx"
echo "  Restart: sudo systemctl restart nginx"
echo
echo "Firewall:"
echo "  Status: sudo ufw status" 