const mongoose = require('mongoose');
const { mainConnection } = require('../config/database');

const NewsSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true
  },
  excerpt: { 
    type: String,
    trim: true
  },
  image: { 
    type: String 
  },
  author: { 
    type: String, 
    required: true,
    trim: true
  },
  isAdmin: { 
    type: Boolean, 
    default: false 
  },
  date: { 
    type: Date, 
    default: Date.now 
  },
  views: { 
    type: Number, 
    default: 0,
    min: 0
  },
  likes: { 
    type: Number, 
    default: 0,
    min: 0
  },
  comments: { 
    type: Number, 
    default: 0,
    min: 0
  },
  category: { 
    type: String,
    trim: true,
    default: 'general'
  },
  content: {
    type: String
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'published'
  },
  tags: [{
    type: String,
    trim: true
  }],
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Update the updatedAt field before saving
NewsSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mainConnection.model('News', NewsSchema); 