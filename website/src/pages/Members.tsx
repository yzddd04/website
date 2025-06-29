import React, { useState, useEffect } from 'react';
import { Search, Filter, Instagram, Zap, Shield } from 'lucide-react';
import { getMembers, getMemberStats, Member as ApiMember } from '../api';

interface Member extends Omit<ApiMember, '_id'> {
  _id?: string;
  socialLinks?: {
    tiktok?: string;
    instagram?: string;
    [key: string]: string | undefined;
  };
}

const Members: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedBadge, setSelectedBadge] = useState('');
  const [members, setMembers] = useState<Member[]>([]);
  const [followersMap, setFollowersMap] = useState<Record<string, { tiktok: number; instagram: number; loading: boolean }>>({});

  useEffect(() => {
    getMembers().then(setMembers);
  }, []);

  // Fetch followers for each member
  useEffect(() => {
    const fetchFollowers = async () => {
      const newMap: Record<string, { tiktok: number; instagram: number; loading: boolean }> = { ...followersMap };
      for (const member of members) {
        // Use socialLinks.instagram or socialLinks.tiktok if available, else fallback to member.username
        const usernameToFetch = member.socialLinks?.instagram || member.socialLinks?.tiktok || member.username;
        if (!newMap[usernameToFetch]) {
          newMap[usernameToFetch] = { tiktok: 0, instagram: 0, loading: true };
          setFollowersMap({ ...newMap });
          try {
            const stats = await getMemberStats(usernameToFetch);
            newMap[usernameToFetch] = {
              tiktok: stats.tiktok?.followers ?? 0,
              instagram: stats.instagram?.followers ?? 0,
              loading: false,
            };
            setFollowersMap({ ...newMap });
          } catch {
            newMap[usernameToFetch] = { tiktok: 0, instagram: 0, loading: false };
            setFollowersMap({ ...newMap });
          }
        }
      }
    };
    if (members.length > 0) fetchFollowers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [members]);

  const departments = [
    'Teknik Informatika',
    'Teknik Elektro',
    'Sistem Informasi',
    'Desain Komunikasi Visual',
    'Teknik Industri',
    'Arsitektur'
  ];

  const badges = ['pemula', 'bronze', 'silver', 'gold', 'diamond'];

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'diamond': return 'bg-cyan-100 text-cyan-800 border-cyan-300';
      case 'gold': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'silver': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'bronze': return 'bg-orange-100 text-orange-800 border-orange-300';
      default: return 'bg-green-100 text-green-800 border-green-300';
    }
  };

  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case 'diamond': return '💎';
      case 'gold': return '🥇';
      case 'silver': return '🥈';
      case 'bronze': return '🥉';
      default: return '🌱';
    }
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !selectedDepartment || member.department === selectedDepartment;
    const matchesBadge = !selectedBadge || member.badge === selectedBadge;
    
    return matchesSearch && matchesDepartment && matchesBadge;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Anggota Komunitas
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Temui para creator mahasiswa ITS yang telah bergabung dalam komunitas kami
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8 space-y-4 md:space-y-0 md:flex md:space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama atau username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="">Semua Jurusan</option>
          {departments.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>

        <select
          value={selectedBadge}
          onChange={(e) => setSelectedBadge(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="">Semua Badge</option>
          {badges.map(badge => (
            <option key={badge} value={badge}>
              {badge.charAt(0).toUpperCase() + badge.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredMembers.map((member) => (
          <div
            key={member._id}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 border border-gray-100"
          >
            <div className="flex items-center space-x-4 mb-4">
              <img
                src={member.profileImage}
                alt={member.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {member.name}
                  </h3>
                  {member.isAdmin && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                      <Shield className="h-3 w-3 mr-1" />
                      Admin
                    </span>
                  )}
                </div>
                <p className="text-purple-600 font-medium">
                  {member.username}
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getBadgeColor(member.badge)}`}>
                <span className="mr-1">{getBadgeIcon(member.badge)}</span>
                {member.badge.charAt(0).toUpperCase() + member.badge.slice(1)}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-gray-600 text-sm">
                {member.department}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-pink-500" />
                  <span className="text-sm text-gray-600">TikTok</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {followersMap[member.socialLinks?.instagram || member.socialLinks?.tiktok || member.username]?.loading ? (
                    <span className="inline-block w-10 h-5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded"></span>
                  ) : (
                    followersMap[member.socialLinks?.instagram || member.socialLinks?.tiktok || member.username]?.tiktok?.toLocaleString() ?? '0'
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Instagram className="h-4 w-4 text-pink-600" />
                  <span className="text-sm text-gray-600">Instagram</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {followersMap[member.socialLinks?.instagram || member.socialLinks?.tiktok || member.username]?.loading ? (
                    <span className="inline-block w-10 h-5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded"></span>
                  ) : (
                    followersMap[member.socialLinks?.instagram || member.socialLinks?.tiktok || member.username]?.instagram?.toLocaleString() ?? '0'
                  )}
                </span>
              </div>
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Total Followers</span>
                  <span className="font-bold text-purple-600">
                    {followersMap[member.socialLinks?.instagram || member.socialLinks?.tiktok || member.username]?.loading ? (
                      <span className="inline-block w-10 h-5 bg-gradient-to-r from-purple-200 via-purple-100 to-purple-200 animate-pulse rounded"></span>
                    ) : (
                      ((followersMap[member.socialLinks?.instagram || member.socialLinks?.tiktok || member.username]?.tiktok ?? 0) + (followersMap[member.socialLinks?.instagram || member.socialLinks?.tiktok || member.username]?.instagram ?? 0)).toLocaleString()
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Filter className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Tidak ada anggota ditemukan
          </h3>
          <p className="text-gray-600">
            Coba ubah filter atau kata kunci pencarian Anda
          </p>
        </div>
      )}
    </div>
  );
};

export default Members;