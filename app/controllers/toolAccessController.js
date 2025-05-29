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
 const submittedBy = req.session.user.email;   
const requesterName = req.session.user.name;
const newRequest = new ToolAccessRequest({
  requestType,
  requesterName,
  toolName,
  employeeId,
  employeeEmail,
  approverEmail,
  justification,
  submittedBy: req.session.user.email, // ✅ Critical for filtering
  submittedAt: new Date()
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
  
  
  exports.editToolRequestPage = async (req, res) => {
  const requestId = req.params.id;

  try {
    const request = await ToolAccessRequest.findById(requestId);
    const tools = await Tool.find().sort({ name: 1 });

    if (!request) {
      return res.status(404).send('Request not found');
    }

    res.render('editToolRequest', { request, tools, user: req.session.user });

  } catch (error) {
    console.error('Error loading edit page:', error);
    res.status(500).send('Server error');
  }
};