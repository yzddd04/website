import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Award, TrendingUp, Users, FileText, Download, ExternalLink, PenTool, Shield } from 'lucide-react';
import { getData, addData, getMemberStats, getMemberStatsHistory } from '../api';
import type { Data } from '../api';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import dayjs from 'dayjs';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<Data[]>([]);
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [followers, setFollowers] = useState<{ tiktok: number; instagram: number; loading: boolean }>({ tiktok: 0, instagram: 0, loading: true });
  type StatEntry = { timestamp: string; followers: string };
  const [followersHistory, setFollowersHistory] = useState<{ tiktok: StatEntry[]; instagram: StatEntry[]; loading: boolean }>({ tiktok: [], instagram: [], loading: true });
  const [selectedRange, setSelectedRange] = useState<'raw' | 'minute' | 'hour' | 'day' | 'week'>('raw');
  const [selectedChart, setSelectedChart] = useState<'all' | 'tiktok' | 'instagram'>('all');
  const [fadeIn, setFadeIn] = useState(false);
  const isFirstRender = useRef(true);
  const prevDataLength = useRef(0);
  const [isChartAnimated, setIsChartAnimated] = useState(false);

  useEffect(() => {
    getData().then(setData);
  }, []);

  useEffect(() => {
    const fetchFollowers = async () => {
      if (user && (user.socialLinks?.instagram || user.socialLinks?.tiktok)) {
        setFollowers({ tiktok: 0, instagram: 0, loading: true });
        const usernameToFetch = user.socialLinks?.instagram || user.socialLinks?.tiktok;
        if (usernameToFetch) {
          try {
            const stats = await getMemberStats(usernameToFetch);
            setFollowers({
              tiktok: stats.tiktok?.followers ?? 0,
              instagram: stats.instagram?.followers ?? 0,
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
    const fetchFollowersHistory = async () => {
      if (user && (user.socialLinks?.instagram || user.socialLinks?.tiktok)) {
        setFollowersHistory({ tiktok: [], instagram: [], loading: true });
        const usernameToFetch = user.socialLinks?.instagram || user.socialLinks?.tiktok;
        if (usernameToFetch) {
          try {
            const history = await getMemberStatsHistory(usernameToFetch);
            setFollowersHistory({
              tiktok: history.tiktok || [],
              instagram: history.instagram || [],
              loading: false,
            });
            setFadeIn(false);
            setTimeout(() => setFadeIn(true), 100);
            // Only animate if new data is added
            const newLength = (history.tiktok?.length || 0) + (history.instagram?.length || 0);
            setIsChartAnimated(prevDataLength.current !== 0 && newLength > prevDataLength.current);
            prevDataLength.current = newLength;
            isFirstRender.current = false;
          } catch {
            setFollowersHistory({ tiktok: [], instagram: [], loading: false });
          }
        } else {
          setFollowersHistory({ tiktok: [], instagram: [], loading: false });
        }
      } else {
        setFollowersHistory({ tiktok: [], instagram: [], loading: false });
      }
    };
    fetchFollowersHistory();
    const interval = setInterval(fetchFollowersHistory, 5000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    setFadeIn(false);
    isFirstRender.current = true;
    setIsChartAnimated(false);
    prevDataLength.current = 0;
  }, [selectedRange, selectedChart]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newItem = await addData(name, value);
    setData([...data, newItem]);
    setName('');
    setValue('');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">Anda harus login untuk mengakses dashboard.</p>
          <Link to="/login" className="text-purple-600 hover:text-purple-500">
            Login Sekarang
          </Link>
        </div>
      </div>
    );
  }

  const getBadgeDetails = (badge: string) => {
    switch (badge) {
      case 'diamond':
        return { icon: '💎', color: 'from-cyan-400 to-cyan-600', name: 'Creator Diamond' };
      case 'gold':
        return { icon: '🥇', color: 'from-yellow-400 to-yellow-600', name: 'Creator Gold' };
      case 'silver':
        return { icon: '🥈', color: 'from-gray-400 to-gray-600', name: 'Creator Silver' };
      case 'bronze':
        return { icon: '🥉', color: 'from-orange-400 to-orange-600', name: 'Creator Bronze' };
      default:
        return { icon: '🌱', color: 'from-green-400 to-green-600', name: 'Creator Pemula' };
    }
  };

  const badgeDetails = getBadgeDetails(user.badge ?? 'pemula');
  const totalFollowers = (followers.tiktok ?? 0) + (followers.instagram ?? 0);
  const certificateUrl = `/certificate/${user.id}-${user.badge ?? 'pemula'}-${Date.now()}`;

  const stats = [
    {
      icon: <TrendingUp className="h-6 w-6 text-blue-600" />,
      label: 'Total Followers',
      value: followers.loading ? (
        <span className="inline-block w-12 h-6 bg-gradient-to-r from-purple-200 via-purple-100 to-purple-200 animate-pulse rounded"></span>
      ) : (
        totalFollowers.toLocaleString()
      ),
      change: '+12%'
    },
    {
      icon: <Users className="h-6 w-6 text-green-600" />,
      label: 'TikTok Followers',
      value: followers.loading ? (
        <span className="inline-block w-12 h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded"></span>
      ) : (
        followers.tiktok.toLocaleString()
      ),
      change: '+8%'
    },
    {
      icon: <Users className="h-6 w-6 text-pink-600" />,
      label: 'Instagram Followers',
      value: followers.loading ? (
        <span className="inline-block w-12 h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded"></span>
      ) : (
        followers.instagram.toLocaleString()
      ),
      change: '+15%'
    },
    {
      icon: <Award className="h-6 w-6 text-purple-600" />,
      label: 'Current Badge',
      value: badgeDetails.name,
      change: ''
    }
  ];

  const quickActions = [
    {
      icon: <Download className="h-5 w-5" />,
      title: 'Download Certificate',
      description: 'Download sertifikat digital Anda',
      href: certificateUrl,
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      icon: <PenTool className="h-5 w-5" />,
      title: 'Write Article',
      description: 'Tulis artikel atau konten baru',
      href: '/write',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: 'Edit Profile',
      description: 'Update informasi profil Anda',
      href: '/profile',
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ];

  // Add admin-specific actions if user is admin
  if (user.isAdmin) {
    quickActions.push({
      icon: <Shield className="h-5 w-5" />,
      title: 'Admin Dashboard',
      description: 'Kelola komunitas dan anggota',
      href: '/admin',
      color: 'bg-red-500 hover:bg-red-600'
    });
  }

  // Merge TikTok and Instagram stats by timestamp for chart
  const mergeStatsByTime = (tiktok: StatEntry[], instagram: StatEntry[], range: 'raw' | 'minute' | 'hour' | 'day' | 'week') => {
    if (range === 'raw') {
      // Show all points as-is, sorted by timestamp. Merge if both platforms have the same timestamp.
      const map = new Map<string, { time: string; tiktok: number; instagram: number }>();
      tiktok.forEach(t => {
        const key = dayjs(t.timestamp).format('YYYY-MM-DD HH:mm:ss');
        map.set(key, { time: key, tiktok: typeof t.followers === 'number' ? t.followers : parseInt(t.followers), instagram: 0 });
      });
      instagram.forEach(i => {
        const key = dayjs(i.timestamp).format('YYYY-MM-DD HH:mm:ss');
        if (map.has(key)) {
          map.get(key)!.instagram = typeof i.followers === 'number' ? i.followers : parseInt(i.followers);
        } else {
          map.set(key, { time: key, tiktok: 0, instagram: typeof i.followers === 'number' ? i.followers : parseInt(i.followers) });
        }
      });
      return Array.from(map.values()).sort((a, b) => a.time.localeCompare(b.time));
    }
    // Grouped mode: merge all unique keys from both arrays
    const map = new Map<string, { time: string; tiktok: number; instagram: number }>();
    tiktok.forEach(t => {
      const time = dayjs(t.timestamp);
      let key = '';
      if (range === 'minute') key = time.format('YYYY-MM-DD HH:mm');
      else if (range === 'hour') key = time.format('YYYY-MM-DD HH');
      else if (range === 'day') key = time.format('YYYY-MM-DD');
      else if (range === 'week') key = time.startOf('week').format('YYYY-[W]WW');
      map.set(key, { time: key, tiktok: typeof t.followers === 'number' ? t.followers : parseInt(t.followers), instagram: 0 });
    });
    instagram.forEach(i => {
      const time = dayjs(i.timestamp);
      let key = '';
      if (range === 'minute') key = time.format('YYYY-MM-DD HH:mm');
      else if (range === 'hour') key = time.format('YYYY-MM-DD HH');
      else if (range === 'day') key = time.format('YYYY-MM-DD');
      else if (range === 'week') key = time.startOf('week').format('YYYY-[W]WW');
      if (map.has(key)) {
        map.get(key)!.instagram = typeof i.followers === 'number' ? i.followers : parseInt(i.followers);
      } else {
        map.set(key, { time: key, tiktok: 0, instagram: typeof i.followers === 'number' ? i.followers : parseInt(i.followers) });
      }
    });
    // If only instagram has data, add those keys too
    if (tiktok.length === 0 && instagram.length > 0) {
      instagram.forEach(i => {
        const time = dayjs(i.timestamp);
        let key = '';
        if (range === 'minute') key = time.format('YYYY-MM-DD HH:mm');
        else if (range === 'hour') key = time.format('YYYY-MM-DD HH');
        else if (range === 'day') key = time.format('YYYY-MM-DD');
        else if (range === 'week') key = time.startOf('week').format('YYYY-[W]WW');
        if (!map.has(key)) {
          map.set(key, { time: key, tiktok: 0, instagram: typeof i.followers === 'number' ? i.followers : parseInt(i.followers) });
        }
      });
    }
    return Array.from(map.values()).sort((a, b) => a.time.localeCompare(b.time));
  };

  // Modified grouping for Minute/Hour/Day/Week: fill missing buckets with previous value
  function mergeStatsByTimeWithBuckets(tiktok: StatEntry[], instagram: StatEntry[], range: 'raw' | 'minute' | 'hour' | 'day' | 'week') {
    if (range === 'raw') return mergeStatsByTime(tiktok, instagram, range);
    // Grouped mode: merge all unique keys from both arrays
    const merged = mergeStatsByTime(tiktok, instagram, range);
    const buckets = generateTimeBuckets(merged, range === 'minute' ? 'minute' : range);
    let prevTiktok = 0, prevInstagram = 0;
    const filled = buckets.map(bucket => {
      const found = merged.find(d => d.time === bucket);
      if (found) {
        prevTiktok = found.tiktok;
        prevInstagram = found.instagram;
        return { ...found };
      } else {
        return { time: bucket, tiktok: prevTiktok, instagram: prevInstagram };
      }
    });
    return filled;
  }

  // Update generateTimeBuckets to support 'minute'
  function generateTimeBuckets(data: { time: string; tiktok: number; instagram: number }[], range: 'minute' | 'hour' | 'day' | 'week') {
    if (data.length === 0) return [];
    const buckets: string[] = [];
    const first = dayjs(data[0].time);
    const last = dayjs(data[data.length - 1].time);
    let cursor = first.startOf(range);
    while (cursor.isBefore(last) || cursor.isSame(last)) {
      if (range === 'minute') buckets.push(cursor.format('YYYY-MM-DD HH:mm'));
      else if (range === 'hour') buckets.push(cursor.format('YYYY-MM-DD HH'));
      else if (range === 'day') buckets.push(cursor.format('YYYY-MM-DD'));
      else if (range === 'week') buckets.push(cursor.startOf('week').format('YYYY-[W]WW'));
      cursor = cursor.add(1, range);
    }
    return buckets;
  }

  // Use the new grouping for Minute/Hour/Day/Week
  const baseChartData = (selectedRange === 'minute' || selectedRange === 'hour' || selectedRange === 'day' || selectedRange === 'week')
    ? mergeStatsByTimeWithBuckets(followersHistory.tiktok, followersHistory.instagram, selectedRange)
    : mergeStatsByTime(followersHistory.tiktok, followersHistory.instagram, selectedRange);

  // Carry forward for each series independently, then sum for 'all'.
  // If the first value is 0/null, use the first non-zero value for all previous points.
  function fillSeriesWithPrevious(data: { time: string; tiktok: number; instagram: number }[]): { time: string; tiktok: number; instagram: number; all: number }[] {
    let prevTiktok: number | null = null;
    let prevInstagram: number | null = null;
    // Find first non-zero tiktok and instagram
    for (const d of data) {
      if (prevTiktok === null && d.tiktok > 0) prevTiktok = d.tiktok;
      if (prevInstagram === null && d.instagram > 0) prevInstagram = d.instagram;
      if (prevTiktok !== null && prevInstagram !== null) break;
    }
    return data.map(d => {
      let tiktok = d.tiktok;
      let instagram = d.instagram;
      if ((tiktok === 0 || tiktok == null)) tiktok = prevTiktok ?? 0;
      if ((instagram === 0 || instagram == null)) instagram = prevInstagram ?? 0;
      prevTiktok = tiktok;
      prevInstagram = instagram;
      return { ...d, tiktok, instagram, all: tiktok + instagram };
    });
  }
  const filledChartData = fillSeriesWithPrevious(baseChartData);
  // Filter chart data based on selectedChart
  const chartData: { time: string; value: number }[] = filledChartData.map(d => ({
    time: d.time,
    value:
      selectedChart === 'all' ? d.all :
      selectedChart === 'tiktok' ? d.tiktok :
      d.instagram,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center space-x-4 mb-6">
          <img
            src={user.profileImage || `https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2`}
            alt={user.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user.name}!
              </h1>
              {user.isAdmin && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 border border-red-200">
                  <Shield className="h-4 w-4 mr-1" />
                  Admin
                </span>
              )}
            </div>
            <p className="text-gray-600">{user.department}</p>
          </div>
        </div>

        {/* Badge Display */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center space-x-4">
            <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${badgeDetails.color} flex items-center justify-center text-2xl`}>
              {badgeDetails.icon}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900">{badgeDetails.name}</h3>
              <p className="text-gray-600">Total {followers.loading ? (
                <span className="inline-block w-12 h-6 bg-gradient-to-r from-purple-200 via-purple-100 to-purple-200 animate-pulse rounded"></span>
              ) : (
                totalFollowers.toLocaleString()
              )} followers</p>
            </div>
            <div className="text-right">
              <Link
                to={certificateUrl}
                target="_blank"
                className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-medium"
              >
                <span>View Certificate</span>
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              {stat.icon}
              {stat.change && (
                <span className="text-green-600 text-sm font-medium">{stat.change}</span>
              )}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-gray-600 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Modern Followers Trend Chart */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Followers Overview</h2>
          <div className="flex space-x-2">
            {(['raw', 'minute', 'hour', 'day', 'week'] as ('raw' | 'minute' | 'hour' | 'day' | 'week')[]).map(opt => (
              <button
                key={opt}
                className={`px-3 py-1 rounded text-sm font-medium ${selectedRange === opt ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => setSelectedRange(opt)}
              >
                {opt === 'raw' ? 'Raw' : opt.charAt(0).toUpperCase() + opt.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex space-x-2 ml-4">
            {(['all', 'tiktok', 'instagram'] as ('all' | 'tiktok' | 'instagram')[]).map(opt => (
              <button
                key={opt}
                className={`px-3 py-1 rounded text-sm font-medium ${selectedChart === opt ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => setSelectedChart(opt)}
              >
                {opt === 'all' ? 'All Followers' : opt.charAt(0).toUpperCase() + opt.slice(1) + ' Followers'}
              </button>
            ))}
          </div>
        </div>
        {followersHistory.loading ? (
          <div className="w-full h-[300px] flex items-center justify-center">
            <span className="inline-block w-full h-10 bg-gradient-to-r from-purple-200 via-purple-100 to-purple-200 animate-pulse rounded"></span>
          </div>
        ) : chartData.length === 0 && (followersHistory.tiktok.length === 0 && followersHistory.instagram.length === 0) ? (
          <div className="w-full h-[300px] flex items-center justify-center text-gray-400 text-lg">
            Tidak ada data followers untuk rentang waktu ini.
          </div>
        ) : (
          <div className={`transition-opacity duration-700 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorFollowers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" tick={{ fontSize: 12, fill: '#888' }} />
                <YAxis tick={{ fontSize: 12, fill: '#888' }} />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#7c3aed" fillOpacity={1} fill="url(#colorFollowers)" strokeWidth={3} dot={{ r: 3 }} name="Followers" isAnimationActive={isChartAnimated && !isFirstRender.current} animationDuration={1500} animationEasing="ease-in-out" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {quickActions.map((action, index) => (
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

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Award className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Badge Updated</p>
              <p className="text-sm text-gray-600">Your badge has been updated to {badgeDetails.name}</p>
            </div>
            <span className="text-sm text-gray-500">2 days ago</span>
          </div>
          
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Followers Milestone</p>
              <p className="text-sm text-gray-600">Congratulations on reaching {totalFollowers.toLocaleString()} total followers!</p>
            </div>
            <span className="text-sm text-gray-500">1 week ago</span>
          </div>
          
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <FileText className="h-5 w-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Certificate Generated</p>
              <p className="text-sm text-gray-600">Your digital certificate has been generated and is ready for download</p>
            </div>
            <span className="text-sm text-gray-500">2 weeks ago</span>
          </div>
        </div>
      </div>

      <div>
        <h2>Data dari MongoDB</h2>
        <ul>
          {data.map((item) => (
            <li key={item._id}>{item.name}: {item.value}</li>
          ))}
        </ul>
        <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Name"
            required
          />
          <input
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder="Value"
            required
          />
          <button type="submit">Tambah Data</button>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;