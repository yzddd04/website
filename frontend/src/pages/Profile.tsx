import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { updateUserProfile, getMemberStats, MemberStats, User as ApiUser } from '../api';
import { Camera, Save, User, Mail, Building, Instagram, Heart, Video } from 'lucide-react';

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
      if (user && user._id && typeof user._id === 'string' && user._id.length === 24) {
        setIsLoadingStats(true);
        try {
          const fetchedStats = await getMemberStats(user._id);
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
    if (!user || !user._id || typeof user._id !== 'string' || user._id.length !== 24) {
      alert('User ID tidak valid. Silakan login ulang.');
      return;
    }

    try {
      const dataToUpdate = {
        name: formData.name,
        department: formData.department,
        profileImage: formData.profileImage,
        bio: formData.bio,
        socialLinks: {
          tiktok: formData.tiktokUsername,
          instagram: formData.instagramUsername,
        },
      };
      const result = await updateUserProfile(user._id, dataToUpdate);
      console.log('Profile updated:', result);
      if(setUser) {
        setUser(result.user);
        localStorage.setItem('user', JSON.stringify(result.user));
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
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Access Denied</h2>
          <p className="text-gray-600">Please login to access your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-12 mx-auto max-w-4xl sm:px-6 lg:px-8">
      <div className="overflow-hidden bg-white rounded-2xl shadow-xl">
        {/* Header */}
        <div className="px-8 py-12 bg-purple-600">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <img
                src={formData.profileImage || `https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2`}
                alt={formData.name}
                className="object-cover w-24 h-24 rounded-full border-4 border-white shadow-lg"
              />
              {isEditing && (
                <button className="absolute right-0 bottom-0 p-2 bg-white rounded-full shadow-lg transition-colors hover:bg-gray-50">
                  <Camera className="w-4 h-4 text-gray-600" />
                </button>
              )}
            </div>
            <div className="flex-1">
              <h1 className="mb-2 text-3xl font-bold text-white">
                {isEditing ? formData.name : user.name}
              </h1>
              <p className="mb-4 text-purple-100">
                {isEditing ? formData.department : user.department}
              </p>
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-xl`}>
                  {currentBadge.icon}
                </div>
                <div>
                  <p className="font-semibold text-white">{currentBadge.name}</p>
                  <p className="text-purple-100 text-sm min-h-[24px]">
                    {isLoadingStats ? (
                      <span className="inline-block w-16 h-4 bg-purple-200 rounded animate-pulse"></span>
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
                  className="px-6 py-2 font-semibold text-purple-600 bg-white rounded-lg transition-colors hover:bg-gray-50"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="space-x-3">
                  <button
                    onClick={handleSave}
                    className="inline-flex items-center px-4 py-2 space-x-2 font-semibold text-purple-600 bg-white rounded-lg transition-colors hover:bg-gray-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 font-semibold text-white bg-purple-500 rounded-lg transition-colors hover:bg-purple-400"
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
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Personal Information */}
            <div>
              <h2 className="mb-6 text-xl font-bold text-gray-900">Personal Information</h2>
              <div className="space-y-6">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    <User className="inline mr-2 w-4 h-4" />
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="px-4 py-3 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="px-4 py-3 text-gray-900 bg-gray-50 rounded-lg">{user.name}</p>
                  )}
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <p className="px-4 py-3 text-gray-900 bg-gray-50 rounded-lg">{user.username || 'Not set'}</p>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    <Mail className="inline mr-2 w-4 h-4" />
                    Email
                  </label>
                  <p className="px-4 py-3 text-gray-900 bg-gray-50 rounded-lg">{user.email}</p>
                  <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    <Building className="inline mr-2 w-4 h-4" />
                    Department
                  </label>
                  {isEditing ? (
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="px-4 py-3 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="px-4 py-3 text-gray-900 bg-gray-50 rounded-lg">{user.department}</p>
                  )}
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Bio
                  </label>
                   {isEditing ? (
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={3}
                      className="px-4 py-3 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
              <h2 className="mb-6 text-xl font-bold text-gray-900">Social Media Statistics</h2>
              <div className="space-y-6">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    <User className="inline mr-2 w-4 h-4 text-pink-500" />
                    TikTok Username
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="tiktokUsername"
                      value={formData.tiktokUsername}
                      onChange={handleInputChange}
                      placeholder="masukkan username tiktok"
                      className="px-4 py-3 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="px-4 py-3 text-gray-900 bg-gray-50 rounded-lg">
                      {user.socialLinks?.tiktok || 'Not set'}
                    </p>
                  )}
                </div>
                {!isLoadingStats && stats?.tiktok && (
                    <>
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">
                            <Heart className="inline mr-2 w-4 h-4 text-pink-500" />
                            TikTok Likes
                          </label>
                          <p className="px-4 py-3 text-gray-900 bg-gray-50 rounded-lg">
                            {stats.tiktok.likes?.toLocaleString() ?? 'N/A'}
                          </p>
                        </div>
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">
                            <Video className="inline mr-2 w-4 h-4 text-pink-500" />
                            TikTok Videos
                          </label>
                           <p className="px-4 py-3 text-gray-900 bg-gray-50 rounded-lg">
                            {stats.tiktok.videos?.toLocaleString() ?? 'N/A'}
                          </p>
                        </div>
                    </>
                )}

                 <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    <Instagram className="inline mr-2 w-4 h-4 text-purple-600" />
                    Instagram Username
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="instagramUsername"
                      value={formData.instagramUsername}
                      onChange={handleInputChange}
                      placeholder="masukkan username instagram"
                      className="px-4 py-3 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="px-4 py-3 text-gray-900 bg-gray-50 rounded-lg">
                      {user.socialLinks?.instagram || 'Not set'}
                    </p>
                  )}
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