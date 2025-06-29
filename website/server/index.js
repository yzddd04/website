require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const morgan = require('morgan');
const { connectDefaultDb } = require('./config/database');

// Import models - These are pre-loaded by Mongoose, no longer need to be in scope everywhere
// const User = require('./models/User');
const Article = require('./models/Article');
const Member = require('./models/Member');
const News = require('./models/News');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const articleRoutes = require('./routes/articles');
const newsRoutes = require('./routes/news');
const memberRoutes = require('./routes/members');

const app = express();
let PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/botwebsite';

// Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Add a root endpoint for browser access
app.get('/', (req, res) => {
  res.send('Bot Website API is running.');
});

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(express.json());

// Gunakan routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/members', memberRoutes);

// Contoh schema dan model
const DataSchema = new mongoose.Schema({
  name: String,
  value: String,
});
const Data = mongoose.model('Data', DataSchema);

// Endpoint test
app.get('/api/data', async (req, res) => {
  const data = await Data.find();
  res.json(data);
});

// Endpoint untuk menambah data
app.post('/api/data', async (req, res) => {
  const { name, value } = req.body;
  const newData = new Data({ name, value });
  await newData.save();
  res.status(201).json(newData);
});

// Article endpoints
app.get('/api/articles', async (req, res) => {
  const articles = await Article.find();
  res.json(articles);
});
app.post('/api/articles', async (req, res) => {
  const article = new Article(req.body);
  await article.save();
  res.status(201).json(article);
});

// News endpoints
app.get('/api/news', async (req, res) => {
  const news = await News.find();
  res.json(news);
});
app.post('/api/news', async (req, res) => {
  const newsItem = new News(req.body);
  await newsItem.save();
  res.status(201).json(newsItem);
});

// Member endpoints
app.get('/api/members', async (req, res) => {
  const members = await Member.find();
  res.json(members);
});
app.post('/api/members', async (req, res) => {
  const member = new Member(req.body);
  await member.save();
  res.status(201).json(member);
});

// Stats endpoint
app.get('/api/stats', async (req, res) => {
  try {
    const activeCreators = await Member.countDocuments();
    
    const followerStats = await Member.aggregate([
      {
        $group: {
          _id: null,
          totalTiktokFollowers: { $sum: "$tiktokFollowers" },
          totalInstagramFollowers: { $sum: "$instagramFollowers" },
        }
      }
    ]);

    let totalFollowers = 0;
    if (followerStats.length > 0) {
      totalFollowers = (followerStats[0].totalTiktokFollowers || 0) + (followerStats[0].totalInstagramFollowers || 0);
    }
    
    // Assuming Certificates Issued is the number of members
    const certificatesIssued = activeCreators; 
    
    // Hardcoded for now, as there's no data point for this
    const brandPartnerships = 12;

    res.json({
      activeCreators,
      totalFollowers,
      certificatesIssued,
      brandPartnerships
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching stats", error: error.message });
  }
});

// Koneksi ke MongoDB dan start server
connectDefaultDb().then(() => {
  const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
  server.on('error', (err) => {
    if (err.code === 'EACCES' || err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} tidak bisa digunakan. Mencoba port 5001...`);
      PORT = 5001;
      app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
      });
    } else {
      console.error('Server error:', err);
    }
  });
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
}); 