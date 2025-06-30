import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setHasScrolledToBottom(false);
    }
  }, [isOpen]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const isAtBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 10;
    if (isAtBottom && !hasScrolledToBottom) {
      setHasScrolledToBottom(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Privacy Policy</h2>
          <button
            onClick={onClose}
            disabled={!hasScrolledToBottom}
            className={`p-1 rounded-lg transition-colors ${
              hasScrolledToBottom
                ? 'text-gray-400 hover:text-gray-600'
                : 'text-gray-300 cursor-not-allowed'
            }`}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6" onScroll={handleScroll}>
          <div className="prose prose-sm max-w-none">
            <h3>1. Informasi yang Kami Kumpulkan</h3>
            <h4>Data Pribadi:</h4>
            <ul>
              <li>Nama lengkap dan email institusi (@student.its.ac.id)</li>
              <li>Departemen dan informasi akademik</li>
              <li>Data followers media sosial (TikTok, Instagram)</li>
              <li>Foto profil dan konten yang diunggah</li>
            </ul>

            <h4>Data Teknis:</h4>
            <ul>
              <li>Alamat IP dan informasi perangkat</li>
              <li>Log aktivitas penggunaan platform</li>
              <li>Cookies dan teknologi pelacakan serupa</li>
            </ul>

            <h3>2. Cara Kami Menggunakan Informasi</h3>
            <p>Informasi yang kami kumpulkan digunakan untuk:</p>
            <ul>
              <li>Menyediakan dan meningkatkan layanan platform</li>
              <li>Memverifikasi identitas dan status mahasiswa</li>
              <li>Mengeluarkan sertifikat dan badge berdasarkan pencapaian</li>
              <li>Menyediakan analytics dan insights konten</li>
              <li>Memfasilitasi kolaborasi dengan brand dan mitra</li>
              <li>Mengirimkan notifikasi dan update penting</li>
            </ul>

            <h3>3. Berbagi Informasi</h3>
            <p>Kami dapat membagikan informasi Anda dalam situasi berikut:</p>
            <ul>
              <li>Dengan persetujuan eksplisit dari pengguna</li>
              <li>Dengan mitra brand untuk keperluan kolaborasi (data terbatas)</li>
              <li>Untuk mematuhi kewajiban hukum atau proses pengadilan</li>
              <li>Dalam bentuk data agregat dan anonim untuk riset</li>
            </ul>

            <h3>4. Keamanan Data</h3>
            <p>
              Kami menerapkan langkah-langkah keamanan teknis dan organisasi yang sesuai 
              untuk melindungi data pribadi Anda dari akses, penggunaan, atau pengungkapan 
              yang tidak sah.
            </p>

            <h3>5. Retensi Data</h3>
            <p>
              Data pribadi akan disimpan selama diperlukan untuk tujuan yang dijelaskan 
              dalam kebijakan ini atau sesuai dengan kewajiban hukum yang berlaku.
            </p>

            <h3>6. Hak Pengguna</h3>
            <p>Anda memiliki hak untuk:</p>
            <ul>
              <li>Mengakses data pribadi yang kami simpan tentang Anda</li>
              <li>Meminta koreksi data yang tidak akurat</li>
              <li>Meminta penghapusan data dalam kondisi tertentu</li>
              <li>Membatasi pemrosesan data pribadi Anda</li>
              <li>Keberatan terhadap pemrosesan data untuk tujuan tertentu</li>
            </ul>

            <h3>7. Cookies dan Teknologi Pelacakan</h3>
            <p>
              Kami menggunakan cookies dan teknologi serupa untuk meningkatkan pengalaman 
              pengguna, menganalisis lalu lintas, dan menyesuaikan konten. Anda dapat 
              mengatur preferensi cookies melalui browser Anda.
            </p>

            <h3>8. Transfer Data Internasional</h3>
            <p>
              Data Anda mungkin diproses di server yang berlokasi di luar Indonesia. 
              Kami memastikan perlindungan yang memadai sesuai dengan standar internasional.
            </p>

            <h3>9. Perubahan Kebijakan</h3>
            <p>
              Kebijakan privasi ini dapat diperbarui dari waktu ke waktu. Perubahan 
              material akan dikomunikasikan melalui platform atau email.
            </p>

            <h3>10. Kontak</h3>
            <p>
              Jika Anda memiliki pertanyaan tentang kebijakan privasi ini atau ingin 
              menggunakan hak Anda, silakan hubungi kami melalui platform atau email resmi.
            </p>

            <p className="text-sm text-gray-600 mt-8">
              Terakhir diperbarui: 1 Januari 2024
            </p>
          </div>
        </div>

        <div className="p-6 border-t">
          {!hasScrolledToBottom ? (
            <p className="text-sm text-gray-600 text-center">
              Scroll ke bawah untuk melanjutkan
            </p>
          ) : (
            <button
              onClick={onClose}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Tutup
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrivacyModal;