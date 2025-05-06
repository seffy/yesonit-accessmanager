require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function createTestUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const newUser = new User({
      name: 'TaskPilot Admin',
      email: 'admin@taskpilot.com',
      password: 'Password123',
      department: 'IT',
      accessLevel: 'Level 1'
    });

    await newUser.save();
    console.log('✅ Test user created successfully!');
    process.exit();
  } catch (error) {
    console.error('❌ Error creating test user:', error);
    process.exit(1);
  }
}

createTestUser();