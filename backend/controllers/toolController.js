const Tool = require('../models/Tool');

// Show Add Tool page
exports.showAddToolPage = (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  res.render('addTool', { error: null, success: null });
};

// Handle Add Tool form submission
exports.addTool = async (req, res) => {
  const { toolName, pointOfContact } = req.body;

  try {
    if (!toolName) {
      return res.render('addTool', {
        error: 'Tool Name is required.',
        success: null
      });
    }

    const existingTool = await Tool.findOne({ toolName });
    if (existingTool) {
      return res.render('addTool', {
        error: 'Tool already exists.',
        success: null
      });
    }

    const newTool = new Tool({ toolName, pointOfContact });
    await newTool.save();

    res.render('addTool', {
      error: null,
      success: 'Tool added successfully!'
    });
  } catch (error) {
    console.error('Error adding tool:', error);
    res.render('addTool', {
      error: 'Server error. Please try again.',
      success: null
    });
  }
};