const mongoose = require('mongoose');

// Fungsi untuk membuat koneksi baru
const createConnection = (uri, dbName) => {
  try {
    const conn = mongoose.createConnection(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    conn.on('connected', () => console.log(`MongoDB (${dbName}) connected.`));
    conn.on('error', (err) => console.error(`MongoDB (${dbName}) connection error:`, err));
    conn.on('disconnected', () => console.log(`MongoDB (${dbName}) disconnected.`));

    return conn;
  } catch (error) {
    console.error(`Error creating connection to ${dbName}:`, error);
    process.exit(1);
  }
};

// Definisikan URI
const mainDbUri = process.env.MONGO_URI || 'mongodb://localhost:27017/botwebsite';
const statsDbUri = 'mongodb://localhost:27017/bot_stats';

// Buat dan ekspor koneksi
const mainConnection = createConnection(mainDbUri, 'botwebsite');
const statsConnection = createConnection(statsDbUri, 'bot_stats');

// Fungsi untuk menghubungkan Mongoose default (opsional, untuk kompatibilitas)
const connectDefaultDb = async () => {
    try {
        await mongoose.connect(mainDbUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Default Mongoose connection established to botwebsite.");
    } catch (error) {
        console.error('Error connecting default Mongoose instance:', error);
        process.exit(1);
    }
}

module.exports = {
  mainConnection,
  statsConnection,
  connectDefaultDb // Ekspor ini untuk dipanggil di index.js
}; 