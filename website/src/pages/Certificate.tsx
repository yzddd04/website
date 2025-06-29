import React, { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Download, ExternalLink, Award, Calendar, CheckCircle } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Certificate: React.FC = () => {
  const { credential } = useParams();
  const certificateRef = useRef<HTMLDivElement>(null);

  // Mock certificate data (in real app, fetch from API)
  const certificateData = {
    id: credential || 'sample-cert-123',
    recipientName: 'John Doe',
    badge: 'silver',
    totalFollowers: 25000,
    issueDate: new Date().toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    department: 'Teknik Informatika',
    verificationUrl: `${window.location.origin}/certificate/${credential}`
  };

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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Digital Certificate Verification
          </h1>
          <p className="text-gray-600">
            This certificate can be verified at: {certificateData.verificationUrl}
          </p>
        </div>

        {/* Certificate */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-8">
          <div 
            ref={certificateRef}
            className="relative p-12 bg-gradient-to-br from-purple-50 to-blue-50"
            style={{ minHeight: '600px' }}
          >
            {/* Decorative Border */}
            <div className="absolute inset-4 border-4 border-purple-200 rounded-xl"></div>
            <div className="absolute inset-6 border-2 border-purple-100 rounded-lg"></div>

            {/* Header */}
            <div className="text-center mb-8 relative z-10">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center">
                  <Award className="h-10 w-10 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                CERTIFICATE OF ACHIEVEMENT
              </h2>
              <p className="text-lg text-gray-600">
                ITS Creators Community
              </p>
            </div>

            {/* Content */}
            <div className="text-center mb-8 relative z-10">
              <p className="text-lg text-gray-700 mb-4">
                This is to certify that
              </p>
              <h3 className="text-4xl font-bold text-purple-600 mb-4">
                {certificateData.recipientName}
              </h3>
              <p className="text-lg text-gray-700 mb-6">
                from {certificateData.department}, Institut Teknologi Sepuluh Nopember
              </p>
              <p className="text-lg text-gray-700 mb-6">
                has successfully achieved the status of
              </p>
              
              {/* Badge Display */}
              <div className="flex justify-center mb-6">
                <div className={`w-24 h-24 rounded-full bg-gradient-to-r ${badgeDetails.color} flex items-center justify-center text-4xl shadow-lg`}>
                  {badgeDetails.icon}
                </div>
              </div>
              
              <h4 className="text-2xl font-bold text-gray-900 mb-2">
                {badgeDetails.name}
              </h4>
              <p className="text-lg text-gray-600 mb-6">
                {badgeDetails.level} • {certificateData.totalFollowers.toLocaleString()} Total Followers
              </p>
              
              <p className="text-gray-700">
                in recognition of outstanding performance in content creation and social media engagement
              </p>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-end relative z-10">
              <div className="text-left">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Issue Date</span>
                </div>
                <p className="font-semibold text-gray-900">
                  {certificateData.issueDate}
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-32 h-px bg-gray-400 mb-2"></div>
                <p className="text-sm text-gray-600">
                  ITS Creators Community
                </p>
                <p className="text-xs text-gray-500">
                  Digital Signature
                </p>
              </div>
              
              <div className="text-right">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-600">Verified</span>
                </div>
                <p className="text-xs text-gray-500 font-mono">
                  ID: {certificateData.id}
                </p>
              </div>
            </div>

            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full opacity-5">
              <div className="absolute top-10 left-10 w-32 h-32 bg-purple-300 rounded-full"></div>
              <div className="absolute top-20 right-20 w-24 h-24 bg-blue-300 rounded-full"></div>
              <div className="absolute bottom-20 left-20 w-28 h-28 bg-pink-300 rounded-full"></div>
              <div className="absolute bottom-10 right-10 w-20 h-20 bg-yellow-300 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
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