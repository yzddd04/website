import React from 'react';
import { Award, TrendingUp, Users, Book, Star, Briefcase, Target, CheckCircle } from 'lucide-react';

const Benefits: React.FC = () => {
  const mainBenefits = [
    {
      icon: <Users className="h-12 w-12 text-purple-600" />,
      title: 'Lingkungan yang Mendukung',
      description: 'Bergabung dengan komunitas creator mahasiswa yang saling support dan berbagi pengalaman untuk tumbuh bersama.',
      features: [
        'Networking dengan sesama creator',
        'Sharing tips dan trik konten',
        'Kolaborasi antar creator',
        'Mentoring dari senior'
      ]
    },
    {
      icon: <TrendingUp className="h-12 w-12 text-blue-600" />,
      title: 'Fasilitas Trend Analytics',
      description: 'Akses eksklusif ke tools analytics untuk memantau performa konten dan mengidentifikasi trend terbaru.',
      features: [
        'Analytics dashboard personal',
        'Trend prediction tools',
        'Content performance metrics',
        'Audience insights'
      ]
    },
    {
      icon: <Award className="h-12 w-12 text-green-600" />,
      title: 'E-Certificate Penghargaan',
      description: 'Dapatkan sertifikat digital yang bisa dicantumkan di LinkedIn dan CV untuk meningkatkan kredibilitas profesional.',
      features: [
        'Sertifikat Social Media Expert',
        'Verifikasi online tersedia',
        'Badge sistem bertingkat',
        'Kredensial yang dapat diverifikasi'
      ]
    }
  ];

  const badgeSystem = [
    {
      badge: 'Creator Pemula',
      icon: '🌱',
      requirement: 'Di bawah 1.000 followers',
      color: 'from-green-400 to-green-600',
      benefits: ['Akses komunitas dasar', 'Modul pembelajaran pemula']
    },
    {
      badge: 'Creator Bronze',
      icon: '🥉',
      requirement: '1.000 - 10.000 followers',
      color: 'from-orange-400 to-orange-600',
      benefits: ['Analytics tools', 'Workshop eksklusif', 'Networking events']
    },
    {
      badge: 'Creator Silver',
      icon: '🥈',
      requirement: '10.000 - 100.000 followers',
      color: 'from-gray-400 to-gray-600',
      benefits: ['Priority support', 'Brand collaboration opportunities', 'Advanced analytics']
    },
    {
      badge: 'Creator Gold',
      icon: '🥇',
      requirement: '100.000 - 1.000.000 followers',
      color: 'from-yellow-400 to-yellow-600',
      benefits: ['VIP mentoring', 'Exclusive brand partnerships', 'Speaking opportunities']
    },
    {
      badge: 'Creator Diamond',
      icon: '💎',
      requirement: 'Di atas 1.000.000 followers',
      color: 'from-cyan-400 to-cyan-600',
      benefits: ['Elite status', 'Premium brand deals', 'Community ambassador role']
    }
  ];

  const additionalBenefits = [
    {
      icon: <Book className="h-8 w-8 text-indigo-600" />,
      title: 'Modul Edukasi & Webinar',
      description: 'Akses ke materi pembelajaran dan webinar eksklusif dari expert di industri'
    },
    {
      icon: <Star className="h-8 w-8 text-pink-600" />,
      title: 'Peluang Dilirik Brand',
      description: 'Kesempatan untuk berkolaborasi dengan brand-brand ternama dan mendapatkan endorsement'
    },
    {
      icon: <Briefcase className="h-8 w-8 text-blue-600" />,
      title: 'Peluang Magang',
      description: 'Akses ke informasi dan referral untuk posisi magang di perusahaan media dan marketing'
    },
    {
      icon: <Target className="h-8 w-8 text-red-600" />,
      title: 'Content Strategy Support',
      description: 'Bantuan dalam mengembangkan strategi konten yang efektif dan engaging'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Benefits Bergabung dengan
          <span className="block text-purple-600">
            Creators Community
          </span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Dapatkan akses eksklusif ke berbagai fasilitas dan kesempatan yang akan mengembangkan 
          karier content creator Anda ke level berikutnya
        </p>
      </div>

      {/* Main Benefits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
        {mainBenefits.map((benefit, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
          >
            <div className="mb-6">
              {benefit.icon}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {benefit.title}
            </h3>
            <p className="text-gray-600 mb-6">
              {benefit.description}
            </p>
            <ul className="space-y-3">
              {benefit.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Badge System */}
      <div className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Sistem Badge Achievement
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Raih badge sesuai dengan pencapaian followers Anda dan dapatkan benefit eksklusif di setiap level
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {badgeSystem.map((badge, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100"
            >
              <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${badge.color} flex items-center justify-center text-2xl mb-4 mx-auto`}>
                {badge.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
                {badge.badge}
              </h3>
              <p className="text-sm text-gray-600 text-center mb-4">
                {badge.requirement}
              </p>
              <ul className="space-y-2">
                {badge.benefits.map((benefit, benefitIndex) => (
                  <li key={benefitIndex} className="text-xs text-gray-700 flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 flex-shrink-0"></div>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Benefits */}
      <div className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Benefit Tambahan
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Masih ada banyak lagi keuntungan yang bisa Anda dapatkan sebagai member komunitas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {additionalBenefits.map((benefit, index) => (
            <div
              key={index}
              className="flex space-x-4 p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
            >
              <div className="flex-shrink-0">
                {benefit.icon}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-12 text-center text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Siap Merasakan Semua Benefit Ini?
        </h2>
        <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
          Bergabunglah sekarang dan mulai perjalanan Anda menjadi content creator professional
        </p>
        <button className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl">
          Join Creators Community
        </button>
      </div>
    </div>
  );
};

export default Benefits;