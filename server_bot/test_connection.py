#!/usr/bin/env python3
"""
Test script untuk memverifikasi koneksi ke MongoDB Atlas
"""

from pymongo import MongoClient
import certifi
from datetime import datetime

def test_mongodb_atlas_connection():
    """Test koneksi ke MongoDB Atlas"""
    print("=" * 50)
    print("TEST KONEKSI MONGODB ATLAS")
    print("=" * 50)
    
    # Connection string
    connection_string = "mongodb+srv://ahmadyazidarifuddin04:Qwerty12345.@server.hvqf3sk.mongodb.net/?retryWrites=true&w=majority&appName=server"
    
    try:
        print("1. Mencoba koneksi ke MongoDB Atlas...")
        client = MongoClient(
            connection_string,
            tlsCAFile=certifi.where(),
            serverSelectionTimeoutMS=10000
        )
        
        # Test koneksi
        client.admin.command('ping')
        print("✓ Koneksi ke MongoDB Atlas berhasil!")
        
        # Test akses database botwebsite
        print("\n2. Testing database 'botwebsite'...")
        db_botwebsite = client['botwebsite']
        collections = db_botwebsite.list_collection_names()
        print(f"✓ Database 'botwebsite' dapat diakses")
        print(f"  Collections: {', '.join(collections) if collections else 'Tidak ada collections'}")
        
        # Test akses database bot_stats
        print("\n3. Testing database 'bot_stats'...")
        db_bot_stats = client['bot_stats']
        collections = db_bot_stats.list_collection_names()
        print(f"✓ Database 'bot_stats' dapat diakses")
        print(f"  Collections: {', '.join(collections) if collections else 'Tidak ada collections'}")
        
        # Test write operation
        print("\n4. Testing write operation...")
        test_collection = db_bot_stats['test_connection']
        test_doc = {
            'test': True,
            'timestamp': datetime.now(),
            'message': 'Connection test successful'
        }
        result = test_collection.insert_one(test_doc)
        print(f"✓ Write operation berhasil! Document ID: {result.inserted_id}")
        
        # Clean up test data
        test_collection.delete_one({'_id': result.inserted_id})
        print("✓ Test data berhasil dihapus")
        
        # Get server info
        print("\n5. Server Information:")
        server_info = client.server_info()
        print(f"  MongoDB Version: {server_info.get('version', 'Unknown')}")
        print(f"  Server: {server_info.get('host', 'Unknown')}")
        
        client.close()
        print("\n" + "=" * 50)
        print("✓ SEMUA TEST BERHASIL!")
        print("MongoDB Atlas siap digunakan untuk deployment.")
        print("=" * 50)
        return True
        
    except Exception as e:
        print(f"\n✗ ERROR: {e}")
        print("\nTroubleshooting:")
        print("1. Pastikan koneksi internet stabil")
        print("2. Cek apakah MongoDB Atlas dapat diakses")
        print("3. Verifikasi username dan password")
        print("4. Pastikan IP address diizinkan di MongoDB Atlas")
        print("\n" + "=" * 50)
        return False

def test_website_database():
    """Test khusus untuk database website"""
    print("\n" + "=" * 50)
    print("TEST DATABASE WEBSITE")
    print("=" * 50)
    
    try:
        client = MongoClient(
            "mongodb+srv://ahmadyazidarifuddin04:Qwerty12345.@server.hvqf3sk.mongodb.net/?retryWrites=true&w=majority&appName=server",
            tlsCAFile=certifi.where()
        )
        
        db = client['botwebsite']
        
        # Test collections yang diperlukan
        required_collections = ['users', 'articles', 'news', 'members']
        existing_collections = db.list_collection_names()
        
        print("Collections yang diperlukan:")
        for collection in required_collections:
            if collection in existing_collections:
                count = db[collection].count_documents({})
                print(f"  ✓ {collection}: {count} documents")
            else:
                print(f"  ✗ {collection}: Tidak ditemukan")
        
        # Test stats database
        print("\nStats Database:")
        stats_db = client['bot_stats']
        stats_collections = stats_db.list_collection_names()
        
        for collection in ['instagram_stats', 'tiktok_stats']:
            if collection in stats_collections:
                count = stats_db[collection].count_documents({})
                print(f"  ✓ {collection}: {count} documents")
            else:
                print(f"  ✗ {collection}: Tidak ditemukan")
        
        client.close()
        print("\n✓ Database website test selesai!")
        
    except Exception as e:
        print(f"✗ Error testing website database: {e}")

if __name__ == "__main__":
    # Test koneksi utama
    success = test_mongodb_atlas_connection()
    
    if success:
        # Test database website
        test_website_database()
        
        print("\n" + "=" * 50)
        print("MIGRASI KE MONGODB ATLAS BERHASIL!")
        print("=" * 50)
        print("\nLangkah selanjutnya:")
        print("1. Deploy ke AWS EC2")
        print("2. Jalankan: python init_database.py")
        print("3. Start backend: cd website/server && npm start")
        print("4. Start frontend: cd website && npm run dev")
        print("5. (Optional) Jalankan bot: python bot_cloud.py")
    else:
        print("\n" + "=" * 50)
        print("MIGRASI GAGAL - PERBAIKI MASALAH DI ATAS")
        print("=" * 50) 