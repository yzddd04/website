#!/bin/bash

# Script to generate self-signed SSL certificates for HTTPS development
# This creates certificates for localhost development

SSL_DIR="/home/ubuntu/website/ssl"
CERT_FILE="$SSL_DIR/cert.pem"
KEY_FILE="$SSL_DIR/key.pem"

# Create SSL directory if it doesn't exist
mkdir -p "$SSL_DIR"

echo "Generating self-signed SSL certificates for HTTPS development..."

# Generate private key
openssl genrsa -out "$KEY_FILE" 2048

# Generate certificate signing request and self-signed certificate
openssl req -new -x509 -key "$KEY_FILE" -out "$CERT_FILE" -days 365 -subj "/C=ID/ST=Jakarta/L=Jakarta/O=Creator Website/OU=Development/CN=localhost"

# Set proper permissions
chmod 600 "$KEY_FILE"
chmod 644 "$CERT_FILE"

echo "SSL certificates generated successfully!"
echo "Certificate: $CERT_FILE"
echo "Private Key: $KEY_FILE"
echo ""
echo "Note: These are self-signed certificates for development only."
echo "For production, use certificates from a trusted Certificate Authority." 