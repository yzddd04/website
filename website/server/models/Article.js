const mongoose = require('mongoose');
const { mainConnection } = require('../config/database');

const ArticleSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true
  },
  excerpt: { 
    type: String,
    trim: true
  },
  content: { 
    type: String, 
    required: true
  },
  category: { 
    type: String,
    trim: true
  },
  featuredImage: { 
    type: String
  },
  author: { 
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
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
ArticleSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Generate slug from title if not provided
ArticleSchema.pre('save', function(next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
  next();
});

module.exports = mainConnection.model('Article', ArticleSchema); 