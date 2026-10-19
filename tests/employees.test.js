const request = require('supertest');
const app = require('../src/app');
const employeeStore = require('../src/data/employeeStore');

describe('JTRONIX Employee REST API Tests', () => {
  beforeEach(() => {
    // Reset store before each test to ensure test isolation
    employeeStore.resetStore();
  });

  describe('1. Retrieve Employees (Q1.1)', () => {
    test('GET /employees should return all initial employees', async () => {
      const res = await request(app).get('/employees');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(3);

      expect(res.body).toEqual([
        { id: 1, name: 'Rahul Sharma', department: 'Engineering', status: 'Active' },
        { id: 2, name: 'Priya Patel', department: 'HR', status: 'Active' },
        { id: 3, name: 'Amit Verma', department: 'Engineering', status: 'Inactive' }
      ]);
    });

    test('GET /employees/:id should return employee when ID exists', async () => {
      const res = await request(app).get('/employees/1');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        id: 1,
        name: 'Rahul Sharma',
        department: 'Engineering',
        status: 'Active'
      });
    });

    test('GET /employees/:id should return 404 for nonexistent employee ID', async () => {
      const res = await request(app).get('/employees/999');
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toMatch(/not found/i);
    });

    test('GET /employees/:id should return 404 for non-numeric ID', async () => {
      const res = await request(app).get('/employees/invalid-id');
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('2. Add an Employee (Q1.2)', () => {
    test('POST /employees should successfully create a new employee with default Active status and generated ID', async () => {
      const newEmp = {
        name: 'Sneha Rao',
        department: 'Design'
      };

      const res = await request(app)
        .post('/employees')
        .send(newEmp);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.id).toBe(4);
      expect(res.body.name).toBe('Sneha Rao');
      expect(res.body.department).toBe('Design');
      expect(res.body.status).toBe('Active');

      // Verify employee was added to store
      const listRes = await request(app).get('/employees');
      expect(listRes.body.length).toBe(4);
    });

    test('POST /employees should reject empty or missing name', async () => {
      const resMissing = await request(app)
        .post('/employees')
        .send({ department: 'Engineering' });
      expect(resMissing.statusCode).toBe(422);
      expect(resMissing.body).toHaveProperty('error');

      const resEmpty = await request(app)
        .post('/employees')
        .send({ name: '   ', department: 'Engineering' });
      expect(resEmpty.statusCode).toBe(422);
      expect(resEmpty.body).toHaveProperty('error');
    });

    test('POST /employees should reject empty or missing department', async () => {
      const resMissing = await request(app)
        .post('/employees')
        .send({ name: 'Vikas Gupta' });
      expect(resMissing.statusCode).toBe(422);
      expect(resMissing.body).toHaveProperty('error');

      const resEmpty = await request(app)
        .post('/employees')
        .send({ name: 'Vikas Gupta', department: '   ' });
      expect(resEmpty.statusCode).toBe(422);
      expect(resEmpty.body).toHaveProperty('error');
    });

    test('POST /employees should reject empty request body', async () => {
      const res = await request(app)
        .post('/employees')
        .send({});
      expect(res.statusCode).toBe(422);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('3. Update and Filter Employees (Q1.3)', () => {
    test('PATCH /employees/:id/status should update status to Inactive', async () => {
      const res = await request(app)
        .patch('/employees/1/status')
        .send({ status: 'Inactive' });

      expect(res.statusCode).toBe(200);
      expect(res.body.id).toBe(1);
      expect(res.body.status).toBe('Inactive');

      // Verify persistence in store
      const getRes = await request(app).get('/employees/1');
      expect(getRes.body.status).toBe('Inactive');
    });

    test('PATCH /employees/:id/status should update status to Active', async () => {
      const res = await request(app)
        .patch('/employees/3/status')
        .send({ status: 'Active' });

      expect(res.statusCode).toBe(200);
      expect(res.body.id).toBe(3);
      expect(res.body.status).toBe('Active');

      // Verify persistence in store
      const getRes = await request(app).get('/employees/3');
      expect(getRes.body.status).toBe('Active');
    });

    test('PATCH /employees/:id/status should return 422 for invalid status value', async () => {
      const res = await request(app)
        .patch('/employees/1/status')
        .send({ status: 'Suspended' });

      expect(res.statusCode).toBe(422);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toMatch(/status/i);
    });

    test('PATCH /employees/:id/status should return 422 for missing status', async () => {
      const res = await request(app)
        .patch('/employees/1/status')
        .send({});

      expect(res.statusCode).toBe(422);
      expect(res.body).toHaveProperty('error');
    });

    test('PATCH /employees/:id/status should return 404 for nonexistent employee ID', async () => {
      const res = await request(app)
        .patch('/employees/999/status')
        .send({ status: 'Inactive' });

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toMatch(/not found/i);
    });

    test('GET /employees?department=Engineering should return only Engineering employees', async () => {
      const res = await request(app).get('/employees?department=Engineering');
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.every(emp => emp.department === 'Engineering')).toBe(true);
    });

    test('GET /employees?department=engineering should be case-insensitive', async () => {
      const res = await request(app).get('/employees?department=engineering');
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.every(emp => emp.department === 'Engineering')).toBe(true);
    });

    test('GET /employees?department=  HR   should handle leading/trailing whitespace', async () => {
      const res = await request(app).get('/employees?department=%20%20HR%20%20');
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].name).toBe('Priya Patel');
      expect(res.body[0].department).toBe('HR');
    });

    test('GET /employees?department=NonExistent should return empty array', async () => {
      const res = await request(app).get('/employees?department=Finance');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([]);
    });
  });

  describe('4. General API & Swagger Documentation', () => {
    test('GET / should return welcome message and documentation links', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message');
      expect(res.body).toHaveProperty('endpoints');
    });

    test('GET /docs should serve Swagger UI', async () => {
      const res = await request(app).get('/docs/');
      expect(res.statusCode).toBe(200);
      expect(res.text).toContain('Swagger UI');
    });

    test('GET unknown route should return 404', async () => {
      const res = await request(app).get('/api/unknown');
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });
});
