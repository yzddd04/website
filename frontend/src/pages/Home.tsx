import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, TrendingUp, Users, Zap, Star, Trophy, Book } from 'lucide-react';
import { getStats, getSponsorPopupSetting, SponsorPopupSetting } from '../api';
import SponsorModal from '../components/SponsorModal';

const Home: React.FC = () => {
  const benefits = [
    {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      title: 'Lingkungan Supportif',
      description: 'Komunitas yang menampung dan mendukung creator mahasiswa ITS'
    },
    {
      icon: <Award className="h-8 w-8 text-blue-600" />,
      title: 'E-Certificate',
      description: 'Sertifikat digital Social Media Expert yang bisa dicantumkan di LinkedIn'
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-green-600" />,
      title: 'Analytics Tools',
      description: 'Fasilitas trend analytics untuk mengoptimalkan konten Anda'
    },
    {
      icon: <Trophy className="h-8 w-8 text-yellow-600" />,
      title: 'Sistem Badge',
      description: 'Badge achievement dari Pemula hingga Diamond berdasarkan followers'
    },
    {
      icon: <Book className="h-8 w-8 text-indigo-600" />,
      title: 'Modul Edukasi',
      description: 'Akses ke modul edukasi konten dan webinar eksklusif'
    },
    {
      icon: <Star className="h-8 w-8 text-pink-600" />,
      title: 'Peluang Kolaborasi',
      description: 'Kesempatan dilirik brand, magang, dan endorsement'
    }
  ];

  const [stats, setStats] = useState([
    { number: '0+', label: 'Creators' },
    { number: '0+', label: 'Total Followers' }
  ]);

  // Sponsor Popup State
  const [popupSetting, setPopupSetting] = useState<SponsorPopupSetting | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStats();
        
        const formatNumber = (num: number) => {
          if (num >= 1000000) return `${(num / 1000000).toFixed(0)}M+`;
          if (num >= 1000) return `${(num / 1000).toFixed(0)}K+`;
          return `${num}+`;
        };

        setStats([
          { number: `${data.activeCreators}+`, label: 'Creators' },
          { number: formatNumber(data.totalFollowers), label: 'Total Followers' }
        ]);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    getSponsorPopupSetting().then(setting => {
      setPopupSetting(setting);
      // Selalu tampilkan popup jika enabled
      if (setting.enabled) {
        setShowPopup(true);
      }
    });
  }, []);

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="space-y-20">
      {/* Sponsor Modal */}
      {popupSetting && (
        <SponsorModal isOpen={showPopup} onClose={handleClosePopup} setting={popupSetting} />
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-purple-100 rounded-full text-purple-700 font-medium mb-8">
              <Zap className="h-4 w-4 mr-2" />
              #1KontenLagi Movement
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              ITS <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Creators</span>
              <br />Community
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Bergabunglah dengan komunitas creators mahasiswa ITS terbesar. 
              Kembangkan skill, dapatkan sertifikat, dan raih peluang kolaborasi dengan brand!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors shadow-lg hover:shadow-xl"
              >
                Join Sekarang
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/members"
                className="inline-flex items-center px-8 py-4 border-2 border-purple-600 text-purple-600 font-semibold rounded-lg hover:bg-purple-50 transition-colors"
              >
                Lihat Anggota
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white/80 backdrop-blur-sm py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Kenapa Harus Join?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Dapatkan akses eksklusif ke berbagai benefit yang akan mengembangkan karier content creator Anda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 hover:border-purple-200"
              >
                <div className="mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Siap Menjadi Creator Terdepan?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Bergabunglah dengan ratusan creator mahasiswa ITS lainnya dan mulai perjalanan 
            content creation Anda hari ini!
          </p>
          <Link
            to="/register"
            className="inline-flex items-center px-8 py-4 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl"
          >
            Daftar Sekarang
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;