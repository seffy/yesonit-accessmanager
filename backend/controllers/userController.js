const User = require('../models/User');
const bcrypt = require('bcrypt');
const Department = require('../models/Department');

exports.showAddUserPage = async (req, res) => {
  try {
    const departments = await Department.find().sort({ name: 1 }); // load department names
    res.render('addUser', {
      user: req.session.user,
      error: null,
      success: null,
      departments // ✅ this is important
    });
  } catch (err) {
    console.error('Error loading Add User page:', err);
    res.render('addUser', {
      user: req.session.user,
      error: 'Failed to load departments.',
      success: null,
      departments: [] // fallback to empty
    });
  }
};

// Show Add User Page
// exports.showAddUserPage = (req, res) => {
//  if (!req.session.user) {
//    return res.redirect('/login');
//  }
//  res.render('addUser', { error: null, success: null });
// };

// Handle Add User Form Submission
exports.addUser = async (req, res) => {
  const { name, email, password, accessLevel, department } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const departments = await Department.find().sort({ name: 1 });
      return res.render('addUser', {
        user: req.session.user,
        error: 'User already exists.',
        success: null,
        departments
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      accessLevel,
      department
    });

    await newUser.save();
    const departments = await Department.find().sort({ name: 1 });
    res.render('addUser', {
      user: req.session.user,
      error: null,
      success: 'User added successfully!',
      departments
    });

  } catch (error) {
    console.error('Add User Error:', error);
    const departments = await Department.find().sort({ name: 1 });
    res.render('addUser', {
      user: req.session.user,
      error: 'Server error. Please try again.',
      success: null,
      departments
    });
  }
};
// Show update user form
// exports.showUpdateUserForm = async (req, res) => {
//  try {
//    const user = await User.findById(req.params.id);
//    res.render('updateUser', { user, error: null, success: null });
//  } catch (err) {
//    console.error('Load update form error:', err);
//    res.status(500).send('Error loading update form');
//  }
// };

exports.showUpdateUserForm = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    const departments = await Department.find(); // Fetch departments

    if (!user) {
      return res.status(404).send('User not found');
    }

    res.render('updateUser', { user, departments }); // Pass departments
  } catch (error) {
    console.error('Error loading user for update:', error);
    res.status(500).send('Server Error');
  }
};
// Handle update
exports.updateUser = async (req, res) => {
  const { name, email, department, accessLevel } = req.body;

  try {
    await User.findByIdAndUpdate(req.params.id, {
      name,
      email,
      department,
      accessLevel
    });

    res.redirect('/users/manage'); // or show success message if needed
  } catch (err) {
    console.error('Update user error:', err);
    res.status(500).send('Error updating user');
  }
};