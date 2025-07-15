#!/bin/bash

# Script to test HTTPS configuration

echo "🧪 Testing HTTPS configuration..."

# Check if SSL certificates exist
if [ -f "ssl/cert.pem" ] && [ -f "ssl/key.pem" ]; then
    echo "✅ SSL certificates found"
else
    echo "❌ SSL certificates not found"
    echo "Generating certificates..."
    ./scripts/generate-ssl.sh
fi

# Test nginx configuration
echo "🧪 Testing nginx configuration..."
if nginx/nginx.exe -t -c /home/ubuntu/website/nginx/conf/nginx.conf > /dev/null 2>&1; then
    echo "✅ Nginx configuration is valid"
else
    echo "❌ Nginx configuration is invalid"
    exit 1
fi

# Check if ports are available
echo "🧪 Checking port availability..."

check_port() {
    local port=$1
    if netstat -tuln | grep ":$port " > /dev/null 2>&1; then
        echo "⚠️  Port $port is already in use"
        return 1
    else
        echo "✅ Port $port is available"
        return 0
    fi
}

check_port 80
check_port 443
check_port 5001
check_port 5173

echo ""
echo "🎉 HTTPS configuration test completed!"
echo ""
echo "To start the website with HTTPS:"
echo "  ./scripts/start-https.sh"
echo ""
echo "Or use nginx as reverse proxy:"
echo "  ./scripts/start-nginx.sh" 