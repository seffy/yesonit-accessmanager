const ToolAccessRequest = require('../models/ToolAccessRequest');

// Show Home Page
exports.showHomePage = (req, res) => {
  res.render('home', { user: req.session.user });
};




exports.showHomePage = async (req, res) => {
  try {
    const userEmail = req.session.user.email;
    const requests = await ToolAccessRequest.find({ submittedBy: userEmail });
    res.render('home', { user: req.session.user, requests });
  } catch (error) {
    console.error(error);
    res.status(500).send("Unable to load home page.");
  }
};