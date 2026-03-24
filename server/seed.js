const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const mongoose = require('mongoose');
const User = require('./models/User');

const seedAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URL);

  const existing = await User.findOne({ email: 'admin@admin.com' });
  if (existing) {
    console.log('Admin already exists');
    process.exit(0);
  }

  await User.create({
    name: 'Admin',
    email: 'admin@admin.com',
    password: 'admin123',
    role: 'admin',
  });

  console.log('Admin created successfully');
  process.exit(0);
};

seedAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
