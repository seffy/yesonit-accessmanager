const Department = require('../models/Department');

// View page with form + list
exports.viewDepartments = async (req, res) => {
  const departments = await Department.find().sort({ name: 1 });
  res.render('viewDepartments', { departments, error: null, success: null });
};

// Add department
exports.addDepartment = async (req, res) => {
  const { name } = req.body;
  try {
    if (!name) throw new Error('Department name is required');
    const existing = await Department.findOne({ name });
    if (existing) throw new Error('Department already exists');
    await new Department({ name }).save();

    const departments = await Department.find();
    res.render('viewDepartments', { departments, error: null, success: 'Department added successfully' });
  } catch (err) {
    const departments = await Department.find();
    res.render('viewDepartments', { departments, error: err.message, success: null });
  }
};

// Delete department
exports.deleteDepartment = async (req, res) => {
  await Department.findByIdAndDelete(req.params.id);
  res.redirect('/departments');
};