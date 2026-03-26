const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');

const seedAdmin = async () => {
  try {
    // Connect to MongoDB (no options needed for Mongoose 7+)
    await mongoose.connect(process.env.MONGO_URL, {
      dbName: process.env.DB_NAME, // ensures correct DB
    });

    console.log('✅ Connected to DB:', mongoose.connection.name);

    // Check if admin exists
    const existing = await User.findOne({ email: 'admin@admin.com' });
    if (existing) {
      console.log('⚠️ Admin already exists:', existing);
      await mongoose.connection.close();
      return;
    }

    const admin = await User.create({
      name: 'Admin',
      email: 'admin@admin.com',
      password: 'admin123', // plain text, hook handles hashing
      role: 'admin',
    });

    console.log('✅ Admin created successfully:', admin);

    // Close connection
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed');
  } catch (err) {
    console.error('❌ Error seeding admin:', err);
    process.exit(1);
  }
};

seedAdmin();
