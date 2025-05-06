const User = require('../models/User');

// Show Add User Page
exports.showAddUserPage = (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  res.render('addUser', { error: null, success: null });
};

// Handle Add User Form Submission
exports.addUser = async (req, res) => {
  const { name, email, password, department, accessLevel } = req.body;

  try {
    if (!name || !email || !password || !accessLevel) {
      return res.render('addUser', {
        error: 'Please fill in all required fields.',
        success: null
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render('addUser', {
        error: 'Email already registered.',
        success: null
      });
    }

    const newUser = new User({ name, email, password, department, accessLevel });
    await newUser.save();

    res.render('addUser', {
      error: null,
      success: 'User added successfully!'
    });
  } catch (error) {
    console.error('Error adding user:', error);
    res.render('addUser', {
      error: 'Server error. Please try again.',
      success: null
    });
  }
};