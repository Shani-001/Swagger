const express = require('express');
const router = express.Router();
const employeeStore = require('../data/employeeStore');

/**
 * GET /employees
 * Retrieve all employees, with optional department filter.
 * Example: GET /employees?department=Engineering
 */
router.get('/', (req, res) => {
  const { department } = req.query;
  const employees = employeeStore.getAllEmployees(department);
  res.status(200).json(employees);
});

/**
 * GET /employees/:id
 * Retrieve a single employee by numeric ID.
 * Returns 404 if not found.
 */
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const numericId = parseInt(id, 10);

  if (isNaN(numericId)) {
    return res.status(404).json({ error: `Employee with ID ${id} not found` });
  }

  const employee = employeeStore.getEmployeeById(numericId);
  if (!employee) {
    return res.status(404).json({ error: `Employee with ID ${id} not found` });
  }

  res.status(200).json(employee);
});

/**
 * POST /employees
 * Create a new employee with auto-generated ID and default 'Active' status.
 * Validates that name and department are present and non-empty.
 */
router.post('/', (req, res) => {
  const { name, department } = req.body || {};

  if (
    !name ||
    typeof name !== 'string' ||
    name.trim() === '' ||
    !department ||
    typeof department !== 'string' ||
    department.trim() === ''
  ) {
    return res.status(422).json({
      error: "Validation error: 'name' and 'department' are required and cannot be empty."
    });
  }

  const newEmployee = employeeStore.addEmployee({ name, department });
  res.status(201).json(newEmployee);
});

/**
 * PATCH /employees/:id/status
 * Update an employee's status to 'Active' or 'Inactive'.
 * Returns 404 if employee does not exist.
 * Returns 422 if status value is invalid.
 */
router.patch('/:id/status', (req, res) => {
  const { id } = req.params;
  const numericId = parseInt(id, 10);
  const { status } = req.body || {};

  const allowedStatuses = ['Active', 'Inactive'];
  if (!status || !allowedStatuses.includes(status)) {
    return res.status(422).json({
      error: "Validation error: 'status' must be either 'Active' or 'Inactive'."
    });
  }

  if (isNaN(numericId)) {
    return res.status(404).json({ error: `Employee with ID ${id} not found` });
  }

  const updatedEmployee = employeeStore.updateEmployeeStatus(numericId, status);
  if (!updatedEmployee) {
    return res.status(404).json({ error: `Employee with ID ${id} not found` });
  }

  res.status(200).json(updatedEmployee);
});

module.exports = router;
