const { MongoClient } = require('mongodb');
require("dotenv").config();

const mongoURL = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB_NAME;

const getDbUtils = async (req, res) => {    
    const client = new MongoClient(mongoURL);

    try {
      await client.connect();
      const db = client.db(dbName);
  
      // Fetch database stats
      const stats = await db.command({ dbStats: 1 });
      const { dataSize, indexSize } = stats;
      const totalStorageUsed = dataSize + indexSize
  
      res.status(200).json({
        message: 'MongoDB storage details fetched successfully.',
        stats: {
          totalDataSize: `${(dataSize / 1024 / 1024).toFixed(2)} MB`,
          totalIndexSize: `${(indexSize / 1024 / 1024).toFixed(2)} MB`,
          totalStorageUsed: `${(totalStorageUsed / 1024 / 1024).toFixed(2)} MB`,
        },
      });
    } catch (error) {
      console.error('Error fetching MongoDB storage stats:', error.message);
      res.status(500).json({ error: 'Unable to fetch storage stats' });
    } finally {
      await client.close();
    }
};

module.exports = {getDbUtils};
