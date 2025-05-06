const express = require('express');
const router = express.Router();
const toolController = require('../controllers/toolController');

// Show Add Tool Form
router.get('/add-tool', toolController.showAddToolPage);

// Handle Add Tool Form Submission
router.post('/create-tool', toolController.addTool);

module.exports = router;