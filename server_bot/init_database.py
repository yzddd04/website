from pymongo import MongoClient
from datetime import datetime
import certifi

def init_database():
    """Inisialisasi database dengan contoh data jika kosong."""
    try:
        # Gunakan MongoDB Atlas
        client = MongoClient(
            'mongodb+srv://ahmadyazidarifuddin04:Qwerty12345.@server.hvqf3sk.mongodb.net/?retryWrites=true&w=majority&appName=server',
            tlsCAFile=certifi.where()
        )
        db = client['botwebsite']
        print("=== INISIALISASI DATABASE ===")
        member_count = db['members'].count_documents({})
        print(f"Data member: {member_count}")
        if member_count == 0:
            print("\nDatabase kosong. Menambahkan contoh data...")
            sample_members = [
                {
                    'name': 'Instagram Official',
                    'username': 'instagram',
                    'socialLinks': {'instagram': 'instagram', 'tiktok': ''},
                    'joinDate': datetime.now(),
                    'status': 'active'
                },
                {
                    'name': 'Meta',
                    'username': 'meta',
                    'socialLinks': {'instagram': 'meta', 'tiktok': ''},
                    'joinDate': datetime.now(),
                    'status': 'active'
                },
                {
                    'name': 'TikTok Official',
                    'username': 'tiktok',
                    'socialLinks': {'instagram': '', 'tiktok': 'tiktok'},
                    'joinDate': datetime.now(),
                    'status': 'active'
                },
                {
                    'name': 'ByteDance',
                    'username': 'bytedance',
                    'socialLinks': {'instagram': '', 'tiktok': 'bytedance'},
                    'joinDate': datetime.now(),
                    'status': 'active'
                }
            ]
            db['members'].insert_many(sample_members)
            print("✓ Contoh data berhasil ditambahkan!")
            print("\nUsername Instagram contoh:")
            print("  - instagram")
            print("  - meta")
            print("\nUsername TikTok contoh:")
            print("  - tiktok")
            print("  - bytedance")
        else:
            print("✓ Database sudah berisi data.")
        
        # Inisialisasi database stats
        print("\n=== INISIALISASI DATABASE STATS ===")
        stats_db = client['bot_stats']
        
        # Cek collections stats
        instagram_count = stats_db['instagram_stats'].count_documents({})
        tiktok_count = stats_db['tiktok_stats'].count_documents({})
        
        print(f"Data Instagram stats: {instagram_count}")
        print(f"Data TikTok stats: {tiktok_count}")
        
        # Buat index untuk optimasi
        stats_db['instagram_stats'].create_index([("username", 1), ("timestamp", -1)])
        stats_db['tiktok_stats'].create_index([("username", 1), ("timestamp", -1)])
        print("✓ Index database stats berhasil dibuat.")
        
        client.close()
        print("\n✓ Inisialisasi database selesai!")
        
    except Exception as e:
        print(f"Error: {e}")
        print("Pastikan koneksi internet stabil dan MongoDB Atlas dapat diakses.")

def clear_database():
    """Membersihkan semua data dari database."""
    try:
        client = MongoClient('mongodb://localhost:27017/')
        db = client['bot_stats']
        
        print("=== MEMBERSIHKAN DATABASE ===")
        print("PERINGATAN: Semua data akan dihapus!")
        
        confirm = input("Yakin ingin menghapus semua data? (y/N): ")
        if confirm.lower() == 'y':
            # Hapus semua data
            instagram_result = db['instagram_stats'].delete_many({})
            tiktok_result = db['tiktok_stats'].delete_many({})
            
            print(f"✓ Berhasil menghapus {instagram_result.deleted_count} data Instagram")
            print(f"✓ Berhasil menghapus {tiktok_result.deleted_count} data TikTok")
            print("Database berhasil dibersihkan!")
        else:
            print("Operasi dibatalkan.")
        
        client.close()
        
    except Exception as e:
        print(f"Error: {e}")

def main():
    while True:
        print("\n" + "="*50)
        print("    INISIALISASI DATABASE")
        print("="*50)
        print("1. Inisialisasi dengan contoh data")
        print("2. Bersihkan database")
        print("3. Keluar")
        
        choice = input("\nPilih menu (1-3): ")
        
        if choice == "1":
            init_database()
        elif choice == "2":
            clear_database()
        elif choice == "3":
            print("Keluar...")
            break
        else:
            print("Pilihan tidak valid!")

if __name__ == "__main__":
    main() 