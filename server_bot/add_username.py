from pymongo import MongoClient
from datetime import datetime
import certifi

def add_username():
    """Menambahkan username baru ke database."""
    try:
        # Gunakan MongoDB Atlas
        client = MongoClient(
            'mongodb+srv://ahmadyazidarifuddin04:Qwerty12345.@server.hvqf3sk.mongodb.net/?retryWrites=true&w=majority&appName=server',
            tlsCAFile=certifi.where()
        )
        db = client['botwebsite']
        
        print("=== TAMBAH USERNAME ===")
        print("Masukkan informasi username baru:")
        
        name = input("Nama: ").strip()
        if not name:
            print("Error: Nama tidak boleh kosong!")
            return
        
        username = input("Username: ").strip()
        if not username:
            print("Error: Username tidak boleh kosong!")
            return
        
        # Cek apakah username sudah ada
        existing = db['members'].find_one({'username': username})
        if existing:
            print(f"Error: Username '{username}' sudah ada di database!")
            return
        
        instagram = input("Username Instagram (kosongkan jika tidak ada): ").strip()
        tiktok = input("Username TikTok (kosongkan jika tidak ada): ").strip()
        
        # Buat data member baru
        member_data = {
            'name': name,
            'username': username,
            'socialLinks': {
                'instagram': instagram,
                'tiktok': tiktok
            },
            'joinDate': datetime.now(),
            'status': 'active'
        }
        
        # Simpan ke database
        result = db['members'].insert_one(member_data)
        print(f"\n✓ Username '{username}' berhasil ditambahkan!")
        print(f"ID: {result.inserted_id}")
        
        client.close()
        
    except Exception as e:
        print(f"Error: {e}")
        print("Pastikan koneksi internet stabil dan MongoDB Atlas dapat diakses.")

def list_usernames():
    """Menampilkan daftar username yang ada."""
    try:
        # Gunakan MongoDB Atlas
        client = MongoClient(
            'mongodb+srv://ahmadyazidarifuddin04:Qwerty12345.@server.hvqf3sk.mongodb.net/?retryWrites=true&w=majority&appName=server',
            tlsCAFile=certifi.where()
        )
        db = client['botwebsite']
        
        print("=== DAFTAR USERNAME ===")
        members = db['members'].find({}).sort('name', 1)
        
        count = 0
        for member in members:
            count += 1
            print(f"\n{count}. {member['name']}")
            print(f"   Username: {member['username']}")
            if member.get('socialLinks', {}).get('instagram'):
                print(f"   Instagram: {member['socialLinks']['instagram']}")
            if member.get('socialLinks', {}).get('tiktok'):
                print(f"   TikTok: {member['socialLinks']['tiktok']}")
            print(f"   Status: {member.get('status', 'active')}")
        
        if count == 0:
            print("Tidak ada data username.")
        else:
            print(f"\nTotal: {count} username")
        
        client.close()
        
    except Exception as e:
        print(f"Error: {e}")
        print("Pastikan koneksi internet stabil dan MongoDB Atlas dapat diakses.")

def delete_username():
    """Menghapus username dari database."""
    try:
        # Gunakan MongoDB Atlas
        client = MongoClient(
            'mongodb+srv://ahmadyazidarifuddin04:Qwerty12345.@server.hvqf3sk.mongodb.net/?retryWrites=true&w=majority&appName=server',
            tlsCAFile=certifi.where()
        )
        db = client['botwebsite']
        
        print("=== HAPUS USERNAME ===")
        username = input("Masukkan username yang akan dihapus: ").strip()
        
        if not username:
            print("Error: Username tidak boleh kosong!")
            return
        
        # Cek apakah username ada
        existing = db['members'].find_one({'username': username})
        if not existing:
            print(f"Error: Username '{username}' tidak ditemukan!")
            return
        
        # Konfirmasi penghapusan
        confirm = input(f"Yakin ingin menghapus '{username}'? (y/N): ").strip().lower()
        if confirm != 'y':
            print("Penghapusan dibatalkan.")
            return
        
        # Hapus dari database
        result = db['members'].delete_one({'username': username})
        if result.deleted_count > 0:
            print(f"✓ Username '{username}' berhasil dihapus!")
        else:
            print("Error: Gagal menghapus username!")
        
        client.close()
        
    except Exception as e:
        print(f"Error: {e}")
        print("Pastikan koneksi internet stabil dan MongoDB Atlas dapat diakses.")

def main():
    print("========================================")
    print("    MANAJEMEN USERNAME DATABASE")
    print("========================================")
    print()
    
    while True:
        print("Pilih menu:")
        print("1. Tambah Username")
        print("2. Lihat Daftar Username")
        print("3. Hapus Username")
        print("4. Keluar")
        
        choice = input("\nPilihan (1-4): ").strip()
        
        if choice == '1':
            add_username()
        elif choice == '2':
            list_usernames()
        elif choice == '3':
            delete_username()
        elif choice == '4':
            print("Keluar dari program.")
            break
        else:
            print("Pilihan tidak valid!")
        
        print("\n" + "-"*40)

if __name__ == "__main__":
    main() 