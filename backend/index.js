import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { MongoClient } from 'mongodb';
import crypto from 'crypto';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(cors({
  origin: true, // allow all origins for testing
  credentials: true
}));

// Koneksi ke MongoDB lokal
mongoose.connect(process.env.MONGODB_URI);

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: String,
  department: String,
  password: String,
  isAdmin: { type: Boolean, default: false },
  tiktokFollowers: { type: Number, default: 0 },
  instagramFollowers: { type: Number, default: 0 },
  badge: { type: String, default: '' },
  profileImage: String,
  bio: String,
  username: String,
  socialLinks: {
    tiktok: String,
    instagram: String,
  },
  certificateId: String,
  certificateIssueDate: Date,
});
const User = mongoose.model('User', userSchema);

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from backend!' });
});

// Helper untuk generate certificateId 12 karakter huruf kapital dan angka
function generateCertificateId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = '';
  for (let i = 0; i < 12; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

function ensureCertificateId(user, db) {
  if (!user.certificateId) {
    const newCertId = generateCertificateId();
    db.collection('users').updateOne({ _id: user._id }, { $set: { certificateId: newCertId } });
    user.certificateId = newCertId;
  }
}

// Endpoint cek users (public)
app.get('/api/users', async (req, res) => {
  try {
    await client.connect();
    const db = client.db('creator_web');
    const users = await db.collection('users').find().toArray();
    users.forEach(user => ensureCertificateId(user, db));
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ambil user by username (instagram atau tiktok)
app.get('/api/users/:username', async (req, res) => {
  try {
    await client.connect();
    const db = client.db('creator_web');
    const user = await db.collection('users').findOne({
      $or: [
        { 'socialLinks.instagram': req.params.username },
        { 'socialLinks.tiktok': req.params.username }
      ]
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    ensureCertificateId(user, db);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    await client.connect();
    const db = client.db('creator_web');
    const { id } = req.params;
    if (!id || typeof id !== 'string' || id.length !== 24 || !/^[a-fA-F0-9]{24}$/.test(id)) {
      return res.status(400).json({ error: 'Invalid user id format' });
    }
    let user;
    try {
      user = await db.collection('users').findOne({ _id: new mongoose.Types.ObjectId(id) });
    } catch (e) {
      return res.status(400).json({ error: 'Invalid ObjectId' });
    }
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'User tidak ditemukan' });
    res.json({ message: 'User berhasil dihapus', deleted });
  } catch (err) {
    console.error('Error DELETE /api/users/:id:', err);
    res.status(500).json({ message: 'Gagal hapus user', error: err.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    // Sembunyikan password di log
    const logBody = { ...req.body, password: '***' };
    console.log('POST /api/auth/register', logBody);
    const { email, name, department, password } = req.body;
    if (!email || !name || !department || !password) {
      console.error('Validasi gagal: Field tidak lengkap', req.body);
      return res.status(400).json({ message: 'Field tidak lengkap' });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      console.warn('Email sudah terdaftar:', email);
      return res.status(409).json({ message: 'Email sudah terdaftar' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, name, department, password: hashedPassword });
    await user.save()
      .then(saved => {
        console.log('User berhasil disimpan ke MongoDB:', saved._id);
        res.json({ message: 'Register success', user: saved });
      })
      .catch(err => {
        console.error('Gagal menyimpan user ke MongoDB:', err);
        if (err.name === 'ValidationError') {
          return res.status(400).json({ message: 'Validasi gagal', error: err.message });
        }
        if (err.name === 'MongoNetworkError') {
          return res.status(500).json({ message: 'Koneksi ke MongoDB gagal', error: err.message });
        }
        res.status(500).json({ message: 'Gagal registrasi', error: err.message });
      });
  } catch (err) {
    console.error('Error POST /api/auth/register:', err);
    if (err.name === 'MongoNetworkError') {
      return res.status(500).json({ message: 'Koneksi ke MongoDB gagal', error: err.message });
    }
    res.status(500).json({ message: 'Gagal registrasi', error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email dan password wajib diisi' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Password salah' });
    }
    res.json({ message: 'Login success', user });
  } catch (err) {
    console.error('Error POST /api/auth/login:', err);
    res.status(500).json({ message: 'Gagal login', error: err.message });
  }
});

app.get('/api/members/stats', async (req, res) => {
  try {
    await client.connect();
    const dbCreatorWeb = client.db('creator_web');

    // Count users (creators)
    const activeCreators = await dbCreatorWeb.collection('users').countDocuments();

    // Sum all instagramFollowers and tiktokFollowers from all users
    const users = await dbCreatorWeb.collection('users').find().toArray();
    let totalFollowers = 0;
    users.forEach(user => {
      totalFollowers += (user.instagramFollowers || 0) + (user.tiktokFollowers || 0);
    });

    res.json({ activeCreators, totalFollowers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/users/:username/followers-growth', async (req, res) => {
  try {
    await client.connect();
    const db = client.db('server_creator');
    // Ambil dua data terbaru (untuk growth per menit)
    const lastTwo = await db.collection('stats').find({'data.username': req.params.username}).sort({ timestamp: -1 }).limit(2).toArray();
    const latest = lastTwo[0] ? [lastTwo[0]] : [];
    const previousLatest = lastTwo[1] ? [lastTwo[1]] : [];
    const latestTimestamp = latest.length ? latest[0].timestamp : new Date();

    // Ambil data 1 hari lalu (sebelum data terbaru)
    const prevDay = await db.collection('stats').find({
      'data.username': req.params.username,
      timestamp: { $lt: latestTimestamp, $lte: new Date(latestTimestamp.getTime() - 24*60*60*1000) }
    }).sort({ timestamp: -1 }).limit(1).toArray();
    // Ambil data minggu lalu (hari minggu sebelumnya, sebelum data terbaru)
    const now = new Date(latestTimestamp);
    const lastSunday = new Date(now.setDate(now.getDate() - now.getDay()));
    lastSunday.setHours(0,0,0,0);
    const prevWeek = await db.collection('stats').find({
      'data.username': req.params.username,
      timestamp: { $lt: latestTimestamp, $lte: lastSunday }
    }).sort({ timestamp: -1 }).limit(1).toArray();

    const getFollowers = (doc, platform) => {
      if (!doc) return 0;
      if (platform === 'tiktok') {
        const found = doc.data.find(d => d.platform === 'tiktok' && d.username === req.params.username);
        return found ? found.followers : 0;
      } else if (platform === 'instagram') {
        const found = doc.data.find(d => d.platform === 'instagram' && d.username === req.params.username);
        return found ? found.followers : 0;
      } else {
        // total
        return doc.data
          .filter(d => d.username === req.params.username)
          .reduce((sum, d) => sum + (d.followers || 0), 0);
      }
    };

    // Helper untuk validasi angka
    function isValidNumber(val) {
      return typeof val === 'number' && !isNaN(val) && isFinite(val);
    }

    const current = latest.length ? getFollowers(latest[0]) : null;
    const previousMinute = previousLatest.length ? getFollowers(previousLatest[0]) : null;
    const previousDay = prevDay.length ? getFollowers(prevDay[0]) : null;
    const previousWeek = prevWeek.length ? getFollowers(prevWeek[0]) : null;

    const growthMinute = (isValidNumber(current) && isValidNumber(previousMinute)) ? current - previousMinute : null;
    const growthDay = (isValidNumber(current) && isValidNumber(previousDay)) ? current - previousDay : null;
    const growthWeek = (isValidNumber(current) && isValidNumber(previousWeek)) ? current - previousWeek : null;

    const currentTiktok = latest.length ? getFollowers(latest[0], 'tiktok') : null;
    const previousMinuteTiktok = previousLatest.length ? getFollowers(previousLatest[0], 'tiktok') : null;
    const growthMinuteTiktok = (isValidNumber(currentTiktok) && isValidNumber(previousMinuteTiktok)) ? currentTiktok - previousMinuteTiktok : null;

    const currentInstagram = latest.length ? getFollowers(latest[0], 'instagram') : null;
    const previousMinuteInstagram = previousLatest.length ? getFollowers(previousLatest[0], 'instagram') : null;
    const growthMinuteInstagram = (isValidNumber(currentInstagram) && isValidNumber(previousMinuteInstagram)) ? currentInstagram - previousMinuteInstagram : null;

    res.json({
      growthMinute, growthDay, growthWeek, current, previousMinute, previousDay, previousWeek,
      growthMinuteTiktok, currentTiktok, previousMinuteTiktok,
      growthMinuteInstagram, currentInstagram, previousMinuteInstagram,
      currentTimestamp: latest.length ? latest[0].timestamp : null
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint verifikasi sertifikat digital
app.get('/api/certificate/:credential', async (req, res) => {
  try {
    // Format credential: certificateId (angka unik)
    const certificateId = req.params.credential;
    await client.connect();
    const db = client.db('creator_web');
    let user = await db.collection('users').findOne({ certificateId });
    if (!user) {
      // Jika belum ada user dengan certificateId, cek apakah credential lama (userId-badgeKey-timestamp)
      const parts = certificateId.split('-');
      if (parts.length === 3) {
        const [userId] = parts;
        user = await db.collection('users').findOne({ _id: new mongoose.Types.ObjectId(userId) });
        if (user) {
          // Generate certificateId baru (12 karakter random huruf kapital dan angka)
          const newCertId = generateCertificateId();
          await db.collection('users').updateOne({ _id: user._id }, { $set: { certificateId: newCertId } });
          user.certificateId = newCertId;
        }
      }
    }
    if (!user || !user.certificateId) return res.status(404).json({ error: 'Certificate not found' });
    // Ambil badge dan followers saat ini
    const badge = user.badge || 'pemula';
    const totalFollowers = (user.tiktokFollowers || 0) + (user.instagramFollowers || 0);
    const issueDate = user.certificateIssueDate || new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
    // Sanitasi certificateId
    const cleanCertificateId = (user.certificateId || '').replace(/[^A-Z0-9]/g, '').substring(0, 12);
    res.json({
      id: cleanCertificateId,
      recipientName: user.name,
      badge,
      totalFollowers,
      issueDate,
      department: user.department,
      verificationUrl: `${req.protocol}://${req.get('host')}/certificate/${cleanCertificateId}`
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint update profile user
app.put('/api/users/profile/:id', async (req, res) => {
  try {
    await client.connect();
    const db = client.db('creator_web');
    const { id } = req.params;
    console.log('[PUT /api/users/profile/:id] id:', id);
    if (!id || typeof id !== 'string' || id.length !== 24 || !/^[a-fA-F0-9]{24}$/.test(id)) {
      return res.status(400).json({ error: 'Invalid user id format' });
    }
    const updateFields = { ...req.body };
    delete updateFields._id;
    const result = await db.collection('users').findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(id) },
      { $set: updateFields },
      { returnDocument: 'after' }
    );
    console.log('[PUT /api/users/profile/:id] result:', result.value);
    if (!result.value) return res.status(404).json({ error: 'User not found' });
    res.json(result.value);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint GET popup sponsor setting
app.get('/api/popup-setting', async (req, res) => {
  try {
    await client.connect();
    const db = client.db('creator_web');
    const doc = await db.collection('settings').findOne({ key: 'sponsor_popup' });
    if (!doc) {
      // Default value if not set
      return res.json({ enabled: false, contentType: 'text', textContent: '', imageUrl: '', link: '' });
    }
    // Pastikan semua field selalu ada
    const value = doc.value || {};
    res.json({
      enabled: typeof value.enabled === 'boolean' ? value.enabled : false,
      contentType: value.contentType || 'text',
      textContent: typeof value.textContent === 'string' ? value.textContent : '',
      imageUrl: typeof value.imageUrl === 'string' ? value.imageUrl : '',
      link: typeof value.link === 'string' ? value.link : ''
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint PUT popup sponsor setting (admin only, simple validation)
app.put('/api/popup-setting', async (req, res) => {
  try {
    // TODO: Replace with real admin check
    // if (!req.user || !req.user.isAdmin) return res.status(403).json({ error: 'Unauthorized' });
    await client.connect();
    const db = client.db('creator_web');
    const { enabled, contentType, textContent, imageUrl, link } = req.body;
    if (typeof enabled !== 'boolean' || !['text','image','both'].includes(contentType)) {
      return res.status(400).json({ error: 'Invalid data' });
    }
    const value = {
      enabled,
      contentType,
      textContent: textContent || '',
      imageUrl: imageUrl || '',
      link: link || ''
    };
    await db.collection('settings').updateOne(
      { key: 'sponsor_popup' },
      { $set: { value } },
      { upsert: true }
    );
    res.json({ success: true, value });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint migrasi massal certificateId semua user ke format baru (12 karakter random huruf kapital dan angka)
app.post('/api/certificate/migrate-all', async (req, res) => {
  try {
    await client.connect();
    const db = client.db('creator_web');
    const users = await db.collection('users').find().toArray();
    let updated = 0;
    for (const user of users) {
      // Jika certificateId belum sesuai format, update
      if (!user.certificateId || !/^[A-Z0-9]{12}$/.test(user.certificateId)) {
        const newCertId = generateCertificateId();
        await db.collection('users').updateOne({ _id: user._id }, { $set: { certificateId: newCertId } });
        updated++;
      }
    }
    res.json({ success: true, updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint membuat Certificate of Appreciation (snapshot)
app.post('/api/certificate/appreciation', async (req, res) => {
  try {
    await client.connect();
    const db = client.db('creator_web');
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId wajib diisi' });
    const user = await db.collection('users').findOne({ _id: new mongoose.Types.ObjectId(userId) });
    if (!user) return res.status(404).json({ error: 'User not found' });
    // Snapshot data
    const certificateId = generateCertificateId();
    const snapshot = {
      certificateId,
      name: user.name,
      username: user.username || '',
      department: user.department || '',
      followers: (user.instagramFollowers || 0) + (user.tiktokFollowers || 0),
      instagramFollowers: user.instagramFollowers || 0,
      tiktokFollowers: user.tiktokFollowers || 0,
      createdAt: new Date(),
    };
    await db.collection('certificates').insertOne(snapshot);
    res.json({ success: true, certificateId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint mengambil Certificate of Appreciation (snapshot)
app.get('/api/certificate/appreciation/:id', async (req, res) => {
  try {
    await client.connect();
    const db = client.db('creator_web');
    const certificateId = req.params.id;
    const cert = await db.collection('certificates').findOne({ certificateId });
    if (!cert) return res.status(404).json({ error: 'Certificate not found' });
    res.json(cert);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint update user profile (tanpa /profile, standar REST)
app.put('/api/users/:id', async (req, res) => {
  try {
    await client.connect();
    const db = client.db('creator_web');
    const { id } = req.params;
    if (!id || typeof id !== 'string' || id.length !== 24 || !/^[a-fA-F0-9]{24}$/.test(id)) {
      return res.status(400).json({ error: 'Invalid user id format' });
    }
    const updateFields = { ...req.body };
    delete updateFields._id;
    const result = await db.collection('users').findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(id) },
      { $set: updateFields },
      { returnDocument: 'after' }
    );
    if (!result.value) return res.status(404).json({ error: 'User not found' });
    res.json({ user: result.value });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const tryListen = (port) => {
  app.listen(port, '0.0.0.0', () => {
    console.log(`Backend listening on http://0.0.0.0:${port}`);
    console.log(`External access: http://157.20.32.130:${port}`);
  }).on('error', err => {
    if (err.code === 'EADDRINUSE') {
      if (port === 5000) {
        console.warn('Port 5000 in use, trying 5001...');
        tryListen(5001);
      } else {
        console.error('All ports in use. Backend failed to start.');
      }
    } else {
      throw err;
    }
  });
};

tryListen(PORT);