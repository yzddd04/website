import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

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
  socialLinks: {
    tiktok: String,
    instagram: String,
  },
});
const User = mongoose.model('User', userSchema);

// Tambah schema dan model untuk fitur lain
const memberSchema = new mongoose.Schema({
  name: String,
  email: String,
  username: String,
  department: String,
  tiktokFollowers: { type: Number, default: 0 },
  instagramFollowers: { type: Number, default: 0 },
  badge: String,
  isAdmin: { type: Boolean, default: false },
  profileImage: String,
  joinDate: { type: Date, default: Date.now },
});
const Member = mongoose.model('Member', memberSchema);

const newsSchema = new mongoose.Schema({
  title: String,
  excerpt: String,
  image: String,
  author: String,
  isAdmin: Boolean,
  date: Date,
  views: Number,
  likes: Number,
  comments: Number,
  category: String,
});
const News = mongoose.model('News', newsSchema);

const articleSchema = new mongoose.Schema({
  title: String,
  excerpt: String,
  content: String,
  category: String,
  featuredImage: String,
  author: String,
  date: Date,
});
const Article = mongoose.model('Article', articleSchema);

const dataSchema = new mongoose.Schema({
  name: String,
  value: String,
});
const Data = mongoose.model('Data', dataSchema);

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from backend!' });
});

// CRUD Data
app.get('/api/data', async (req, res) => {
  console.log('GET /api/data');
  const data = await Data.find();
  res.json(data);
});
app.post('/api/data', async (req, res) => {
  console.log('POST /api/data', req.body);
  try {
    const data = new Data(req.body);
    await data.save();
    res.json(data);
  } catch (err) {
    console.error('Error POST /api/data:', err);
    res.status(500).json({ message: 'Gagal simpan data', error: err.message });
  }
});
app.delete('/api/data/:id', async (req, res) => {
  try {
    const deleted = await Data.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Data tidak ditemukan' });
    res.json({ message: 'Data berhasil dihapus', deleted });
  } catch (err) {
    console.error('Error DELETE /api/data/:id:', err);
    res.status(500).json({ message: 'Gagal hapus data', error: err.message });
  }
});

// CRUD Members
app.get('/api/members', async (req, res) => {
  console.log('GET /api/members');
  const members = await Member.find();
  res.json(members);
});
app.post('/api/members', async (req, res) => {
  console.log('POST /api/members', req.body);
  try {
    const member = new Member(req.body);
    await member.save();
    res.json(member);
  } catch (err) {
    console.error('Error POST /api/members:', err);
    res.status(500).json({ message: 'Gagal simpan member', error: err.message });
  }
});
app.delete('/api/members/:id', async (req, res) => {
  try {
    const deleted = await Member.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Member tidak ditemukan' });
    res.json({ message: 'Member berhasil dihapus', deleted });
  } catch (err) {
    console.error('Error DELETE /api/members/:id:', err);
    res.status(500).json({ message: 'Gagal hapus member', error: err.message });
  }
});

// CRUD News
app.get('/api/news', async (req, res) => {
  console.log('GET /api/news');
  const news = await News.find();
  res.json(news);
});
app.post('/api/news', async (req, res) => {
  console.log('POST /api/news', req.body);
  try {
    const news = new News(req.body);
    await news.save();
    res.json(news);
  } catch (err) {
    console.error('Error POST /api/news:', err);
    res.status(500).json({ message: 'Gagal simpan news', error: err.message });
  }
});
app.delete('/api/news/:id', async (req, res) => {
  try {
    const deleted = await News.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'News tidak ditemukan' });
    res.json({ message: 'News berhasil dihapus', deleted });
  } catch (err) {
    console.error('Error DELETE /api/news/:id:', err);
    res.status(500).json({ message: 'Gagal hapus news', error: err.message });
  }
});

// CRUD Articles
app.get('/api/articles', async (req, res) => {
  console.log('GET /api/articles');
  const articles = await Article.find();
  res.json(articles);
});
app.post('/api/articles', async (req, res) => {
  console.log('POST /api/articles', req.body);
  try {
    const article = new Article(req.body);
    await article.save();
    res.json(article);
  } catch (err) {
    console.error('Error POST /api/articles:', err);
    res.status(500).json({ message: 'Gagal simpan article', error: err.message });
  }
});
app.delete('/api/articles/:id', async (req, res) => {
  try {
    const deleted = await Article.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Article tidak ditemukan' });
    res.json({ message: 'Article berhasil dihapus', deleted });
  } catch (err) {
    console.error('Error DELETE /api/articles/:id:', err);
    res.status(500).json({ message: 'Gagal hapus article', error: err.message });
  }
});

// Stats
app.get('/api/members/stats', async (req, res) => {
  console.log('GET /api/members/stats');
  const total = await Member.countDocuments();
  const tiktok = await Member.aggregate([{ $group: { _id: null, total: { $sum: "$tiktokFollowers" } } }]);
  const instagram = await Member.aggregate([{ $group: { _id: null, total: { $sum: "$instagramFollowers" } } }]);
  res.json({
    activeCreators: total,
    totalFollowers: (tiktok[0]?.total || 0) + (instagram[0]?.total || 0),
    certificatesIssued: 0,
    brandPartnerships: 0
  });
});

// Profile update
app.put('/api/users/profile/:userId', async (req, res) => {
  console.log('PUT /api/users/profile/:userId', req.params, req.body);
  const user = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
  res.json({ user });
});

// Endpoint cek users (public)
app.get('/api/users', async (req, res) => {
  console.log('GET /api/users (public)');
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error('Error GET /api/users:', err);
    res.status(500).json({ message: 'Gagal mengambil data users', error: err.message });
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
    const user = new User({ email, name, department, password });
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