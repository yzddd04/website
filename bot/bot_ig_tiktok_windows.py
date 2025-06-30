from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
from datetime import datetime
import re
from pymongo import MongoClient
import pymongo
import certifi

# MongoDB Cloud Connection
MONGODB_URI = 'mongodb+srv://ahmadyazidarifuddin04:Qwerty12345.@server.hvqf3sk.mongodb.net/bot_mongodb?retryWrites=true&w=majority&appName=server'

def connect_to_mongodb():
    """Connect to MongoDB Cloud"""
    try:
        ca = certifi.where()
        client = MongoClient(MONGODB_URI, tlsCAFile=ca, serverSelectionTimeoutMS=15000)
        client.server_info()  # Test connection
        print("✓ Connected to MongoDB Cloud successfully")
        return client
    except Exception as e:
        print(f"✗ Failed to connect to MongoDB Cloud: {e}")
        return None

def get_users_from_database(client):
    """Get usernames from botwebsite.members collection"""
    try:
        db = client['botwebsite']
        users_to_monitor = []
        members = db['members'].find({})
        for member in members:
            # Instagram
            ig_username = member.get('socialLinks', {}).get('instagram', '').strip()
            if ig_username:
                users_to_monitor.append({'username': ig_username, 'platform': 'instagram'})
            # TikTok
            tiktok_username = member.get('socialLinks', {}).get('tiktok', '').strip()
            if tiktok_username:
                users_to_monitor.append({'username': tiktok_username, 'platform': 'tiktok'})
        return users_to_monitor
    except Exception as e:
        print(f"Error getting users from database: {e}")
        return []

def save_stats_to_mongodb(client, username, platform, stats):
    """Save statistics to MongoDB Cloud"""
    try:
        db = client['bot_mongodb']
        collection = db['stats']
        
        data = {
            'timestamp': datetime.now(),
            'username': username,
            'platform': platform,
            'stats': stats
        }
        
        collection.insert_one(data)
        print(f"✓ Saved stats for {username} ({platform})")
    except Exception as e:
        print(f"✗ Failed to save stats: {e}")

def main():
    print("=== BOT INSTAGRAM TIKTOK WINDOWS ===")
    print("Connecting to MongoDB Cloud...")
    
    # Connect to MongoDB
    client = connect_to_mongodb()
    if not client:
        print("Cannot proceed without database connection")
        return
    
    # Get users from database
    users = get_users_from_database(client)
    if not users:
        print("No users found in database")
        return
    
    print(f"Found {len(users)} users to monitor:")
    for user in users:
        print(f"  - {user['username']} ({user['platform']})")
    
    # Setup browser
    print("\nSetting up browser...")
    options = webdriver.ChromeOptions()
    options.add_argument("--headless=new")
    options.add_argument("--disable-notifications")
    options.add_argument('--log-level=3')
    
    try:
        driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
        print("✓ Browser setup complete")
        
        # Main monitoring loop
        print("\nStarting monitoring...")
        for user in users:
            try:
                if user['platform'] == 'instagram':
                    url = f"https://livecounts.nl/instagram-realtime/?u={user['username']}"
                else:  # tiktok
                    url = f"https://tokcounter.com/id?user={user['username']}"
                
                driver.get(url)
                time.sleep(5)  # Wait for page to load
                
                # Basic stats collection (you can expand this)
                stats = {
                    'followers': 'N/A',
                    'timestamp': datetime.now().isoformat()
                }
                
                # Save to MongoDB
                save_stats_to_mongodb(client, user['username'], user['platform'], stats)
                
            except Exception as e:
                print(f"✗ Error processing {user['username']}: {e}")
        
        driver.quit()
        print("\n✓ Monitoring completed")
        
    except Exception as e:
        print(f"✗ Browser error: {e}")
    
    finally:
        if 'client' in locals():
            client.close()

if __name__ == "__main__":
    main() 