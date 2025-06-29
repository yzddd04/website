const mongoose = require('mongoose');
const { statsConnection } = require('../../config/database');

const InstagramStatSchema = new mongoose.Schema({
    timestamp: { type: Date, required: true },
    username: { type: String, required: true },
    followers: { type: Number, required: true }
}, {
    collection: 'instagram_stats', // Tentukan nama collection secara eksplisit
    versionKey: false // Tidak perlu __v field
});

// Indeks untuk mempercepat query pencarian data terbaru
InstagramStatSchema.index({ username: 1, timestamp: -1 });

// Gunakan koneksi 'statsConnection' untuk membuat model
const InstagramStat = statsConnection.model('InstagramStat', InstagramStatSchema);

module.exports = InstagramStat; 