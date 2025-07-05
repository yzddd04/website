import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { TrendingUp, Users, Download, ExternalLink, Shield } from 'lucide-react';
import { getUser, getFollowersGrowth, FollowersGrowth } from '../api';
import { IoPersonCircleSharp } from "react-icons/io5";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [followers, setFollowers] = useState<{ tiktok: number; instagram: number; loading: boolean }>({ tiktok: 0, instagram: 0, loading: true });
  const [growthData, setGrowthData] = useState<FollowersGrowth | null>(null);

  useEffect(() => {
    const fetchFollowers = async () => {
      if (user && (user.socialLinks?.instagram || user.socialLinks?.tiktok)) {
        setFollowers({ tiktok: 0, instagram: 0, loading: true });
        const usernameToFetch = user.socialLinks?.instagram || user.socialLinks?.tiktok;
        if (usernameToFetch) {
          try {
            const userData = await getUser(user._id);
            setFollowers({
              tiktok: userData.tiktokFollowers ?? 0,
              instagram: userData.instagramFollowers ?? 0,
              loading: false,
            });
          } catch {
            setFollowers({ tiktok: 0, instagram: 0, loading: false });
          }
        } else {
          setFollowers({ tiktok: 0, instagram: 0, loading: false });
        }
      } else {
        setFollowers({ tiktok: 0, instagram: 0, loading: false });
      }
    };
    fetchFollowers();
  }, [user]);

  useEffect(() => {
    if (user && !followers.loading) {
      const usernameToFetch = user.socialLinks?.instagram || user.socialLinks?.tiktok;
      if (usernameToFetch) {
        getFollowersGrowth(usernameToFetch).then(setGrowthData);
      }
    }
  }, [user, followers.loading]);

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Access Denied</h2>
          <p className="mb-4 text-gray-600">Anda harus login untuk mengakses dashboard.</p>
          <Link to="/login" className="text-purple-600 hover:text-purple-500">
            Login Sekarang
          </Link>
        </div>
      </div>
    );
  }

  function getBadgeByFollowers(totalFollowers: number) {
    if (totalFollowers >= 1_000_000) return { icon: '💎', color: 'from-cyan-400 to-cyan-600', name: 'Creator Diamond', badgeKey: 'diamond' };
    if (totalFollowers >= 100_000) return { icon: '🥇', color: 'from-yellow-400 to-yellow-600', name: 'Creator Gold', badgeKey: 'gold' };
    if (totalFollowers >= 10_000) return { icon: '🥈', color: 'from-gray-400 to-gray-600', name: 'Creator Silver', badgeKey: 'silver' };
    if (totalFollowers >= 1_000) return { icon: '🥉', color: 'from-orange-400 to-orange-600', name: 'Creator Bronze', badgeKey: 'bronze' };
    return { icon: '🌱', color: 'from-green-400 to-green-600', name: 'Creator Pemula', badgeKey: 'pemula' };
  }

  const totalFollowers = (followers.tiktok ?? 0) + (followers.instagram ?? 0);
  const badgeDetails = getBadgeByFollowers(totalFollowers);
  const certificateUrl = user.certificateId ? `/certificate/${user.certificateId}` : '';

  // Ambil username dari user.socialLinks
  const tiktokUsername = user.socialLinks?.tiktok || '';
  const instagramUsername = user.socialLinks?.instagram || '';

  const stats = [
    {
      icon: <TrendingUp className="w-6 h-6 text-blue-600" />,
      label: 'Total Followers',
      value: followers.loading ? (
        <span className="inline-block w-12 h-6 bg-purple-200 rounded animate-pulse"></span>
      ) : (
        totalFollowers.toLocaleString()
      ),
      change: !growthData ? null : (
        <span className={`absolute top-4 right-4 text-xs font-semibold ${growthData.growthMinute === null ? 'text-gray-400' : growthData.growthMinute > 0 ? 'text-green-600' : growthData.growthMinute < 0 ? 'text-red-600' : 'text-gray-400'}`}>
          {growthData.growthMinute === null ? 'N/A' : growthData.growthMinute > 0 ? `+${growthData.growthMinute} /min` : growthData.growthMinute < 0 ? `${growthData.growthMinute} /min` : '0 /min'}
        </span>
      )
    },
    {
      icon: <Users className="w-6 h-6 text-green-600" />,
      label: 'TikTok Followers',
      value: followers.loading ? (
        <span className="inline-block w-12 h-6 bg-gray-200 rounded animate-pulse"></span>
      ) : (
        followers.tiktok.toLocaleString()
      ),
      change: !growthData || growthData.growthMinuteTiktok === null || growthData.growthMinuteTiktok === undefined ? (
        <span className="absolute top-4 right-4 text-xs font-semibold text-gray-400">N/A</span>
      ) : (
        <span className={`absolute top-4 right-4 text-xs font-semibold ${growthData.growthMinuteTiktok > 0 ? 'text-green-600' : growthData.growthMinuteTiktok < 0 ? 'text-red-600' : 'text-gray-400'}`}>{growthData.growthMinuteTiktok > 0 ? `+${growthData.growthMinuteTiktok} /min` : growthData.growthMinuteTiktok < 0 ? `${growthData.growthMinuteTiktok} /min` : '0 /min'}</span>
      )
    },
    {
      icon: <Users className="w-6 h-6 text-pink-600" />,
      label: 'Instagram Followers',
      value: followers.loading ? (
        <span className="inline-block w-12 h-6 bg-gray-200 rounded animate-pulse"></span>
      ) : (
        followers.instagram.toLocaleString()
      ),
      change: !growthData || growthData.growthMinuteInstagram === null || growthData.growthMinuteInstagram === undefined ? (
        <span className="absolute top-4 right-4 text-xs font-semibold text-gray-400">N/A</span>
      ) : (
        <span className={`absolute top-4 right-4 text-xs font-semibold ${growthData.growthMinuteInstagram > 0 ? 'text-green-600' : growthData.growthMinuteInstagram < 0 ? 'text-red-600' : 'text-gray-400'}`}>{growthData.growthMinuteInstagram > 0 ? `+${growthData.growthMinuteInstagram} /min` : growthData.growthMinuteInstagram < 0 ? `${growthData.growthMinuteInstagram} /min` : '0 /min'}</span>
      )
    }
  ];

  const quickActions = [
    {
      icon: <Download className="w-5 h-5" />,
      title: 'Download Certificate',
      description: 'Download sertifikat digital Anda',
      href: certificateUrl,
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: 'Edit Profile',
      description: 'Update informasi profil Anda',
      href: '/profile',
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ];

  // Add admin-specific actions if user is admin
  if (user.isAdmin) {
    quickActions.push({
      icon: <Shield className="w-5 h-5" />,
      title: 'Admin Dashboard',
      description: 'Kelola komunitas dan anggota',
      href: '/admin',
      color: 'bg-red-500 hover:bg-red-600'
    });
  }

  return (
    <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center mb-6 space-x-4">
          {user.profileImage ? (
            <img
              src={user.profileImage || ''}
              alt={user.name || 'Profile'}
              className="object-cover w-16 h-16 rounded-full"
            />
          ) : (
            <IoPersonCircleSharp className="w-16 h-16 text-gray-300" />
          )}
          <div>
            <div className="flex items-center mb-1 space-x-2">
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user.name}!
              </h1>
              {user.isAdmin && (
                <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-red-800 bg-red-100 rounded-full border border-red-200">
                  <Shield className="mr-1 w-4 h-4" />
                  Admin
                </span>
              )}
            </div>
            <p className="text-gray-600">{user.department}</p>
          </div>
        </div>

        {/* Badge Display */}
        <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-lg">
          <div className="flex items-center space-x-4">
            <div className={`w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center text-2xl`}>
              {badgeDetails.icon}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900">{badgeDetails.name}</h3>
              <p className="text-gray-600">Total {followers.loading ? (
                <span className="inline-block w-12 h-6 bg-purple-200 rounded animate-pulse"></span>
              ) : (
                totalFollowers.toLocaleString()
              )} followers</p>
              {/* Perkembangan followers */}
              {!growthData ? (
                <span className="inline-block mt-1 w-32 h-5 bg-gray-200 rounded animate-pulse"></span>
              ) : (
                <>
                  <span className={`block mt-1 text-sm font-medium ${growthData.growthMinute === null || growthData.growthMinute === undefined ? 'text-gray-400' : growthData.growthMinute > 0 ? 'text-green-600' : growthData.growthMinute < 0 ? 'text-red-600' : 'text-gray-400'}`}>
                    {growthData.growthMinute === null || growthData.growthMinute === undefined ? 'N/A per minute' : growthData.growthMinute > 0 ? `+${growthData.growthMinute} per minute` : growthData.growthMinute < 0 ? `${growthData.growthMinute} per minute` : '0 per minute'}
                  </span>
                  <span className={`block mt-1 text-sm font-medium ${growthData.growthDay === null || growthData.growthDay === undefined ? 'text-gray-400' : growthData.growthDay > 0 ? 'text-green-600' : growthData.growthDay < 0 ? 'text-red-600' : 'text-gray-400'}`}>
                    {growthData.growthDay === null || growthData.growthDay === undefined ? 'N/A per day' : growthData.growthDay > 0 ? `+${growthData.growthDay} per day` : growthData.growthDay < 0 ? `${growthData.growthDay} per day` : '0 per day'}
                  </span>
                  <span className={`block mt-1 text-sm font-medium ${growthData.growthWeek === null || growthData.growthWeek === undefined ? 'text-gray-400' : growthData.growthWeek > 0 ? 'text-green-600' : growthData.growthWeek < 0 ? 'text-red-600' : 'text-gray-400'}`}>
                    {growthData.growthWeek === null || growthData.growthWeek === undefined ? 'N/A per week' : growthData.growthWeek > 0 ? `+${growthData.growthWeek} per week` : growthData.growthWeek < 0 ? `${growthData.growthWeek} per week` : '0 per week'}
                  </span>
                  <div className="mt-1 text-xs text-left text-gray-400">
                    {growthData && growthData.currentTimestamp ? (
                      (() => {
                        const ts = growthData.currentTimestamp;
                        const date = new Date(ts);
                        const pad = (n: number) => n.toString().padStart(2, '0');
                        const timeStr = `${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}`;
                        const dayNames = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
                        const weekday = dayNames[date.getUTCDay()];
                        const dateStr = `${weekday}, ${pad(date.getUTCDate())}/${pad(date.getUTCMonth()+1)}/${date.getUTCFullYear()}`;
                        return <>Updated at: {timeStr} UTC, {dateStr}</>;
                      })()
                    ) : null}
                  </div>
                </>
              )}
            </div>
            <div className="text-right">
              {certificateUrl ? (
                <Link
                  to={certificateUrl as string}
                  target="_blank"
                  className="inline-flex items-center space-x-2 font-medium text-purple-600 hover:text-purple-700"
                >
                  <span>View Certificate</span>
                  <ExternalLink className="w-4 h-4" />
                </Link>
              ) : (
                <span className="text-gray-400">Certificate not available</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 mb-12 md:grid-cols-2 lg:grid-cols-4">
        {/* TikTok */}
        <div className="relative p-6 bg-white rounded-xl border border-gray-100 shadow-lg">
          <a href={tiktokUsername ? `https://tiktok.com/@${tiktokUsername}` : ''} target="_blank" rel="noopener noreferrer" className="flex justify-between items-center mb-2 group">
            <Users className="w-6 h-6 text-green-600 group-hover:text-green-800 transition" />
            {stats[1].change}
          </a>
          <a href={tiktokUsername ? `https://tiktok.com/@${tiktokUsername}` : ''} target="_blank" rel="noopener noreferrer" className="block text-lg font-semibold text-gray-800 hover:text-green-700 transition">
            TikTok
          </a>
          <a href={tiktokUsername ? `https://tiktok.com/@${tiktokUsername}` : ''} target="_blank" rel="noopener noreferrer" className="block text-2xl font-bold text-gray-900 hover:text-green-700 transition">
            {followers.tiktok.toLocaleString()}
          </a>
        </div>
        {/* Instagram */}
        <div className="relative p-6 bg-white rounded-xl border border-gray-100 shadow-lg">
          <a href={instagramUsername ? `https://instagram.com/${instagramUsername}` : ''} target="_blank" rel="noopener noreferrer" className="flex justify-between items-center mb-2 group">
            <Users className="w-6 h-6 text-pink-600 group-hover:text-pink-800 transition" />
            {stats[2].change}
          </a>
          <a href={instagramUsername ? `https://instagram.com/${instagramUsername}` : ''} target="_blank" rel="noopener noreferrer" className="block text-lg font-semibold text-gray-800 hover:text-pink-700 transition">
            Instagram
          </a>
          <a href={instagramUsername ? `https://instagram.com/${instagramUsername}` : ''} target="_blank" rel="noopener noreferrer" className="block text-2xl font-bold text-gray-900 hover:text-pink-700 transition">
            {followers.instagram.toLocaleString()}
          </a>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-6 mb-12 md:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((action, index) => (
          <div key={index} className="relative p-6 bg-white rounded-xl border border-gray-100 shadow-lg">
            <div className="flex items-center space-x-4">
              <div className={`w-16 h-16 rounded-full ${action.color} flex items-center justify-center text-2xl`}>
                {action.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">{action.title}</h3>
                <p className="text-gray-600">{action.description}</p>
              </div>
            </div>
            <div className="text-right">
              <Link
                to={action.href}
                className="inline-flex items-center space-x-2 font-medium text-purple-600 hover:text-purple-700"
              >
                <span>View</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;