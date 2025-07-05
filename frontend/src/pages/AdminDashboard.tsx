import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Users, Settings, ToggleLeft, ToggleRight } from 'lucide-react';
import { getSponsorPopupSetting, updateSponsorPopupSetting, SponsorPopupSetting, getAllUsers, User } from '../api';

const AdminDashboard: React.FC = () => {
  const { user, registrationEnabled, setRegistrationEnabled } = useAuth();

  // Sponsor Popup State
  const [popupSetting, setPopupSetting] = useState<SponsorPopupSetting | null>(null);
  const [loadingPopup, setLoadingPopup] = useState(true);
  const [savingPopup, setSavingPopup] = useState(false);
  const [popupError, setPopupError] = useState<string | null>(null);
  const [popupSuccess, setPopupSuccess] = useState<string | null>(null);

  // Members & Stats State
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [userError, setUserError] = useState<string | null>(null);

  useEffect(() => {
    getSponsorPopupSetting()
      .then(setPopupSetting)
      .catch(() => setPopupSetting({ enabled: true, contentType: 'text', textContent: '', imageUrl: '', link: '' }))
      .finally(() => setLoadingPopup(false));

    getAllUsers()
      .then(setUsers)
      .catch((err: unknown) => {
        if (err instanceof Error) setUserError(err.message);
        else setUserError('Gagal mengambil data member');
      })
      .finally(() => setLoadingUsers(false));
  }, []);

  const handlePopupChange = (field: keyof SponsorPopupSetting, value: string | boolean) => {
    if (!popupSetting) return;
    setPopupSetting({ ...popupSetting, [field]: value });
  };

  const handleSavePopup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!popupSetting) return;
    setSavingPopup(true);
    setPopupError(null);
    setPopupSuccess(null);
    try {
      const updated = await updateSponsorPopupSetting(popupSetting);
      setPopupSetting(updated);
      setPopupSuccess('Pengaturan popup sponsor berhasil disimpan!');
      setTimeout(() => setPopupSuccess(null), 3000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setPopupError(err.message);
      } else {
        setPopupError('Gagal menyimpan pengaturan popup');
      }
    } finally {
      setSavingPopup(false);
    }
  };

  if (!user || !user.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">Anda tidak memiliki akses admin.</p>
          <Link to="/dashboard" className="text-purple-600 hover:text-purple-500">
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Recent Members (5 terbaru, sort by _id desc)
  const recentMembers = [...users]
    .sort((a, b) => (b._id || '').localeCompare(a._id || ''))
    .slice(0, 5)
    .map(u => ({
      name: u.name,
      email: u.email,
      department: u.department,
      badge: u.badge,
      joinDate: u._id ? new Date(parseInt(u._id.substring(0,8), 16) * 1000).toISOString().slice(0,10) : ''
    }));

  // Tambahkan fungsi getBadgeByFollowers
  function getBadgeByFollowers(totalFollowers: number) {
    if (totalFollowers >= 1_000_000) return 'Diamond';
    if (totalFollowers >= 100_000) return 'Gold';
    if (totalFollowers >= 10_000) return 'Silver';
    if (totalFollowers >= 1_000) return 'Bronze';
    return 'Pemula';
  }

  // Badge Distribution
  const badgeList = ['Diamond','Gold','Silver','Bronze','Pemula'];
  type BadgeCount = { badge: string; count: number; percentage: number };
  const badgeCounts: BadgeCount[] = badgeList.map(badge => ({
    badge,
    count: users.filter(u => getBadgeByFollowers((u.tiktokFollowers || 0) + (u.instagramFollowers || 0)) === badge).length,
    percentage: 0
  }));
  const totalBadges = badgeCounts.reduce((sum, b) => sum + b.count, 0) || 1;
  badgeCounts.forEach(b => b.percentage = +(b.count / totalBadges * 100).toFixed(1));

  // Department Distribution
  const deptMap: Record<string, number> = {};
  users.forEach(u => {
    const dept = u.department || 'Other';
    deptMap[dept] = (deptMap[dept] || 0) + 1;
  });
  const departmentCounts = Object.entries(deptMap)
    .map(([department, count]) => ({ department, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  const otherCount = users.length - departmentCounts.reduce((sum, d) => sum + d.count, 0);
  if (otherCount > 0) departmentCounts.push({ department: 'Other', count: otherCount });

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'diamond': return 'bg-cyan-100 text-cyan-800';
      case 'gold': return 'bg-yellow-100 text-yellow-800';
      case 'silver': return 'bg-gray-100 text-gray-800';
      case 'bronze': return 'bg-orange-100 text-orange-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const adminActions = [
    {
      icon: <Users className="h-5 w-5" />,
      title: 'Manage Members',
      description: 'View and manage all members',
      href: '/members',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      icon: <Settings className="h-5 w-5" />,
      title: 'System Settings',
      description: 'Configure platform settings',
      href: '#',
      color: 'bg-gray-500 hover:bg-gray-600'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Manage the ITS Creators Community platform</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Registration Status:</span>
            <button
              onClick={() => setRegistrationEnabled && setRegistrationEnabled(!registrationEnabled)}
              className="flex items-center space-x-2"
            >
              {registrationEnabled ? (
                <ToggleRight className="h-8 w-8 text-green-500" />
              ) : (
                <ToggleLeft className="h-8 w-8 text-gray-400" />
              )}
              <span className={`text-sm font-medium ${registrationEnabled ? 'text-green-600' : 'text-gray-600'}`}>
                {registrationEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </button>
          </div>
        </div>

        {/* Registration Toggle Alert */}
        <div className={`p-4 rounded-lg ${registrationEnabled ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
          <p className={`text-sm ${registrationEnabled ? 'text-green-800' : 'text-yellow-800'}`}>
            {registrationEnabled 
              ? 'Registration is currently open for new members.' 
              : 'Registration is closed. New users will see "Pendaftaran dibuka di UKM Expo ITS tahun depan" message.'
            }
          </p>
        </div>
      </div>

      {/* Admin Actions */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Admin Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {adminActions.map((action, index) => (
            <Link
              key={index}
              to={action.href}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow group"
            >
              <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                {action.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {action.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {action.description}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Members */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Members</h2>
          <Link to="/members" className="text-purple-600 hover:text-purple-700 font-medium">
            View All
          </Link>
        </div>
        {loadingUsers ? (
          <div>Loading...</div>
        ) : userError ? (
          <div className="text-red-600">{userError}</div>
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Department</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Badge</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Join Date</th>
              </tr>
            </thead>
            <tbody>
              {recentMembers.map((member, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-900">{member.name}</td>
                  <td className="py-3 px-4 text-gray-600">{member.email}</td>
                  <td className="py-3 px-4 text-gray-600">{member.department}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor(member.badge)}`}>
                      {member.badge.charAt(0).toUpperCase() + member.badge.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{member.joinDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>

      {/* Community Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Badge Distribution</h2>
          <div className="space-y-4">
            {badgeCounts.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-700">{item.badge}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full" 
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Department Distribution</h2>
          <div className="space-y-4">
            {departmentCounts.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-700 text-sm">{item.department}</span>
                <span className="text-gray-900 font-medium">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popup Sponsor Settings */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Pengaturan Popup Sponsor</h2>
        {/* Toast Success Notification */}
        {popupSuccess && (
          <div className="fixed top-6 right-6 z-50 bg-green-500 text-white px-6 py-3 rounded shadow-lg font-medium animate-fade-in-out transition-all">
            {popupSuccess}
          </div>
        )}
        {loadingPopup ? (
          <div>Loading...</div>
        ) : popupSetting && (
          <form onSubmit={handleSavePopup} className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="font-medium">Aktifkan Popup:</label>
              <input
                type="checkbox"
                checked={popupSetting.enabled}
                onChange={e => handlePopupChange('enabled', e.target.checked)}
                className="h-5 w-5"
              />
            </div>
            <div>
              <label className="font-medium block mb-1">Tipe Konten:</label>
              <select
                value={popupSetting.contentType}
                onChange={e => handlePopupChange('contentType', e.target.value)}
                className="border rounded px-2 py-1"
              >
                <option value="text">Teks Saja</option>
                <option value="image">Gambar Saja</option>
                <option value="both">Teks & Gambar</option>
              </select>
            </div>
            {(popupSetting.contentType === 'text' || popupSetting.contentType === 'both') && (
              <div>
                <label className="font-medium block mb-1">Isi Teks (HTML diperbolehkan):</label>
                <textarea
                  value={popupSetting.textContent}
                  onChange={e => handlePopupChange('textContent', e.target.value)}
                  className="border rounded px-2 py-1 w-full min-h-[80px]"
                />
              </div>
            )}
            {(popupSetting.contentType === 'image' || popupSetting.contentType === 'both') && (
              <div>
                <label className="font-medium block mb-1">URL Gambar (misal dari Google Drive):</label>
                <input
                  type="text"
                  value={popupSetting.imageUrl}
                  onChange={e => handlePopupChange('imageUrl', e.target.value)}
                  className="border rounded px-2 py-1 w-full"
                  placeholder="https://drive.google.com/..."
                />
              </div>
            )}
            {/* Input untuk link info lebih lanjut */}
            <div>
              <label className="font-medium block mb-1">Link Info Lebih Lanjut (opsional):</label>
              <input
                type="text"
                value={popupSetting.link || ''}
                onChange={e => handlePopupChange('link', e.target.value)}
                className="border rounded px-2 py-1 w-full"
                placeholder="https://contoh.link/info"
              />
            </div>
            {popupError && <div className="text-red-600 text-sm">{popupError}</div>}
            <button
              type="submit"
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
              disabled={savingPopup}
            >
              {savingPopup ? 'Menyimpan...' : 'Simpan Pengaturan'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;