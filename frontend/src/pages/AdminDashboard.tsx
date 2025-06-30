import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Users, TrendingUp, FileText, Settings, BarChart3, PenTool, ToggleLeft, ToggleRight } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { user, registrationEnabled, setRegistrationEnabled } = useAuth();

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

  const adminStats = [
    {
      icon: <Users className="h-6 w-6 text-blue-600" />,
      label: 'Total Members',
      value: '1,234',
      change: '+45 this month'
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-green-600" />,
      label: 'Total Followers',
      value: '2.5M',
      change: '+150K this month'
    },
    {
      icon: <FileText className="h-6 w-6 text-purple-600" />,
      label: 'Certificates Issued',
      value: '892',
      change: '+67 this month'
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-orange-600" />,
      label: 'Articles Published',
      value: '156',
      change: '+12 this month'
    }
  ];

  const recentMembers = [
    {
      name: 'Andi Pratama',
      email: '5025211001@student.its.ac.id',
      department: 'Teknik Informatika',
      badge: 'silver',
      joinDate: '2024-01-15'
    },
    {
      name: 'Sari Wijaya',
      email: '5025211002@student.its.ac.id',
      department: 'Teknik Elektro',
      badge: 'bronze',
      joinDate: '2024-01-14'
    },
    {
      name: 'Rizki Rahman',
      email: '5025211003@student.its.ac.id',
      department: 'Sistem Informasi',
      badge: 'pemula',
      joinDate: '2024-01-13'
    }
  ];

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
      icon: <PenTool className="h-5 w-5" />,
      title: 'Write Article',
      description: 'Publish news and updates',
      href: '/write',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: 'Manage Members',
      description: 'View and manage all members',
      href: '/members',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      icon: <BarChart3 className="h-5 w-5" />,
      title: 'View Analytics',
      description: 'Community statistics and insights',
      href: '/analytics',
      color: 'bg-purple-500 hover:bg-purple-600'
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {adminStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              {stat.icon}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-gray-600 text-sm mb-2">{stat.label}</p>
            <p className="text-green-600 text-xs font-medium">{stat.change}</p>
          </div>
        ))}
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
      </div>

      {/* Community Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Badge Distribution</h2>
          <div className="space-y-4">
            {[
              { badge: 'Diamond', count: 5, percentage: 0.5 },
              { badge: 'Gold', count: 23, percentage: 2.3 },
              { badge: 'Silver', count: 156, percentage: 15.6 },
              { badge: 'Bronze', count: 445, percentage: 44.5 },
              { badge: 'Pemula', count: 371, percentage: 37.1 }
            ].map((item, index) => (
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
            {[
              { department: 'Teknik Informatika', count: 234 },
              { department: 'Sistem Informasi', count: 189 },
              { department: 'Teknik Elektro', count: 167 },
              { department: 'Desain Komunikasi Visual', count: 145 },
              { department: 'Other', count: 265 }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-700 text-sm">{item.department}</span>
                <span className="text-gray-900 font-medium">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;