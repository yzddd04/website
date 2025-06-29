const mongoose = require('mongoose');
const { mainConnection } = require('../config/database');

const MemberSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  email: { 
    type: String, 
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  username: { 
    type: String, 
    trim: true,
    default: ''
  },
  department: { 
    type: String, 
    required: true,
    trim: true
  },
  tiktokFollowers: { 
    type: Number, 
    default: 0,
    min: 0
  },
  instagramFollowers: { 
    type: Number, 
    default: 0,
    min: 0
  },
  badge: { 
    type: String,
    enum: ['bronze', 'silver', 'gold', 'platinum', 'diamond'],
    default: 'bronze'
  },
  isAdmin: { 
    type: Boolean, 
    default: false 
  },
  profileImage: { 
    type: String 
  },
  bio: {
    type: String,
    maxlength: 500
  },
  socialLinks: {
    tiktok: String,
    instagram: String,
    youtube: String,
    twitter: String
  },
  achievements: [{
    title: String,
    description: String,
    date: { type: Date, default: Date.now }
  }],
  joinDate: { 
    type: Date, 
    default: Date.now 
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  }
});

// Update lastActive when member data is updated
MemberSchema.pre('save', function(next) {
  this.lastActive = Date.now();
  next();
});

// Virtual for total followers
MemberSchema.virtual('totalFollowers').get(function() {
  return (this.tiktokFollowers || 0) + (this.instagramFollowers || 0);
});

// Ensure virtual fields are serialized
MemberSchema.set('toJSON', { virtuals: true });
MemberSchema.set('toObject', { virtuals: true });

module.exports = mainConnection.model('Member', MemberSchema); 