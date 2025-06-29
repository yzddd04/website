const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Member = require('../models/Member');
const router = express.Router();

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { email, name, department, password } = req.body;
    
    if (!email || !name || !department || !password) {
      return res.status(400).json({ message: 'Semua field wajib diisi.' });
    }
    
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email sudah terdaftar.' });
    }
    
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ email, name, department, password: hashed });
    await user.save();
    
    // Secara otomatis buat profil Member yang terhubung
    const newMember = new Member({
      _id: user._id, // Gunakan ID yang sama untuk relasi 1-to-1
      name: user.name,
      email: user.email,
      department: user.department,
      username: (user.email.split('@')[0] || `user_${user._id}`).replace(/[^a-zA-Z0-9]/g, ''), // Buat username default dari email
    });
    await newMember.save();

    res.status(201).json({ message: 'Registrasi berhasil.' });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email dan password wajib diisi.' });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Email atau password salah.' });
    }
    
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: 'Email atau password salah.' });
    }
    
    // Ambil data Member untuk merge semua field penting
    let member = await Member.findOne({ email: user.email });
    let isAdmin = user.isAdmin;
    let socialLinks = {};
    let profileImage = '';
    let bio = '';
    let tiktokFollowers = 0;
    let instagramFollowers = 0;
    let badge = 'pemula';
    let username = '';
    
    if (member) {
      isAdmin = typeof member.isAdmin === 'boolean' ? member.isAdmin : user.isAdmin;
      socialLinks = member.socialLinks || {};
      profileImage = member.profileImage || '';
      bio = member.bio || '';
      tiktokFollowers = member.tiktokFollowers || 0;
      instagramFollowers = member.instagramFollowers || 0;
      badge = member.badge || 'pemula';
      username = member.username || '';
    }
    
    res.json({ 
      message: 'Login berhasil.', 
      user: { 
        id: user._id,
        email: user.email, 
        name: user.name, 
        department: user.department,
        isAdmin: isAdmin,
        socialLinks: socialLinks,
        profileImage: profileImage,
        bio: bio,
        tiktokFollowers: tiktokFollowers,
        instagramFollowers: instagramFollowers,
        badge: badge,
        username: username
      } 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
});

module.exports = router; 