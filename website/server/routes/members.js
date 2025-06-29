const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const TiktokStat = require('../models/stats/TiktokStat');
const InstagramStat = require('../models/stats/InstagramStat');

// GET all members
router.get('/', async (req, res) => {
  try {
    const members = await Member.find().sort({ joinDate: -1 });
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST a new member
router.post('/', async (req, res) => {
  try {
    const member = new Member(req.body);
    const savedMember = await member.save();
    res.status(201).json(savedMember);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET stats
router.get('/stats', async (req, res) => {
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
    
    const certificatesIssued = activeCreators; 
    const brandPartnerships = 12; // Hardcoded

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

// GET latest stats for a specific member from the bot database
router.get('/:username/stats', async (req, res) => {
    const { username } = req.params;
    if (!username) {
        return res.status(400).json({ message: "Username is required" });
    }

    try {
        const tiktokPromise = TiktokStat.findOne({ username }).sort({ timestamp: -1 });
        const instagramPromise = InstagramStat.findOne({ username }).sort({ timestamp: -1 });

        const [latestTiktok, latestInstagram] = await Promise.all([tiktokPromise, instagramPromise]);

        res.json({
            tiktok: latestTiktok,
            instagram: latestInstagram
        });
    } catch (error) {
        console.error(`Error fetching stats for ${username}:`, error);
        res.status(500).json({ message: 'Server Error while fetching user stats' });
    }
});

// GET all historical stats for a specific member from the bot database
router.get('/:username/stats/history', async (req, res) => {
    const { username } = req.params;
    if (!username) {
        return res.status(400).json({ message: "Username is required" });
    }
    try {
        const tiktokStats = await TiktokStat.find({ username }).sort({ timestamp: 1 });
        const instagramStats = await InstagramStat.find({ username }).sort({ timestamp: 1 });
        res.json({ tiktok: tiktokStats, instagram: instagramStats });
    } catch (error) {
        console.error(`Error fetching historical stats for ${username}:`, error);
        res.status(500).json({ message: 'Server Error while fetching user historical stats' });
    }
});

// GET member by username
router.get('/:username', async (req, res) => {
  const { username } = req.params;
  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }
  try {
    // Cari berdasarkan username, socialLinks.instagram, atau socialLinks.tiktok
    const member = await Member.findOne({
      $or: [
        { username: username },
        { 'socialLinks.instagram': username },
        { 'socialLinks.tiktok': username }
      ]
    });
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router; 