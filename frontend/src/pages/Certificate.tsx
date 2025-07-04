import React, { useRef, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Download, ExternalLink, CheckCircle } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { QRCodeCanvas } from 'qrcode.react';

interface CertificateData {
  id: string;
  recipientName: string;
  badge: string;
  totalFollowers: number;
  issueDate: string;
  department: string;
  verificationUrl: string;
  instagramFollowers?: number;
  tiktokFollowers?: number;
}

// TypeScript typing untuk CertificateText agar linter tidak error
type CertificateTextProps = {
  children: React.ReactNode;
  top?: string | number;
  left?: string | number;
  right?: string | number;
  bottom?: string | number;
  width?: string;
  textAlign?: string;
  fontSize?: string;
  color?: string;
  fontWeight?: string;
  style?: React.CSSProperties;
};

const Certificate: React.FC = () => {
  const { credential } = useParams();
  const certificateRef = useRef<HTMLDivElement>(null);
  const [certificateData, setCertificateData] = useState<CertificateData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'live' | 'appreciation'>('live');
  const [loading, setLoading] = useState(false);

  // Simulasi userId, ganti dengan userId login sebenarnya jika ada auth
  const userId = 'USER_ID_SAMPLE';

  useEffect(() => {
    if (mode === 'live') {
      if (credential) {
        setLoading(true);
        fetch(`/api/certificate/${credential}`)
          .then(res => {
            if (!res.ok) throw new Error('Certificate not found');
            return res.json();
          })
          .then(data => { setCertificateData(data); setLoading(false); })
          .catch(err => { setError(err.message); setLoading(false); });
      }
    } else if (mode === 'appreciation') {
      // Buat snapshot baru, lalu fetch datanya
      setLoading(true);
      fetch('/api/certificate/appreciation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      })
        .then(res => res.json())
        .then(result => {
          if (!result.certificateId) throw new Error('Gagal membuat certificate appreciation');
          return fetch(`/api/certificate/appreciation/${result.certificateId}`);
        })
        .then(res => res.json())
        .then(data => { setCertificateData(data); setLoading(false); })
        .catch(err => { setError(err.message); setLoading(false); });
    }
  }, [credential, mode]);

  const getBadgeDetails = (badge: string) => {
    switch (badge) {
      case 'diamond':
        return { icon: '💎', color: 'from-cyan-400 to-cyan-600', name: 'Creator Diamond', level: 'Level 5' };
      case 'gold':
        return { icon: '🥇', color: 'from-yellow-400 to-yellow-600', name: 'Creator Gold', level: 'Level 4' };
      case 'silver':
        return { icon: '🥈', color: 'from-gray-400 to-gray-600', name: 'Creator Silver', level: 'Level 3' };
      case 'bronze':
        return { icon: '🥉', color: 'from-orange-400 to-orange-600', name: 'Creator Bronze', level: 'Level 2' };
      default:
        return { icon: '🌱', color: 'from-green-400 to-green-600', name: 'Creator Pemula', level: 'Level 1' };
    }
  };

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-600 font-bold">{error}</div>;
  }
  if (!certificateData) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading certificate...</div>;
  }

  const badgeDetails = getBadgeDetails(certificateData.badge);

  const downloadPDF = async () => {
    if (certificateRef.current) {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const imgWidth = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`ITS-Creators-Certificate-${certificateData.recipientName}.pdf`);
    }
  };

  // Dummy followers, replace with real if available in certificateData
  const instagramFollowers = certificateData.instagramFollowers ?? 0;
  const tiktokFollowers = certificateData.tiktokFollowers ?? 0;
  const totalFollowers = certificateData.totalFollowers ?? (instagramFollowers + tiktokFollowers);

  // Komponen fleksibel untuk teks overlay di sertifikat
  const CertificateText = ({
    children,
    top,
    left,
    right,
    bottom,
    width = 'auto',
    textAlign = 'left',
    fontSize = '1.4rem',
    color = '#3b2f13',
    fontWeight = 'normal',
    style = {}
  }: CertificateTextProps) => (
    <div
      style={{
        position: 'absolute',
        top,
        left,
        right,
        bottom,
        width,
        textAlign,
        fontSize,
        color,
        fontWeight,
        ...style
      }}
    >
      {children}
    </div>
  );

  // Komponen reusable untuk QR code + teks, posisi dan resolusi bisa diatur
  const CertificateQRCodeBlock = ({
    top,
    left,
    right,
    bottom,
    width = 350,
    textAlign = 'right',
    children
  }: {
    top?: string | number,
    left?: string | number,
    right?: string | number,
    bottom?: string | number,
    width?: string | number,
    textAlign?: 'left' | 'right' | 'center',
    children: React.ReactNode
  }) => (
    <div
      style={{
        position: 'absolute',
        top,
        left,
        right,
        bottom,
        width,
        textAlign,
        display: 'flex',
        flexDirection: 'column',
        alignItems: textAlign === 'right' ? 'flex-end' : textAlign === 'left' ? 'flex-start' : 'center'
      }}
    >
      <QRCodeCanvas value={certificateData.verificationUrl} size={1024} bgColor="transparent" style={{ width: 100, height: 100 }} />
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Pilihan mode sertifikat */}
        <div className="mb-6 flex gap-6 items-center">
          <label>
            <input type="radio" name="certmode" value="live" checked={mode === 'live'} onChange={() => setMode('live')} /> Live Certificate
          </label>
          <label>
            <input type="radio" name="certmode" value="appreciation" checked={mode === 'appreciation'} onChange={() => setMode('appreciation')} /> Certificate of Appreciation
          </label>
        </div>
        {/* Loading/Error */}
        {loading && <div className="text-center text-gray-500">Loading certificate...</div>}
        {error && <div className="text-center text-red-600 font-bold">{error}</div>}
        {/* Sertifikat */}
        {!loading && certificateData && (
          <div ref={certificateRef} className="w-full flex justify-center items-center">
            <div className="relative" style={{ width: '100%', maxWidth: '1000px', aspectRatio: '2000/1414', background: '#e5e7eb', borderRadius: '8px' }}>
              <img
                src="/1.png"
                alt="Certificate Background"
                style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', borderRadius: '8px' }}
              />
              {/* Nama */}
              <CertificateText
                top="220px"
                left={0}
                right={undefined}
                bottom={undefined}
                width="100%"
                textAlign="center"
                fontWeight="bold"
                fontSize="3.2rem"
                style={{ letterSpacing: 2 }}
              >
                {certificateData.recipientName}
              </CertificateText>
              {/* Instagram followers di kiri atas */}
              <CertificateText
                top="348px"
                left="450px"
                width="300px"
                textAlign="left"
                fontWeight="normal"
              >
                <span>{instagramFollowers.toLocaleString()}</span>
              </CertificateText>
              {/* TikTok followers di kanan tengah */}
              <CertificateText
                top="368px"
                left="450px"
                width="300px"
                textAlign="left"
                fontWeight="nomral"
              >
                <span>{tiktokFollowers.toLocaleString()}</span>
              </CertificateText>
              {/* Total Cross-Platform di tengah bawah */}
              <CertificateText
                top="390px"
                left="450px"
                width="300px"
                textAlign="left"
                fontWeight="normal"
              >
                <span>{totalFollowers.toLocaleString()}</span>
              </CertificateText>
              {/* QR Code dan teks, posisi dan resolusi bisa diatur manual */}
              <CertificateQRCodeBlock
                right="40px"
                bottom="40px"
                width={350}
                textAlign="right"
              >
                <div style={{ marginTop: 8 }}>
                  <div style={{ fontWeight: 'bold', fontSize: 16 }}>Verifikasi Sertifikat</div>
                  <div style={{ fontSize: 13, whiteSpace: 'normal' }}>{certificateData.verificationUrl}</div>
                  <div style={{ fontSize: 13 }}>
                    dikeluarkan pada tanggal: {certificateData.issueDate}
                  </div>
                </div>
              </CertificateQRCodeBlock>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <button
            onClick={downloadPDF}
            className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors shadow-lg"
          >
            <Download className="h-5 w-5 mr-2" />
            Download PDF
          </button>
          
          <button
            onClick={() => navigator.share?.({ 
              title: 'My ITS Creators Certificate',
              url: window.location.href 
            }) || navigator.clipboard.writeText(window.location.href)}
            className="inline-flex items-center px-6 py-3 border-2 border-purple-600 text-purple-600 font-semibold rounded-lg hover:bg-purple-50 transition-colors"
          >
            <ExternalLink className="h-5 w-5 mr-2" />
            Share Certificate
          </button>
        </div>

        {/* Verification Info */}
        <div className="mt-12 bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Certificate Verification</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Certificate ID:</span>
              <p className="text-gray-600 font-mono">{certificateData.id}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Issue Date:</span>
              <p className="text-gray-600">{certificateData.issueDate}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Recipient:</span>
              <p className="text-gray-600">{certificateData.recipientName}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Achievement Level:</span>
              <p className="text-gray-600">{badgeDetails.name}</p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-green-800 font-medium">Certificate Verified</span>
            </div>
            <p className="text-green-700 text-sm mt-1">
              This certificate is authentic and has been verified by ITS Creators Community.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificate;