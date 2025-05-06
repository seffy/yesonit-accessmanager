const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

// Middleware to check if user is logged in
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
}

// Show Home page if logged in
router.get('/home', isAuthenticated, homeController.showHomePage);

module.exports = router;