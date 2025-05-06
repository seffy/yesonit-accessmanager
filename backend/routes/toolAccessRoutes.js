const express = require('express');
const router = express.Router();
const toolAccessController = require('../controllers/toolAccessController');

// Show tool access request form
router.get('/request', toolAccessController.showToolAccessForm);
// View submitted requests
router.get('/requests', toolAccessController.viewRequests);

// Handle tool access request form submission
router.post('/submitToolRequest', toolAccessController.submitToolAccessRequest);

module.exports = router;