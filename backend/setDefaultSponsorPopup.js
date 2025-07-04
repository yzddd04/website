const { MongoClient } = require('mongodb');

async function setDefaultSponsorPopup() {
  const uri = 'mongodb://localhost:27017';
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('creator_web');
    const value = {
      enabled: true,
      contentType: 'text',
      textContent: 'Ayo dukung mahasiswa creator dengan memberikan sponsor, untuk lebih lanjut...',
      imageUrl: ''
    };
    await db.collection('settings').updateOne(
      { key: 'sponsor_popup' },
      { $set: { value } },
      { upsert: true }
    );
    console.log('Default sponsor popup setting applied:', value);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.close();
  }
}

setDefaultSponsorPopup(); 