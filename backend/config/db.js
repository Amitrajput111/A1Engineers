const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Disable command buffering so operations fail fast if DB is offline
    mongoose.set('bufferCommands', false);

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.log('Application will continue to run, but database features will fail until MongoDB is active.');
  }
};

module.exports = connectDB;
