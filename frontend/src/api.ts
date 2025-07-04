const API_URL = '/api/data';

// Coba port 5000 jika 5001 gagal
async function fetchWithFallback(url: string, options?: RequestInit): Promise<Response> {
  try {
    // Coba port utama (diasumsikan dari URL yang diberikan)
    return await fetch(url, options);
  } catch (error) {
    // Hanya fallback jika terjadi error jaringan (TypeError), bukan error HTTP (seperti 404, 409, 500)
    if (error instanceof TypeError) {
      console.warn(`Koneksi ke ${url} gagal. Mencoba port fallback...`);
      const fallbackUrl = url.includes(':5001')
        ? url.replace(':5001', ':5000')
        : url.replace(':5000', ':5001');
      return fetch(fallbackUrl, options);
    }
    // Jika bukan error jaringan, lempar kembali error aslinya
    throw error;
  }
}

export interface Data {
  _id: string;
  name: string;
  value: string;
}

/**
 * Mengambil data dari backend
 * @returns {Promise<Data[]>}
 */
export async function getData(): Promise<Data[]> {
  const res = await fetchWithFallback(API_URL);
  return res.json();
}

/**
 * Menambah data ke backend
 * @param {string} name
 * @param {string} value
 * @returns {Promise<Data>}
 */
export async function addData(name: string, value: string): Promise<Data> {
  const res = await fetchWithFallback(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, value })
  });
  return res.json();
}

/**
 * Register user ke backend
 * @param {string} email
 * @param {string} name
 * @param {string} department
 * @param {string} password
 * @returns {Promise<{message: string}>}
 */
export async function registerUser(email: string, name: string, department: string, password: string): Promise<{message: string}> {
  try {
    const res = await fetchWithFallback('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, department, password })
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      if (res.status === 409) {
        throw new Error('Email sudah terdaftar. Silakan gunakan email lain atau login.');
      }
      throw new Error(data.message || 'Gagal registrasi');
    }
    
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Terjadi kesalahan saat registrasi');
  }
}

export interface User {
  id: string;
  _id?: string;
  username: string;
  email: string;
  name: string;
  department: string;
  isAdmin: boolean;
  tiktokFollowers: number;
  instagramFollowers: number;
  badge: string;
  profileImage?: string;
  bio?: string;
  socialLinks?: {
    tiktok?: string;
    instagram?: string;
  };
  certificateId?: string;
}

/**
 * Login user ke backend
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{user: User, message: string}>}
 */
export async function loginUser(email: string, password: string): Promise<{user: User, message: string}> {
  try {
    const res = await fetchWithFallback('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      if (res.status === 401) {
        throw new Error('Email atau password salah. Silakan cek kembali.');
      }
      throw new Error(data.message || 'Gagal login');
    }
    
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Terjadi kesalahan saat login');
  }
}

export interface News {
  _id?: string;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  isAdmin: boolean;
  date?: string;
  views: number;
  likes: number;
  comments: number;
  category: string;
}

// News
export async function getNews(): Promise<News[]> {
  const res = await fetchWithFallback('/api/news');
  return res.json();
}
export async function addNews(news: News): Promise<News> {
  const res = await fetchWithFallback('/api/news', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(news)
  });
  return res.json();
}

export interface Article {
  _id?: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  featuredImage: string;
  author: string;
  date?: string;
}

// Articles
export async function getArticles(): Promise<Article[]> {
  const res = await fetchWithFallback('/api/articles');
  return res.json();
}
export async function addArticle(article: Article): Promise<Article> {
  const res = await fetchWithFallback('/api/articles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(article)
  });
  return res.json();
}

export interface Stats {
    activeCreators: number;
    totalFollowers: number;
    certificatesIssued: number;
    brandPartnerships: number;
}

/**
 * Mengambil statistik dari backend
 * @returns {Promise<Stats>}
 */
export async function getStats(): Promise<Stats> {
  const res = await fetchWithFallback('/api/members/stats');
  return res.json();
}

// -- INTERFACES for STATS --
export interface Stat {
  _id: string;
  timestamp: string;
  username: string;
  followers: number;
}
export interface TiktokStatData extends Stat {
  likes: number;
  videos: number;
  following: number;
}
export interface MemberStats {
    tiktok: TiktokStatData | null;
    instagram: Stat | null;
}

// User Profile
export async function getMemberStats(userId: string): Promise<MemberStats> {
  if (!userId) {
    return { tiktok: null, instagram: null };
  }
  const res = await fetchWithFallback(`/api/users/id/${userId}`);
  if (!res.ok) {
    // throw new Error('Failed to fetch member stats');
    console.error('Failed to fetch member stats');
    return { tiktok: null, instagram: null };
  }
  return res.json();
}

export async function updateUserProfile(userId: string, profileData: Partial<User>): Promise<{user: User}> {
  const res = await fetchWithFallback(`/api/users/profile/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profileData),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to update profile');
  }

  return res.json();
}

export async function getUser(userId: string): Promise<User> {
  const res = await fetchWithFallback(`/api/users/id/${userId}`);
  if (!res.ok) throw new Error('Failed to fetch user');
  return res.json();
}

export interface FollowersGrowth {
  growthMinute: number | null;
  growthDay: number | null;
  growthWeek: number | null;
  current: number | null;
  previousMinute: number | null;
  previousDay: number | null;
  previousWeek: number | null;
  growthMinuteTiktok: number | null;
  currentTiktok: number | null;
  previousMinuteTiktok: number | null;
  growthMinuteInstagram: number | null;
  currentInstagram: number | null;
  previousMinuteInstagram: number | null;
  currentTimestamp?: string;
}

export async function getFollowersGrowth(username: string): Promise<FollowersGrowth> {
  const res = await fetchWithFallback(`/api/users/${username}/followers-growth`);
  if (!res.ok) throw new Error('Failed to fetch followers growth');
  return res.json();
}

export interface SponsorPopupSetting {
  enabled: boolean;
  contentType: 'text' | 'image' | 'both';
  textContent: string;
  imageUrl: string;
}

export async function getSponsorPopupSetting(): Promise<SponsorPopupSetting> {
  const res = await fetch('/api/popup-setting');
  if (!res.ok) throw new Error('Failed to fetch sponsor popup setting');
  return res.json();
}

export async function updateSponsorPopupSetting(setting: SponsorPopupSetting): Promise<SponsorPopupSetting> {
  const res = await fetch('/api/popup-setting', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(setting)
  });
  if (!res.ok) throw new Error('Failed to update sponsor popup setting');
  return (await res.json()).value;
}

export async function getAllUsers(): Promise<User[]> {
  const res = await fetchWithFallback('/api/users');
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
} 