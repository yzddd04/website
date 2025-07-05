import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { getUser, User } from '../api';
import { AiFillTikTok } from "react-icons/ai";
import { FaSquareInstagram } from "react-icons/fa6";
import { IoPersonCircleSharp } from "react-icons/io5";

const Members: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [members, setMembers] = useState<User[]>([]);
  const [followersMap, setFollowersMap] = useState<Record<string, { tiktok: number; instagram: number; loading: boolean }>>({});
  const [departments, setDepartments] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then((users: User[]) => {
        setMembers(users);
        const uniqueDepartments = Array.from(new Set(users.map(u => u.department).filter(Boolean) as string[]));
        uniqueDepartments.sort((a, b) => a.localeCompare(b));
        setDepartments(uniqueDepartments);
      });
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
            const user = await getUser(member._id);
            const tiktokFollowers = user.tiktokFollowers || 0;
            const instagramFollowers = user.instagramFollowers || 0;
            newMap[usernameToFetch] = {
              tiktok: tiktokFollowers,
              instagram: instagramFollowers,
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

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !selectedDepartment || member.department === selectedDepartment;

    return matchesSearch && matchesDepartment;
  });

  // Tambahkan fungsi formatFollowers
  function formatFollowers(num: number): string {
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(num % 1_000_000_000 === 0 ? 0 : 1) + 'B';
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(num % 1_000_000 === 0 ? 0 : 1) + 'M';
    if (num >= 10_000) return (num / 1_000).toFixed(num % 1_000 === 0 ? 0 : 1) + 'K';
    return num.toLocaleString();
  }

  // Tambahkan fungsi getBadgeByFollowers
  function getBadgeByFollowers(totalFollowers: number) {
    if (totalFollowers >= 1_000_000) return { icon: '💎', color: 'bg-cyan-100 text-cyan-800 border-cyan-300', name: 'Diamond' };
    if (totalFollowers >= 100_000) return { icon: '🥇', color: 'bg-yellow-100 text-yellow-800 border-yellow-300', name: 'Gold' };
    if (totalFollowers >= 10_000) return { icon: '🥈', color: 'bg-gray-100 text-gray-800 border-gray-300', name: 'Silver' };
    if (totalFollowers >= 1_000) return { icon: '🥉', color: 'bg-orange-100 text-orange-800 border-orange-300', name: 'Bronze' };
    return { icon: '🌱', color: 'bg-green-100 text-green-800 border-green-300', name: 'Pemula' };
  }

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
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredMembers.map((member) => {
          const tiktok = member.tiktokFollowers ?? followersMap[member.socialLinks?.instagram || member.socialLinks?.tiktok || member.username]?.tiktok ?? 0;
          const instagram = member.instagramFollowers ?? followersMap[member.socialLinks?.instagram || member.socialLinks?.tiktok || member.username]?.instagram ?? 0;
          const totalFollowers = tiktok + instagram;
          const badge = getBadgeByFollowers(totalFollowers);
          return (
            <div
              key={member._id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 border border-gray-100"
            >
              <div className="flex items-center space-x-4 mb-4">
                {member.profileImage ? (
                  <img
                    src={member.profileImage}
                    alt={member.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <IoPersonCircleSharp className="w-16 h-16 text-gray-300" />
                )}
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {member.name}
                    </h3>
                  </div>
                  <p className="text-purple-600 font-medium">
                    {member.username}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium border ${badge.color}`}>
                  <span className="mr-1">{badge.icon}</span>
                  {badge.name}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-gray-600 text-sm">
                  {member.department}
                </p>
              </div>

              <div className="space-y-2">
                {/* TikTok */}
                <a
                  href={member.socialLinks?.tiktok ? `https://tiktok.com/@${member.socialLinks.tiktok}` : ''}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between group"
                  style={{ textDecoration: 'none' }}
                >
                  <div className="flex items-center space-x-2">
                    <AiFillTikTok className="h-5 w-5 text-black group-hover:text-cyan-500 transition" />
                    <span className="text-sm text-gray-600 group-hover:text-cyan-500 transition">TikTok</span>
                  </div>
                  <span className="font-semibold text-gray-900 group-hover:text-cyan-500 transition">
                    {followersMap[member.socialLinks?.instagram || member.socialLinks?.tiktok || member.username]?.loading ? (
                      <span className="inline-block w-10 h-5 bg-gray-200 animate-pulse rounded"></span>
                    ) : (
                      formatFollowers(followersMap[member.socialLinks?.instagram || member.socialLinks?.tiktok || member.username]?.tiktok ?? 0)
                    )}
                  </span>
                </a>
                {/* Instagram */}
                <a
                  href={member.socialLinks?.instagram ? `https://instagram.com/${member.socialLinks.instagram}` : ''}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between group"
                  style={{ textDecoration: 'none' }}
                >
                  <div className="flex items-center space-x-2">
                    <FaSquareInstagram className="h-5 w-5 text-black group-hover:text-pink-500 transition" />
                    <span className="text-sm text-gray-600 group-hover:text-pink-500 transition">Instagram</span>
                  </div>
                  <span className="font-semibold text-gray-900 group-hover:text-pink-500 transition">
                    {followersMap[member.socialLinks?.instagram || member.socialLinks?.tiktok || member.username]?.loading ? (
                      <span className="inline-block w-10 h-5 bg-gray-200 animate-pulse rounded"></span>
                    ) : (
                      formatFollowers(followersMap[member.socialLinks?.instagram || member.socialLinks?.tiktok || member.username]?.instagram ?? 0)
                    )}
                  </span>
                </a>
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Total Followers</span>
                    <span className="font-bold text-purple-600">
                      {followersMap[member.socialLinks?.instagram || member.socialLinks?.tiktok || member.username]?.loading ? (
                        <span className="inline-block w-10 h-5 bg-gray-200 animate-pulse rounded"></span>
                      ) : (
                        formatFollowers((followersMap[member.socialLinks?.instagram || member.socialLinks?.tiktok || member.username]?.tiktok ?? 0) + (followersMap[member.socialLinks?.instagram || member.socialLinks?.tiktok || member.username]?.instagram ?? 0))
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
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