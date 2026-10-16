
# Employee REST API

Employee REST API built using **Node.js** and **Express.js**.

## Features

- Retrieve all employees using `GET /employees`.
- Retrieve an employee by ID using `GET /employees/:id`.
- Add employees using `POST /employees` with automatic ID generation and default Active status.
- Update employee status using `PATCH /employees/:id/status`.
- Filter employees by department using `GET /employees?department=Engineering`.
- Validate employee names, departments, and status values.
- Return appropriate HTTP error responses for invalid requests and missing employees.
- Store employee data in an in-memory list.
- Interactive API documentation using Swagger UI.

## How to Run the Application

**Prerequisites:** Install Node.js (v18 or later) and npm.

1. Open the project folder in a terminal.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the API:

   ```bash
   npm start
   ```

4. Open the API at `http://127.0.0.1:8000`.

5. Access Swagger UI at `http://127.0.0.1:8000/docs`.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/employees` | Retrieve all employees |
| GET | `/employees/:id` | Retrieve employee by ID |
| POST | `/employees` | Create an employee |
| PATCH | `/employees/:id/status` | Update employee status |
| GET | `/employees?department=Engineering` | Filter by department |

## Automated Tests

Run tests using Jest and Supertest:

```bash
npm test
```

Test file: `tests/employees.test.js`

## Project Files

- **Source Code:** `src/`
- **Automated Tests:** `tests/employees.test.js`
- **Postman Collection:** `postman_collection.json`
- **API Examples:** `examples/api_requests.md`
- **Swagger Specification:** `src/docs/swagger.json`
- **ZIP Submission:** `employee-api.zip`

## ZIP Submission

The `employee-api.zip` archive contains the source code, tests, README, Postman collection, and API examples.

`node_modules`, logs, and temporary cache files are excluded.
