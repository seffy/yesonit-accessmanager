const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

// Show test login page
router.get('/login-test', (req, res) => {
  res.render('loginTest', { error: null });
});

// Handle test login form
router.post('/login-test', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.render('loginTest', { error: 'Email not found' });
    }

    const match = await bcrypt.compare(password.trim(), user.password);
    console.log('Password entered:', password);
    console.log('Stored hash:', user.password);
    console.log('Match result:', match);

    if (!match) {
      return res.render('loginTest', { error: 'Password does not match' });
    }

    return res.send(`<h2>✅ Login Success!</h2><p>Welcome, ${user.name}</p>`);
  } catch (error) {
    console.error('Test login error:', error);
    return res.render('loginTest', { error: 'Server error' });
  }
});

module.exports = router;