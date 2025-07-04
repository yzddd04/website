import React from 'react';
import { X } from 'lucide-react';
import { SponsorPopupSetting } from '../api';

interface SponsorModalProps {
  isOpen: boolean;
  onClose: () => void;
  setting: SponsorPopupSetting;
}

const SponsorModal: React.FC<SponsorModalProps> = ({ isOpen, onClose, setting }) => {
  if (!isOpen || !setting.enabled) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-lg w-full relative p-6 pt-6 pr-6"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 bg-white text-gray-400 hover:text-gray-600 p-1 rounded-full shadow"
          aria-label="Tutup"
          style={{ zIndex: 10 }}
        >
          <X className="h-6 w-6" />
        </button>
        <div className="flex flex-col items-center space-y-4">
          {(setting.contentType === 'text' || setting.contentType === 'both') && (
            <div className="text-center text-lg text-gray-800" dangerouslySetInnerHTML={{ __html: setting.textContent }} />
          )}
          {(setting.contentType === 'image' || setting.contentType === 'both') && setting.imageUrl && (
            <img
              src={setting.imageUrl}
              alt="Sponsor"
              style={{ maxWidth: '100%', maxHeight: '70vh', height: 'auto', width: 'auto', display: 'block', margin: '0 auto' }}
              className="rounded shadow"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SponsorModal; 