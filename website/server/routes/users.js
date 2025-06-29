const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Member = require('../models/Member'); // Asumsikan data profil disimpan di model Member

// Middleware untuk otentikasi (contoh sederhana)
// Di aplikasi nyata, gunakan JWT atau session
const isAuthenticated = (req, res, next) => {
  // Untuk sekarang, kita asumsikan user terautentikasi jika ada user ID di body atau params
  // Ini SANGAT TIDAK AMAN untuk produksi
  if (req.body.userId || req.params.id) {
    return next();
  }
  res.status(401).json({ message: 'Authentication required' });
};

// GET all Users (Members)
router.get('/', async (req, res) => {
    try {
        const members = await Member.find().select('-password'); // Jangan kirim password
        res.json(members);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET User Profile (atau Member Profile)
router.get('/:id', isAuthenticated, async (req, res) => {
    try {
        const member = await Member.findById(req.params.id);
        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }
        res.json(member);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


// UPDATE User Profile (atau Member Profile)
router.put('/profile/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, department, tiktokUsername, instagramUsername, tiktokFollowers, instagramFollowers, profileImage, bio, socialLinks } = req.body;

    // Siapkan data yang akan diupdate
    const updateFields = {
      name,
      department,
      tiktokFollowers,
      instagramFollowers,
      profileImage,
      bio,
    };

    // Update socialLinks jika dikirim sebagai object
    if (socialLinks && typeof socialLinks === 'object') {
      if (socialLinks.tiktok !== undefined) updateFields['socialLinks.tiktok'] = socialLinks.tiktok;
      if (socialLinks.instagram !== undefined) updateFields['socialLinks.instagram'] = socialLinks.instagram;
    } else {
      // Fallback: update dari tiktokUsername/instagramUsername jika ada
      if (tiktokUsername !== undefined) updateFields['socialLinks.tiktok'] = tiktokUsername;
      if (instagramUsername !== undefined) updateFields['socialLinks.instagram'] = instagramUsername;
    }

    // Hapus field yang tidak didefinisikan agar tidak menimpa data yang ada dengan null/undefined
    Object.keys(updateFields).forEach(key => (updateFields[key] === undefined) && delete updateFields[key]);

    const updatedMember = await Member.findByIdAndUpdate(
      id, 
      { $set: updateFields },
      { new: true, runValidators: true, context: 'query' }
    );

    if (!updatedMember) {
      return res.status(404).json({ message: 'Member not found' });
    }

    // Ambil juga data User untuk merge field penting (konsisten dengan login)
    const userDoc = await User.findById(id);
    const mergedUser = {
      id: updatedMember._id,
      email: updatedMember.email || (userDoc ? userDoc.email : ''),
      name: updatedMember.name,
      department: updatedMember.department,
      isAdmin: updatedMember.isAdmin || (userDoc ? userDoc.isAdmin : false),
      socialLinks: updatedMember.socialLinks || {},
      profileImage: updatedMember.profileImage || '',
      bio: updatedMember.bio || '',
      tiktokFollowers: updatedMember.tiktokFollowers || 0,
      instagramFollowers: updatedMember.instagramFollowers || 0,
      badge: updatedMember.badge || 'pemula',
      username: updatedMember.username || '',
    };

    res.json({ message: 'Profile updated successfully!', user: mergedUser });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
});

module.exports = router; 