from pymongo import MongoClient
from datetime import datetime

def add_username_to_database():
    """Menambahkan username ke database botwebsite.members."""
    try:
        client = MongoClient('mongodb://localhost:27017/')
        db = client['botwebsite']
        print("=== TAMBAH USERNAME KE DATABASE ===")
        print("1. Instagram")
        print("2. TikTok")
        print("3. Keluar")
        choice = input("\nPilih platform (1-3): ")
        if choice == "1":
            username = input("Masukkan username Instagram: ").strip()
            if username:
                db['members'].insert_one({
                    'name': username,
                    'username': username,
                    'socialLinks': {'instagram': username, 'tiktok': ''},
                    'joinDate': datetime.now(),
                    'status': 'active'
                })
                print(f"Username Instagram '{username}' berhasil ditambahkan!")
            else:
                print("Username tidak boleh kosong!")
        elif choice == "2":
            username = input("Masukkan username TikTok: ").strip()
            if username:
                db['members'].insert_one({
                    'name': username,
                    'username': username,
                    'socialLinks': {'instagram': '', 'tiktok': username},
                    'joinDate': datetime.now(),
                    'status': 'active'
                })
                print(f"Username TikTok '{username}' berhasil ditambahkan!")
            else:
                print("Username tidak boleh kosong!")
        elif choice == "3":
            print("Keluar...")
        else:
            print("Pilihan tidak valid!")
        client.close()
    except Exception as e:
        print(f"Error: {e}")

def list_usernames():
    """Menampilkan daftar username di database botwebsite.members."""
    try:
        client = MongoClient('mongodb://localhost:27017/')
        db = client['botwebsite']
        print("\n=== DAFTAR USERNAME DI DATABASE ===")
        members = db['members'].find({})
        igs = []
        tiktoks = []
        for m in members:
            ig = m.get('socialLinks', {}).get('instagram', '').strip()
            if ig:
                igs.append(ig)
            tk = m.get('socialLinks', {}).get('tiktok', '').strip()
            if tk:
                tiktoks.append(tk)
        if igs:
            print(f"\nInstagram ({len(igs)} username):")
            for username in igs:
                print(f"  - {username}")
        else:
            print("\nInstagram: Tidak ada username")
        if tiktoks:
            print(f"\nTikTok ({len(tiktoks)} username):")
            for username in tiktoks:
                print(f"  - {username}")
        else:
            print("\nTikTok: Tidak ada username")
        client.close()
    except Exception as e:
        print(f"Error: {e}")

def remove_username():
    """Menghapus username dari database botwebsite.members."""
    try:
        client = MongoClient('mongodb://localhost:27017/')
        db = client['botwebsite']
        print("\n=== HAPUS USERNAME DARI DATABASE ===")
        print("1. Instagram")
        print("2. TikTok")
        print("3. Kembali")
        choice = input("\nPilih platform (1-3): ")
        if choice == "1":
            username = input("Masukkan username Instagram yang akan dihapus: ").strip()
            if username:
                result = db['members'].delete_many({'socialLinks.instagram': username})
                print(f"Berhasil menghapus {result.deleted_count} data untuk username '{username}'")
            else:
                print("Username tidak boleh kosong!")
        elif choice == "2":
            username = input("Masukkan username TikTok yang akan dihapus: ").strip()
            if username:
                result = db['members'].delete_many({'socialLinks.tiktok': username})
                print(f"Berhasil menghapus {result.deleted_count} data untuk username '{username}'")
            else:
                print("Username tidak boleh kosong!")
        elif choice == "3":
            pass
        else:
            print("Pilihan tidak valid!")
        client.close()
    except Exception as e:
        print(f"Error: {e}")

def main():
    while True:
        print("\n" + "="*50)
        print("    MANAJEMEN USERNAME DATABASE")
        print("="*50)
        print("1. Tambah username")
        print("2. Lihat daftar username")
        print("3. Hapus username")
        print("4. Keluar")
        
        choice = input("\nPilih menu (1-4): ")
        
        if choice == "1":
            add_username_to_database()
        elif choice == "2":
            list_usernames()
        elif choice == "3":
            remove_username()
        elif choice == "4":
            print("Keluar...")
            break
        else:
            print("Pilihan tidak valid!")

if __name__ == "__main__":
    main() 