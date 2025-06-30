#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from pymongo import MongoClient
import certifi
import time

def get_mongodb_client(database_name=None):
    """Get MongoDB client with optimized settings"""
    base_uri = 'mongodb+srv://ahmadyazidarifuddin04:Qwerty12345.@server.hvqf3sk.mongodb.net/?retryWrites=true&w=majority&appName=server'
    
    if database_name:
        uri = base_uri.replace('?retryWrites=true&w=majority&appName=server', f'/{database_name}?retryWrites=true&w=majority&appName=server')
    else:
        uri = base_uri
    
    # Try different connection configurations
    configs = [
        {
            'tlsCAFile': certifi.where(),
            'serverSelectionTimeoutMS': 30000,
            'connectTimeoutMS': 30000,
            'socketTimeoutMS': 30000,
            'maxPoolSize': 10,
            'minPoolSize': 1
        },
        {
            'serverSelectionTimeoutMS': 30000,
            'connectTimeoutMS': 30000,
            'socketTimeoutMS': 30000,
            'maxPoolSize': 10,
            'minPoolSize': 1
        }
    ]
    
    for config in configs:
        try:
            client = MongoClient(uri, **config)
            client.admin.command('ping')
            return client
        except Exception:
            continue
    
    raise Exception("Failed to connect to MongoDB Cloud with any configuration")

def test_connection():
    """Test MongoDB connection"""
    try:
        client = get_mongodb_client()
        client.admin.command('ping')
        print("✓ MongoDB Cloud connection successful!")
        client.close()
        return True
    except Exception as e:
        print(f"✗ MongoDB Cloud connection failed: {e}")
        return False

if __name__ == "__main__":
    test_connection()
