const express = require('express');
const router = express.Router();
const toolAccessController = require('../controllers/toolAccessController');
const ToolAccessRequest = require('../models/ToolAccessRequest');

const Tool = require('../models/Tool'); // to populate dropdown if needed

// Show only logged-in user's submitted requests
// View only current user's requests

router.get('/myrequests', async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect('/login');
    }

    const userEmail = req.session.user.email;

    const requests = await ToolAccessRequest.find({ submittedBy: userEmail });

    res.render('viewMyRequests', { requests });
  } catch (error) {
    console.error(error);
    res.status(500).send("Unable to load your submitted requests.");
  }
});

// Show tool access request form
router.get('/request', toolAccessController.showToolAccessForm);
// View submitted requests
router.get('/requests', toolAccessController.viewRequests);

// Handle tool access request form submission
router.post('/submitToolRequest', toolAccessController.submitToolAccessRequest);

router.post('/requests/delete/:id', async (req, res) => {
  try {
    await ToolAccessRequest.findByIdAndDelete(req.params.id);
    res.redirect('/home');
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).send("Failed to delete the request.");
  }
});



// Show the update form
router.get('/requests/update/:id', async (req, res) => {
  try {
    const request = await ToolAccessRequest.findById(req.params.id);
    const tools = await Tool.find();

    if (!request) return res.status(404).send("Request not found");

    res.render('updateRequest', { request, tools, user: req.session.user, error: null });
  } catch (err) {
    console.error("Update form error:", err);
    res.status(500).send("Server error.");
  }
});

// Handle request update
router.post('/requests/update/:id', async (req, res) => {
  try {
    const { toolName, justification, approverEmail } = req.body;

    await ToolAccessRequest.findByIdAndUpdate(req.params.id, {
      toolName,
      justification,
      approverEmail
    });

    res.redirect('/home');
  } catch (err) {
    console.error("Update submit error:", err);
    res.status(500).send("Failed to update request.");
  }
});

module.exports = router;