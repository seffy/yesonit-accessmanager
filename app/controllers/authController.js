// controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Show login page
exports.showLoginPage = (req, res) => {
  res.render('login', { error: null });
};

// Handle login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.render('login', { error: 'Invalid email or password' });
    }


    if (user.accessLevel === 'Blocked') {
      return res.render('login', { error: 'Your access is blocked. Contact your IT Administrator.' });
    }

   const isMatch = await bcrypt.compare(password.trim(), user.password);
    if (!isMatch) {
      return res.render('login', { error: 'Invalid email or password' });
    }

    // Save user session if not blocked
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      department: user.department,
      accessLevel: user.accessLevel
    };

    res.redirect('/home');
  } catch (error) {
    console.error('Login Error:', error);
    res.render('login', { error: 'Server error. Please try again.' });
  }
};

// Handle logout
exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/login');
};