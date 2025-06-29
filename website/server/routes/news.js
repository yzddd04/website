const express = require('express');
const router = express.Router();
const News = require('../models/News');

// GET all news
router.get('/', async (req, res) => {
  try {
    const news = await News.find().sort({ date: -1 });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST a new news item
router.post('/', async (req, res) => {
  try {
    const newsItem = new News(req.body);
    const savedNewsItem = await newsItem.save();
    res.status(201).json(savedNewsItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 