/**
 * In-memory employee data store for Employee REST API.
 */

const INITIAL_EMPLOYEES = [
  { id: 1, name: 'Rahul Sharma', department: 'Engineering', status: 'Active' },
  { id: 2, name: 'Priya Patel', department: 'HR', status: 'Active' },
  { id: 3, name: 'Amit Verma', department: 'Engineering', status: 'Inactive' }
];

let employees = [];
let nextId = 4;

function resetStore() {
  employees = INITIAL_EMPLOYEES.map(emp => ({ ...emp }));
  nextId = employees.reduce((max, e) => Math.max(max, e.id), 0) + 1;
}

// Initialize on module load
resetStore();

/**
 * Retrieve all employees, with optional department filtering.
 * Department filtering is case-insensitive and trims whitespace.
 *
 * @param {string} [department]
 * @returns {Array} List of employees
 */
function getAllEmployees(department) {
  if (department && typeof department === 'string' && department.trim() !== '') {
    const filterDept = department.trim().toLowerCase();
    return employees.filter(
      emp => emp.department && emp.department.trim().toLowerCase() === filterDept
    );
  }
  return [...employees];
}

/**
 * Retrieve a single employee by numeric ID.
 *
 * @param {number|string} id
 * @returns {object|null} Employee object or null if not found
 */
function getEmployeeById(id) {
  const numericId = Number(id);
  if (isNaN(numericId)) return null;
  const found = employees.find(emp => emp.id === numericId);
  return found ? { ...found } : null;
}

/**
 * Add a new employee.
 * Assigns next unique ID and defaults status to 'Active'.
 *
 * @param {object} param0
 * @param {string} param0.name
 * @param {string} param0.department
 * @returns {object} Newly created employee
 */
function addEmployee({ name, department }) {
  const newEmployee = {
    id: nextId++,
    name: name.trim(),
    department: department.trim(),
    status: 'Active'
  };
  employees.push(newEmployee);
  return { ...newEmployee };
}

/**
 * Update the status of an existing employee.
 * Allowed status values: 'Active', 'Inactive'.
 *
 * @param {number|string} id
 * @param {string} status
 * @returns {object|null} Updated employee or null if not found
 */
function updateEmployeeStatus(id, status) {
  const numericId = Number(id);
  const employeeIndex = employees.findIndex(emp => emp.id === numericId);
  if (employeeIndex === -1) {
    return null;
  }
  employees[employeeIndex].status = status;
  return { ...employees[employeeIndex] };
}

module.exports = {
  resetStore,
  getAllEmployees,
  getEmployeeById,
  addEmployee,
  updateEmployeeStatus
};
