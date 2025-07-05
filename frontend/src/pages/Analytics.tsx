import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BarChart3, Calendar, Target } from 'lucide-react';

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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Weekly Growth Chart */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Weekly Follower Growth</h2>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {/* Weekly growth chart content */}
          </div>
        </div>

        {/* Platform Breakdown */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Platform Breakdown</h2>
            <Target className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-6">
            {/* Platform breakdown content */}
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
              {/* Top content table content */}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-purple-600 rounded-xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">AI-Powered Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Insights content */}
        </div>
      </div>
    </div>
  );
};

export default Analytics;