const mongoose = require('mongoose');

const connectDatabase = async () => {
  try {
    // If no MongoDB URI is provided, run in demo mode without database
    if (!process.env.MONGODB_URI) {
      console.log('⚠️  Running in demo mode without database connection');
      console.log('💡 Set MONGODB_URI environment variable to connect to a database');
      return;
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('⚠️  Database connection error:', error.message);
    console.log('📝 API will run with limited functionality (no database operations)');
    // Don't exit, just log the error and continue
  }
};

module.exports = connectDatabase; 