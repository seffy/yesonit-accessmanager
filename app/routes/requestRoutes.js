const express = require('express');
const router = express.Router();
const ToolAccessRequest = require('../models/ToolAccessRequest');

// GET: Show update form



router.get('/requests/update/:id', async (req, res) => {
  try {
    const request = await ToolAccessRequest.findById(req.params.id);
    if (!request) return res.status(404).send('Request not found');
    res.render('updateRequest', { request });
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

// POST: Save update
router.post('/requests/update/:id', async (req, res) => {
  try {
    const { title, justification, status } = req.body;
    await ToolAccessRequest.findByIdAndUpdate(req.params.id, {
      title,
      justification,
      status
    });
    res.redirect('/requests');
  } catch (error) {
    res.status(500).send('Update failed');
  }
});
module.exports = router;


