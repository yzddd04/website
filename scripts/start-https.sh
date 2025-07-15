#!/bin/bash

# Script to start the website with HTTPS
# This script generates SSL certificates and starts both frontend and backend

echo "🚀 Starting website with HTTPS..."

# Change to website directory
cd /home/ubuntu/website

# Generate SSL certificates if they don't exist
if [ ! -f "ssl/cert.pem" ] || [ ! -f "ssl/key.pem" ]; then
    echo "📜 Generating SSL certificates..."
    chmod +x scripts/generate-ssl.sh
    ./scripts/generate-ssl.sh
fi

# Install dependencies if needed
echo "📦 Installing dependencies..."
npm install
cd frontend && npm install && cd ..
cd backend && npm install && cd ..

# Build frontend for production
echo "🔨 Building frontend..."
cd frontend
npm run build
cd ..

# Start the application
echo "🌟 Starting application with HTTPS..."
echo "Frontend will be available at: https://localhost:5173"
echo "Backend will be available at: https://localhost:5001"
echo "Nginx will be available at: https://localhost (port 443)"
echo ""
echo "Press Ctrl+C to stop the application"

# Start the application using the existing dev script
npm run dev 