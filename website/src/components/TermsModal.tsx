import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
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
          <h2 className="text-xl font-bold text-gray-900">Terms of Use</h2>
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
            <h3>1. Penerimaan Syarat</h3>
            <p>
              Dengan mengakses dan menggunakan platform ITS Creators Community, Anda menyetujui 
              untuk terikat dengan syarat dan ketentuan berikut. Jika Anda tidak setuju dengan 
              syarat ini, mohon untuk tidak menggunakan layanan kami.
            </p>

            <h3>2. Definisi Layanan</h3>
            <p>
              ITS Creators Community adalah platform yang menyediakan wadah bagi mahasiswa ITS 
              untuk mengembangkan kemampuan content creation, mendapatkan sertifikasi, dan 
              berkolaborasi dengan brand.
            </p>

            <h3>3. Kualifikasi Pengguna</h3>
            <p>
              Layanan ini khusus untuk mahasiswa aktif Institut Teknologi Sepuluh Nopember (ITS) 
              yang memiliki email resmi @student.its.ac.id. Pengguna harus memberikan informasi 
              yang akurat dan terkini.
            </p>

            <h3>4. Hak dan Kewajiban Pengguna</h3>
            <h4>Hak Pengguna:</h4>
            <ul>
              <li>Mengakses semua fitur yang tersedia sesuai dengan level keanggotaan</li>
              <li>Mendapatkan sertifikat digital berdasarkan pencapaian</li>
              <li>Berpartisipasi dalam program dan event komunitas</li>
              <li>Mendapatkan akses ke analytics tools dan educational content</li>
            </ul>

            <h4>Kewajiban Pengguna:</h4>
            <ul>
              <li>Memberikan informasi yang akurat dan memperbarui data profil</li>
              <li>Menjaga kerahasiaan akun dan password</li>
              <li>Tidak menyalahgunakan platform untuk aktivitas yang merugikan</li>
              <li>Menghormati hak cipta dan kekayaan intelektual</li>
            </ul>

            <h3>5. Sistem Badge dan Sertifikasi</h3>
            <p>
              Badge dan sertifikat diberikan berdasarkan jumlah followers yang terverifikasi. 
              Pengguna tidak diperkenankan untuk memalsukan data followers. Sertifikat yang 
              diterbitkan memiliki kredensial unik yang dapat diverifikasi melalui platform kami.
            </p>

            <h3>6. Konten dan Hak Kekayaan Intelektual</h3>
            <p>
              Pengguna bertanggung jawab atas konten yang dibagikan di platform. Kami berhak 
              untuk meninjau dan menghapus konten yang melanggar kebijakan atau hukum yang berlaku.
            </p>

            <h3>7. Privasi dan Perlindungan Data</h3>
            <p>
              Kami menghormati privasi pengguna dan berkomitmen melindungi data personal sesuai 
              dengan Privacy Policy yang terpisah.
            </p>

            <h3>8. Pembatasan Tanggung Jawab</h3>
            <p>
              ITS Creators Community tidak bertanggung jawab atas kerugian yang timbul dari 
              penggunaan platform, termasuk namun tidak terbatas pada kehilangan data atau 
              gangguan layanan.
            </p>

            <h3>9. Perubahan Syarat</h3>
            <p>
              Kami berhak mengubah syarat dan ketentuan ini sewaktu-waktu dengan pemberitahuan 
              yang wajar kepada pengguna.
            </p>

            <h3>10. Hukum yang Berlaku</h3>
            <p>
              Syarat dan ketentuan ini diatur oleh hukum Republik Indonesia. Setiap sengketa 
              akan diselesaikan melalui musyawarah atau melalui pengadilan yang berwenang di Indonesia.
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

export default TermsModal;