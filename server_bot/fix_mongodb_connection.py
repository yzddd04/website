#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import subprocess
import sys
import os
from pymongo import MongoClient
import certifi

def install_dependencies():
    """Install required Python packages"""
    print("=== INSTALLING DEPENDENCIES ===")
    packages = ['pymongo', 'certifi', 'dnspython']
    
    for package in packages:
        try:
            print(f"Installing {package}...")
            subprocess.check_call([sys.executable, '-m', 'pip', 'install', package, '--upgrade'])
            print(f"✓ {package} installed successfully")
        except subprocess.CalledProcessError as e:
            print(f"✗ Failed to install {package}: {e}")
            return False
    return True

def test_connection_with_retry():
    """Test MongoDB connection with multiple retry attempts"""
    print("\n=== TESTING MONGODB CONNECTION ===")
    
    # Different connection configurations to try
    configs = [
        {
            'name': 'Standard with certifi',
            'uri': 'mongodb+srv://ahmadyazidarifuddin04:Qwerty12345.@server.hvqf3sk.mongodb.net/?retryWrites=true&w=majority&appName=server',
            'options': {
                'tlsCAFile': certifi.where(),
                'serverSelectionTimeoutMS': 30000,
                'connectTimeoutMS': 30000,
                'socketTimeoutMS': 30000
            }
        },
        {
            'name': 'Without certifi',
            'uri': 'mongodb+srv://ahmadyazidarifuddin04:Qwerty12345.@server.hvqf3sk.mongodb.net/?retryWrites=true&w=majority&appName=server',
            'options': {
                'serverSelectionTimeoutMS': 30000,
                'connectTimeoutMS': 30000,
                'socketTimeoutMS': 30000
            }
        }
    ]
    
    for config in configs:
        print(f"\nTrying: {config['name']}")
        try:
            client = MongoClient(config['uri'], **config['options'])
            client.admin.command('ping')
            print(f"✓ {config['name']} - SUCCESS!")
            client.close()
            return True, config
        except Exception as e:
            print(f"✗ {config['name']} - FAILED: {type(e).__name__}")
            continue
    
    return False, None

def update_connection_strings(working_config):
    """Update all files with the working connection string"""
    print("\n=== UPDATING CONNECTION STRINGS ===")
    
    # Files to update with their connection string patterns
    files_to_update = [
        ('bot_cloud.py', 'mongodb+srv://ahmadyazidarifuddin04:Qwerty12345.@server.hvqf3sk.mongodb.net/bot_mongodb?retryWrites=true&w=majority&appName=server'),
        ('bot_cloud.py', 'mongodb+srv://ahmadyazidarifuddin04:Qwerty12345.@server.hvqf3sk.mongodb.net/botwebsite?retryWrites=true&w=majority&appName=server'),
        ('add_username.py', 'mongodb+srv://ahmadyazidarifuddin04:Qwerty12345.@server.hvqf3sk.mongodb.net/botwebsite?retryWrites=true&w=majority&appName=server'),
        ('init_database.py', 'mongodb+srv://ahmadyazidarifuddin04:Qwerty12345.@server.hvqf3sk.mongodb.net/botwebsite?retryWrites=true&w=majority&appName=server'),
        ('check_database.py', 'mongodb+srv://ahmadyazidarifuddin04:Qwerty12345.@server.hvqf3sk.mongodb.net/bot_stats?retryWrites=true&w=majority&appName=server'),
        ('check_readiness.py', 'mongodb+srv://ahmadyazidarifuddin04:Qwerty12345.@server.hvqf3sk.mongodb.net/?retryWrites=true&w=majority&appName=server')
    ]
    
    for filename, old_uri in files_to_update:
        if os.path.exists(filename):
            try:
                with open(filename, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Update the connection string
                new_uri = working_config['uri']
                if 'bot_mongodb' in old_uri:
                    new_uri = new_uri.replace('?retryWrites=true&w=majority&appName=server', '/bot_mongodb?retryWrites=true&w=majority&appName=server')
                elif 'bot_stats' in old_uri:
                    new_uri = new_uri.replace('?retryWrites=true&w=majority&appName=server', 'bot_stats?retryWrites=true&w=majority&appName=server')
                elif 'botwebsite' in old_uri:
                    new_uri = new_uri.replace('?retryWrites=true&w=majority&appName=server', 'botwebsite?retryWrites=true&w=majority&appName=server')
                
                content = content.replace(old_uri, new_uri)
                
                with open(filename, 'w', encoding='utf-8') as f:
                    f.write(content)
                
                print(f"✓ Updated {filename}")
            except Exception as e:
                print(f"✗ Failed to update {filename}: {e}")

def create_optimized_connection_module():
    """Create an optimized connection module"""
    print("\n=== CREATING OPTIMIZED CONNECTION MODULE ===")
    
    connection_module = '''#!/usr/bin/env python3
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
'''
    
    try:
        with open('mongodb_connection.py', 'w', encoding='utf-8') as f:
            f.write(connection_module)
        print("✓ Created mongodb_connection.py")
    except Exception as e:
        print(f"✗ Failed to create connection module: {e}")

def main():
    """Main function to fix MongoDB connection issues"""
    print("=== MONGODB CLOUD CONNECTION FIXER ===")
    print("Automatically fixing MongoDB Cloud connection issues...")
    
    # Step 1: Install dependencies
    if not install_dependencies():
        print("Failed to install dependencies")
        return False
    
    # Step 2: Test connection with retry
    success, working_config = test_connection_with_retry()
    
    if success:
        print(f"\n🎉 CONNECTION SUCCESSFUL with: {working_config['name']}")
        
        # Step 3: Update all files with working configuration
        update_connection_strings(working_config)
        
        # Step 4: Create optimized connection module
        create_optimized_connection_module()
        
        print("\n✅ ALL FIXES APPLIED SUCCESSFULLY!")
        print("You can now run your bot and website applications.")
        return True
    else:
        print("\n❌ ALL CONNECTION ATTEMPTS FAILED")
        print("Please check:")
        print("1. Internet connection")
        print("2. MongoDB Atlas service status")
        print("3. IP whitelist in MongoDB Atlas")
        print("4. Username/password in connection string")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 