const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const User = require('../models/User');

// Show Add User Form
router.get('/add-user', userController.showAddUserPage);

// Handle Add User Form Submission
router.post('/create-user', userController.addUser);

// Show update form
router.get('/users/update/:id', userController.showUpdateUserForm);

// Handle form submission
router.post('/users/update/:id', userController.updateUser);

router.get('/users/manage', async (req, res) => {
  try {
    const users = await User.find().sort({ name: 1 });
    res.render('ViewAllUsers', { users });
  } catch (error) {
    console.error("Error loading users:", error);
    res.status(500).send("Server error");
  }
});

router.post('/users/delete/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.redirect('/users/manage');
  } catch (err) {
    console.error("Delete User Error:", err);
    res.status(500).send("Unable to delete user.");
  }
});

module.exports = router;