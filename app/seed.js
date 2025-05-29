require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const User = require('./models/User'); // Adjust path if needed

// Connect to MongoDB
async function seed() {
  try {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      throw new Error('❌ MONGO_URI is missing in .env file');
    }

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('✅ Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({ email: 'admin@admin.com' });

    // Create admin user with plain password (schema hook will hash it)
    const newUser = new User({
      name: 'Admin',
      email: 'admin@admin.com',
      password: 'admin@123',
      accessLevel: 'Level 5',
      department: 'Admin'
    });

    await newUser.save();
    console.log('✅ Admin user created: admin@admin.com / admin@123');

    process.exit();
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seed();

