// Show Home Page
exports.showHomePage = (req, res) => {
  res.render('home', { user: req.session.user });
};