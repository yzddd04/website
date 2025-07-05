import React, { useState } from 'react';

interface UsernameRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tiktok: string, instagram: string) => void;
  initialTiktok?: string;
  initialInstagram?: string;
}

const UsernameRequiredModal: React.FC<UsernameRequiredModalProps> = ({ isOpen, onClose, onSave, initialTiktok = '', initialInstagram = '' }) => {
  const [tiktok, setTiktok] = useState(initialTiktok);
  const [instagram, setInstagram] = useState(initialInstagram);
  const [error, setError] = useState('');
  
  if (!isOpen) return null;

  const handleSave = () => {
    if (!tiktok.trim() && !instagram.trim()) {
      setError('Isi minimal salah satu username TikTok atau Instagram!');
      return;
    }
    setError('');
    onSave(tiktok.trim(), instagram.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
        <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">Lengkapi Username Sosial Media</h2>
        <p className="text-gray-700 text-center mb-4">Masukkan username TikTok dan/atau Instagram Anda untuk melanjutkan.</p>
        <div className="space-y-3">
          <div>
            <label className="block font-medium mb-1">Username TikTok</label>
            <input
              type="text"
              className="border rounded px-3 py-2 w-full"
              placeholder="cth: johndoe123"
              value={tiktok}
              onChange={e => setTiktok(e.target.value)}
              autoFocus
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Username Instagram</label>
            <input
              type="text"
              className="border rounded px-3 py-2 w-full"
              placeholder="cth: johndoe.ig"
              value={instagram}
              onChange={e => setInstagram(e.target.value)}
            />
          </div>
          {error && <div className="text-red-600 text-sm text-center">{error}</div>}
        </div>
        <button
          className="mt-6 w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition font-semibold"
          onClick={handleSave}
        >
          Simpan
        </button>
      </div>
    </div>
  );
};

export default UsernameRequiredModal; 