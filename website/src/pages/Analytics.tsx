import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { TrendingUp, Users, Eye, Heart, BarChart3, Calendar, Target, Zap } from 'lucide-react';

const Analytics: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">Please login to access analytics.</p>
        </div>
      </div>
    );
  }

  const analyticsData = {
    totalFollowers: user.tiktokFollowers + user.instagramFollowers,
    monthlyGrowth: 12.5,
    engagementRate: 4.8,
    avgViews: 15420,
    topContent: [
      { platform: 'TikTok', title: 'Tutorial Coding React', views: 45000, likes: 2300, engagement: 5.1 },
      { platform: 'Instagram', title: 'Behind the Scenes', views: 28000, likes: 1800, engagement: 6.4 },
      { platform: 'TikTok', title: 'Day in My Life as CS Student', views: 32000, likes: 1950, engagement: 6.1 },
      { platform: 'Instagram', title: 'Tech Setup Tour', views: 21000, likes: 1400, engagement: 6.7 }
    ],
    weeklyStats: [
      { day: 'Mon', tiktok: 120, instagram: 85 },
      { day: 'Tue', tiktok: 150, instagram: 92 },
      { day: 'Wed', tiktok: 180, instagram: 110 },
      { day: 'Thu', tiktok: 200, instagram: 125 },
      { day: 'Fri', tiktok: 250, instagram: 140 },
      { day: 'Sat', tiktok: 300, instagram: 180 },
      { day: 'Sun', tiktok: 220, instagram: 160 }
    ]
  };

  const stats = [
    {
      icon: <Users className="h-6 w-6 text-blue-600" />,
      label: 'Total Followers',
      value: analyticsData.totalFollowers.toLocaleString(),
      change: `+${analyticsData.monthlyGrowth}%`,
      changeType: 'positive'
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-green-600" />,
      label: 'Monthly Growth',
      value: `${analyticsData.monthlyGrowth}%`,
      change: '+2.3%',
      changeType: 'positive'
    },
    {
      icon: <Heart className="h-6 w-6 text-pink-600" />,
      label: 'Engagement Rate',
      value: `${analyticsData.engagementRate}%`,
      change: '+0.8%',
      changeType: 'positive'
    },
    {
      icon: <Eye className="h-6 w-6 text-purple-600" />,
      label: 'Avg. Views',
      value: analyticsData.avgViews.toLocaleString(),
      change: '+15%',
      changeType: 'positive'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Analytics Dashboard
        </h1>
        <p className="text-gray-600">
          Track your content performance and audience growth across platforms
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              {stat.icon}
              <span className={`text-sm font-medium ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-gray-600 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Weekly Growth Chart */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Weekly Follower Growth</h2>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {analyticsData.weeklyStats.map((day, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-12 text-sm text-gray-600 font-medium">{day.day}</div>
                <div className="flex-1 flex space-x-2">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">TikTok</span>
                      <span className="text-xs text-gray-700">{day.tiktok}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-pink-500 h-2 rounded-full" 
                        style={{ width: `${(day.tiktok / 300) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">Instagram</span>
                      <span className="text-xs text-gray-700">{day.instagram}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full" 
                        style={{ width: `${(day.instagram / 200) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Breakdown */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Platform Breakdown</h2>
            <Target className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-pink-500" />
                  <span className="font-medium text-gray-900">TikTok</span>
                </div>
                <span className="text-gray-700 font-semibold">
                  {user.tiktokFollowers.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-pink-500 h-3 rounded-full" 
                  style={{ width: `${(user.tiktokFollowers / analyticsData.totalFollowers) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {((user.tiktokFollowers / analyticsData.totalFollowers) * 100).toFixed(1)}% of total
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded"></div>
                  <span className="font-medium text-gray-900">Instagram</span>
                </div>
                <span className="text-gray-700 font-semibold">
                  {user.instagramFollowers.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full" 
                  style={{ width: `${(user.instagramFollowers / analyticsData.totalFollowers) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {((user.instagramFollowers / analyticsData.totalFollowers) * 100).toFixed(1)}% of total
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Content */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Top Performing Content</h2>
          <Calendar className="h-5 w-5 text-gray-400" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Platform</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Content</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Views</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Likes</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Engagement</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.topContent.map((content, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      {content.platform === 'TikTok' ? (
                        <Zap className="h-4 w-4 text-pink-500" />
                      ) : (
                        <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded"></div>
                      )}
                      <span className="text-sm font-medium text-gray-900">{content.platform}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-900">{content.title}</td>
                  <td className="py-3 px-4 text-gray-700">{content.views.toLocaleString()}</td>
                  <td className="py-3 px-4 text-gray-700">{content.likes.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span className="text-green-600 font-medium">{content.engagement}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">AI-Powered Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/10 rounded-lg p-4">
            <h3 className="font-semibold mb-2">📈 Growth Trend</h3>
            <p className="text-sm opacity-90">
              Your follower growth has increased by 25% compared to last month. 
              Keep posting consistently to maintain this momentum.
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <h3 className="font-semibold mb-2">🎯 Best Posting Time</h3>
            <p className="text-sm opacity-90">
              Your audience is most active between 7-9 PM. Consider scheduling 
              your posts during this time for maximum engagement.
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <h3 className="font-semibold mb-2">💡 Content Suggestion</h3>
            <p className="text-sm opacity-90">
              Tutorial content performs 40% better than other types. 
              Consider creating more educational content.
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <h3 className="font-semibold mb-2">🏆 Next Badge Goal</h3>
            <p className="text-sm opacity-90">
              You're {(user.badge === 'bronze' ? 10000 - analyticsData.totalFollowers : 0).toLocaleString()} followers away from Silver badge. 
              Keep creating amazing content!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;