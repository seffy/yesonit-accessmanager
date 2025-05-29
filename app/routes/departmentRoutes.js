const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');

router.get('/departments', departmentController.viewDepartments);
router.post('/departments/add', departmentController.addDepartment);
router.post('/departments/delete/:id', departmentController.deleteDepartment);

module.exports = router;