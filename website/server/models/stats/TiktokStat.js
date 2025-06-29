const mongoose = require('mongoose');
const { statsConnection } = require('../../config/database');

const TiktokStatSchema = new mongoose.Schema({
    timestamp: { type: Date, required: true },
    username: { type: String, required: true },
    followers: { type: Number, required: true },
    likes: { type: Number },
    videos: { type: Number },
    following: { type: Number }
}, {
    collection: 'tiktok_stats', // Tentukan nama collection secara eksplisit
    versionKey: false // Tidak perlu __v field
});

// Indeks untuk mempercepat query pencarian data terbaru
TiktokStatSchema.index({ username: 1, timestamp: -1 });

// Gunakan koneksi 'statsConnection' untuk membuat model
const TiktokStat = statsConnection.model('TiktokStat', TiktokStatSchema);

module.exports = TiktokStat; 