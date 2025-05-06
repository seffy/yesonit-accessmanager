const ToolAccessRequest = require('../models/ToolAccessRequest');
const Tool = require('../models/Tool'); // Will be used for dropdown

// Show the Tool Access Request Form
exports.showToolAccessForm = async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  try {
    const tools = await Tool.find();
    res.render('requestTool', { user: req.session.user, tools, error: null, success: null });
  } catch (error) {
    console.error('Error loading form:', error);
    res.status(500).send('Server Error');
  }
};

// Handle Tool Access Form Submission
exports.submitToolAccessRequest = async (req, res) => {
  const { requestType, toolName, employeeId, employeeEmail, approverEmail, justification } = req.body;

  try {
    if (!toolName || !approverEmail || !justification) {
      const tools = await Tool.find();
      return res.render('requestTool', {
        user: req.session.user,
        tools,
        error: 'Please fill in all required fields.',
        success: null
      });
    }

    const newRequest = new ToolAccessRequest({
      requestType,
      requesterName: req.session.user.name,
      toolName,
      employeeId: requestType === 'someone_else' ? employeeId : undefined,
      employeeEmail: requestType === 'someone_else' ? employeeEmail : undefined,
      approverEmail,
      justification
    });

    await newRequest.save();

    const tools = await Tool.find();
    res.render('requestTool', {
      user: req.session.user,
      tools,
      error: null,
      success: 'Tool Access Request Submitted Successfully!'
    });

  } catch (error) {
    console.error('Submit Request Error:', error);
    const tools = await Tool.find();
    res.render('requestTool', {
      user: req.session.user,
      tools,
      error: 'Server error. Please try again.',
      success: null
    });
  }
};

// View all submitted tool access requests
exports.viewRequests = async (req, res) => {
    if (!req.session.user) {
      return res.redirect('/login');
    }
  
    try {
      const requests = await ToolAccessRequest.find().sort({ submittedAt: -1 });
      res.render('viewRequests', { requests });
    } catch (error) {
      console.error('Error loading requests:', error);
      res.status(500).send('Server Error');
    }
  };
  
  