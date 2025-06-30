from pymongo import MongoClient
from datetime import datetime
import certifi

def init_database():
    """Inisialisasi database dengan contoh data jika kosong."""
    try:
        client = MongoClient('mongodb+srv://ahmadyazidarifuddin04:Qwerty12345.@server.hvqf3sk.mongodb.net/?retryWrites=true&w=majority&appName=server', tlsCAFile=certifi.where())
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
            for m in sample_members:
                if m['socialLinks']['instagram']:
                    print(f"  - {m['socialLinks']['instagram']}")
            print("\nUsername TikTok contoh:")
            for m in sample_members:
                if m['socialLinks']['tiktok']:
                    print(f"  - {m['socialLinks']['tiktok']}")
            print("\nAnda bisa menghapus atau mengganti username ini dengan username yang sebenarnya.")
        else:
            print("\nDatabase sudah memiliki data.")
            print("Gunakan menu 'Manajemen Username' untuk mengelola data.")
        client.close()
    except Exception as e:
        print(f"Error: {e}")

def clear_database():
    """Membersihkan semua data dari database."""
    try:
        client = MongoClient('mongodb+srv://ahmadyazidarifuddin04:Qwerty12345.@server.hvqf3sk.mongodb.net/bot_stats?retryWrites=true&w=majority&appName=server')
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