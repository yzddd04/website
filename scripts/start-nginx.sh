#!/bin/bash

# Script to start nginx with HTTPS configuration

echo "🔧 Starting nginx with HTTPS configuration..."

# Change to website directory
cd /home/ubuntu/website

# Generate SSL certificates if they don't exist
if [ ! -f "ssl/cert.pem" ] || [ ! -f "ssl/key.pem" ]; then
    echo "📜 Generating SSL certificates..."
    chmod +x scripts/generate-ssl.sh
    ./scripts/generate-ssl.sh
fi

# Build frontend if dist doesn't exist
if [ ! -d "frontend/dist" ]; then
    echo "🔨 Building frontend..."
    cd frontend
    npm install
    npm run build
    cd ..
fi

# Create logs directory if it doesn't exist
mkdir -p nginx/logs

# Test nginx configuration
echo "🧪 Testing nginx configuration..."
nginx/nginx.exe -t -c /home/ubuntu/website/nginx/conf/nginx.conf

if [ $? -eq 0 ]; then
    echo "✅ Nginx configuration is valid"
    
    # Start nginx
    echo "🚀 Starting nginx..."
    nginx/nginx.exe -c /home/ubuntu/website/nginx/conf/nginx.conf
    
    echo "✅ Nginx started successfully!"
    echo "🌐 Website is now available at: https://localhost"
    echo "📊 Health check: https://localhost/health"
    echo ""
    echo "To stop nginx, run: nginx/nginx.exe -s stop"
    echo "To reload configuration: nginx/nginx.exe -s reload"
else
    echo "❌ Nginx configuration is invalid"
    exit 1
fi 