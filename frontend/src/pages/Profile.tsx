import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { updateUserProfile, getMemberStats, MemberStats, User as ApiUser } from '../api';
import { Camera, Save, User, Mail, Building, Instagram, Zap, Heart, Video } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [stats, setStats] = useState<MemberStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  const tiktokFollowers = stats?.tiktok?.followers ?? 0;
  const instagramFollowers = stats?.instagram?.followers ?? 0;

  const [formData, setFormData] = useState({
    name: user?.name || '',
    department: user?.department || '',
    profileImage: user?.profileImage || '',
    tiktokUsername: user?.socialLinks?.tiktok || '',
    instagramUsername: user?.socialLinks?.instagram || '',
    bio: user?.bio || ''
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (user && (user.socialLinks?.instagram || user.socialLinks?.tiktok)) {
        const usernameToFetch = user.socialLinks?.instagram || user.socialLinks?.tiktok;
        if (usernameToFetch) {
            setIsLoadingStats(true);
            try {
                const fetchedStats = await getMemberStats(usernameToFetch);
                setStats(fetchedStats);
                if (fetchedStats.tiktok || fetchedStats.instagram) {
                    if(setUser) {
                        setUser((prevUser: ApiUser | null) => {
                            if (!prevUser) return null;
                            const updatedUser = { ...prevUser };
                            if(fetchedStats.tiktok) updatedUser.tiktokFollowers = fetchedStats.tiktok.followers;
                            if(fetchedStats.instagram) updatedUser.instagramFollowers = fetchedStats.instagram.followers;
                            return updatedUser;
                        });
                    }
                }
            } catch (error) {
                console.error("Failed to fetch stats:", error);
            } finally {
                setIsLoadingStats(false);
            }
        }
      } else {
        setIsLoadingStats(false);
      }
    };

    fetchStats();
  }, [user, setUser]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        department: user.department || '',
        profileImage: user.profileImage || '',
        tiktokUsername: user.socialLinks?.tiktok || '',
        instagramUsername: user.socialLinks?.instagram || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  const departments = [
    'Teknik Informatika',
    'Sistem Informasi',
    'Teknik Komputer',
    'Teknik Elektro',
    'Teknik Biomedik',
    'Teknik Mesin',
    'Teknik Industri',
    'Teknik Material',
    'Teknik Kimia',
    'Teknik Fisika',
    'Teknik Sipil',
    'Arsitektur',
    'Perencanaan Wilayah dan Kota',
    'Teknik Lingkungan',
    'Teknik Geomatika',
    'Teknik Perkapalan',
    'Teknik Sistem Perkapalan',
    'Teknik Kelautan',
    'Desain Komunikasi Visual',
    'Desain Produk Industri',
    'Statistika',
    'Matematika',
    'Fisika',
    'Kimia',
    'Biologi',
    'Aktuaria'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      const dataToUpdate = {
        name: formData.name,
        department: formData.department,
        profileImage: formData.profileImage,
        bio: formData.bio,
        socialLinks: {
          tiktok: formData.tiktokUsername,
          instagram: formData.instagramUsername,
        }
      };
      const result = await updateUserProfile(user.id, dataToUpdate);
      console.log('Profile updated:', result);
      if(setUser) {
          // Map Member to User type for setUser
          const mappedUser = {
            id: result.user._id || result.user.id,
            email: result.user.email,
            name: result.user.name,
            department: result.user.department,
            isAdmin: result.user.isAdmin,
            tiktokFollowers: result.user.tiktokFollowers,
            instagramFollowers: result.user.instagramFollowers,
            badge: result.user.badge,
            profileImage: result.user.profileImage,
            bio: result.user.bio || '',
            socialLinks: result.user.socialLinks || {},
            username: result.user.username,
          };
          setUser(mappedUser);
          localStorage.setItem('user', JSON.stringify(mappedUser));
      }
      alert('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      if (error instanceof Error) {
        alert(`Error: ${error.message}`);
      } else {
        alert('An unknown error occurred while updating the profile.');
      }
    }
  };

  const getBadge = (totalFollowers: number) => {
    if (totalFollowers >= 1000000) return { name: 'Creator Diamond', icon: '💎', color: 'from-cyan-400 to-cyan-600' };
    if (totalFollowers >= 100000) return { name: 'Creator Gold', icon: '🥇', color: 'from-yellow-400 to-yellow-600' };
    if (totalFollowers >= 10000) return { name: 'Creator Silver', icon: '🥈', color: 'from-gray-400 to-gray-600' };
    if (totalFollowers >= 1000) return { name: 'Creator Bronze', icon: '🥉', color: 'from-orange-400 to-orange-600' };
    return { name: 'Creator Pemula', icon: '🌱', color: 'from-green-400 to-green-600' };
  };

  const totalFollowers = (tiktokFollowers || 0) + (instagramFollowers || 0);
  const currentBadge = getBadge(totalFollowers);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">Please login to access your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-12">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <img
                src={formData.profileImage || `https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2`}
                alt={formData.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
              />
              {isEditing && (
                <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors">
                  <Camera className="h-4 w-4 text-gray-600" />
                </button>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">
                {isEditing ? formData.name : user.name}
              </h1>
              <p className="text-purple-100 mb-4">
                {isEditing ? formData.department : user.department}
              </p>
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${currentBadge.color} flex items-center justify-center text-xl`}>
                  {currentBadge.icon}
                </div>
                <div>
                  <p className="text-white font-semibold">{currentBadge.name}</p>
                  <p className="text-purple-100 text-sm min-h-[24px]">
                    {isLoadingStats ? (
                      <span className="inline-block w-16 h-4 bg-gradient-to-r from-purple-200 via-purple-100 to-purple-200 animate-pulse rounded"></span>
                    ) : (
                      `${totalFollowers.toLocaleString()} total followers`
                    )}
                  </p>
                </div>
              </div>
            </div>
            <div>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="space-x-3">
                  <button
                    onClick={handleSave}
                    className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors inline-flex items-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-purple-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="h-4 w-4 inline mr-2" />
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">{user.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="h-4 w-4 inline mr-2" />
                    Email
                  </label>
                  <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">{user.email}</p>
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Building className="h-4 w-4 inline mr-2" />
                    Department
                  </label>
                  {isEditing ? (
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">{user.department}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                   {isEditing ? (
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Ceritakan sedikit tentang dirimu..."
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg min-h-[50px]">
                      {user.bio || 'Not set'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Social Media Stats */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Social Media Statistics</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="h-4 w-4 inline mr-2 text-pink-500" />
                    TikTok Username
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="tiktokUsername"
                      value={formData.tiktokUsername}
                      onChange={handleInputChange}
                      placeholder="masukkan username tiktok"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">
                      {user.socialLinks?.tiktok || 'Not set'}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Zap className="h-4 w-4 inline mr-2 text-pink-500" />
                    TikTok Followers
                  </label>
                  <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg min-h-[28px]">
                    {isLoadingStats ? (
                      <span className="inline-block w-20 h-5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded"></span>
                    ) : (
                      stats?.tiktok?.followers?.toLocaleString() ?? 'N/A'
                    )}
                  </p>
                </div>
                {!isLoadingStats && stats?.tiktok && (
                    <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Heart className="h-4 w-4 inline mr-2 text-pink-500" />
                            TikTok Likes
                          </label>
                          <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">
                            {stats.tiktok.likes?.toLocaleString() ?? 'N/A'}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Video className="h-4 w-4 inline mr-2 text-pink-500" />
                            TikTok Videos
                          </label>
                           <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">
                            {stats.tiktok.videos?.toLocaleString() ?? 'N/A'}
                          </p>
                        </div>
                    </>
                )}

                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Instagram className="h-4 w-4 inline mr-2 text-purple-600" />
                    Instagram Username
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="instagramUsername"
                      value={formData.instagramUsername}
                      onChange={handleInputChange}
                      placeholder="masukkan username instagram"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">
                      {user.socialLinks?.instagram || 'Not set'}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Zap className="h-4 w-4 inline mr-2 text-purple-600" />
                    Instagram Followers
                  </label>
                  <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg min-h-[28px]">
                    {isLoadingStats ? (
                      <span className="inline-block w-20 h-5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded"></span>
                    ) : (
                      stats?.instagram?.followers?.toLocaleString() ?? 'N/A'
                    )}
                  </p>
                </div>
                 <div>
                    <h3 className="text-lg font-bold text-gray-800 mt-8 mb-4">Total Followers</h3>
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl text-center">
                        <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2 min-h-[40px]">
                            {isLoadingStats ? (
                              <span className="inline-block w-24 h-8 bg-gradient-to-r from-purple-200 via-purple-100 to-purple-200 animate-pulse rounded"></span>
                            ) : (
                              totalFollowers.toLocaleString()
                            )}
                        </p>
                        <div className="flex items-center justify-center space-x-2 text-gray-600">
                             <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${currentBadge.color} flex items-center justify-center text-sm`}>
                                {currentBadge.icon}
                            </div>
                            <span>{currentBadge.name}</span>
                        </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;