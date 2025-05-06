const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Show Add User Form
router.get('/add-user', userController.showAddUserPage);

// Handle Add User Form Submission
router.post('/create-user', userController.addUser);

module.exports = router;