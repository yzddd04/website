from pymongo import MongoClient
from datetime import datetime, timedelta

def check_database_status():
    """Mengecek status database dan menampilkan informasi."""
    try:
        client = MongoClient('mongodb+srv://ahmadyazidarifuddin04:Qwerty12345.@server.hvqf3sk.mongodb.net/bot_stats?retryWrites=true&w=majority&appName=server')
        db = client['bot_stats']
        
        print("=== STATUS DATABASE ===")
        
        # Cek koneksi
        client.admin.command('ping')
        print("✓ Database terhubung")
        
        # Cek collections
        collections = db.list_collection_names()
        print(f"✓ Collections: {', '.join(collections)}")
        
        # Statistik Instagram
        instagram_count = db['instagram_stats'].count_documents({})
        instagram_users = db['instagram_stats'].distinct('username')
        print(f"\n📸 Instagram:")
        print(f"  - Total data: {instagram_count}")
        print(f"  - Username unik: {len(instagram_users)}")
        if instagram_users:
            print(f"  - Username: {', '.join(instagram_users)}")
        
        # Statistik TikTok
        tiktok_count = db['tiktok_stats'].count_documents({})
        tiktok_users = db['tiktok_stats'].distinct('username')
        print(f"\n🎵 TikTok:")
        print(f"  - Total data: {tiktok_count}")
        print(f"  - Username unik: {len(tiktok_users)}")
        if tiktok_users:
            print(f"  - Username: {', '.join(tiktok_users)}")
        
        # Data terbaru
        print(f"\n📊 Data Terbaru:")
        
        # Instagram terbaru
        latest_instagram = db['instagram_stats'].find_one(
            sort=[('timestamp', -1)]
        )
        if latest_instagram:
            print(f"  - Instagram: {latest_instagram['username']} - {latest_instagram['followers']} followers")
            print(f"    Waktu: {latest_instagram['timestamp'].strftime('%Y-%m-%d %H:%M:%S')}")
        
        # TikTok terbaru
        latest_tiktok = db['tiktok_stats'].find_one(
            sort=[('timestamp', -1)]
        )
        if latest_tiktok:
            print(f"  - TikTok: {latest_tiktok['username']} - {latest_tiktok['followers']} followers")
            print(f"    Waktu: {latest_tiktok['timestamp'].strftime('%Y-%m-%d %H:%M:%S')}")
        
        # Data hari ini
        today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        today_instagram = db['instagram_stats'].count_documents({
            'timestamp': {'$gte': today}
        })
        today_tiktok = db['tiktok_stats'].count_documents({
            'timestamp': {'$gte': today}
        })
        
        print(f"\n📅 Data Hari Ini:")
        print(f"  - Instagram: {today_instagram} records")
        print(f"  - TikTok: {today_tiktok} records")
        
        client.close()
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_database_status() 