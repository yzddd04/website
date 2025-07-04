import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { MongoClient } from 'mongodb';
import crypto from 'crypto';
dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

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

function ensureCertificateId(user, db) {
  if (!user.certificateId) {
    const newCertId = Math.floor(100000000000 + Math.random() * 900000000000).toString();
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

app.get('/api/users/id/:id', async (req, res) => {
  try {
    await client.connect();
    const db = client.db('creator_web');
    const { id } = req.params;
    if (!id || typeof id !== 'string' || id.length !== 24 || !/^[a-fA-F0-9]{24}$/.test(id)) {
      return res.status(400).json({ error: 'Invalid user id format' });
    }
    const user = await db.collection('users').findOne({ _id: new mongoose.Types.ObjectId(id) });
    if (!user) return res.status(404).json({ error: 'User not found' });
    ensureCertificateId(user, db);
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
    const db = client.db('server_creator');
    const stats = await db.collection('stats').find().sort({ timestamp: -1 }).limit(1).toArray();
    res.json(stats[0] || {});
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
          // Generate certificateId baru (12 digit angka random)
          const newCertId = Math.floor(100000000000 + Math.random() * 900000000000).toString();
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
    res.json({
      id: user.certificateId,
      recipientName: user.name,
      badge,
      totalFollowers,
      issueDate,
      department: user.department,
      verificationUrl: `${req.protocol}://${req.get('host')}/certificate/${user.certificateId}`
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

const tryListen = (port) => {
  app.listen(port, () => {
    console.log(`Backend listening on http://localhost:${port}`);
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