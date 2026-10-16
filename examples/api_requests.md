# Employee REST API - API Requests & Examples

Base URL: `http://127.0.0.1:8000`

---

## 1. Retrieve Employees (Q1.1)

### 1.1 Get All Employees
**Request:**
```bash
curl -X GET http://127.0.0.1:8000/employees
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Rahul Sharma",
    "department": "Engineering",
    "status": "Active"
  },
  {
    "id": 2,
    "name": "Priya Patel",
    "department": "HR",
    "status": "Active"
  },
  {
    "id": 3,
    "name": "Amit Verma",
    "department": "Engineering",
    "status": "Inactive"
  }
]
```

---

### 1.2 Get Employee by ID
**Request:**
```bash
curl -X GET http://127.0.0.1:8000/employees/1
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Rahul Sharma",
  "department": "Engineering",
  "status": "Active"
}
```

---

### 1.3 Get Employee by ID - Not Found
**Request:**
```bash
curl -X GET http://127.0.0.1:8000/employees/999
```

**Response (404 Not Found):**
```json
{
  "error": "Employee with ID 999 not found"
}
```

---

## 2. Add an Employee (Q1.2)

### 2.1 Successfully Create an Employee
- Automatically generates unique ID (`4`).
- Automatically assigns default status `"Active"`.

**Request:**
```bash
curl -X POST http://127.0.0.1:8000/employees \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sneha Rao",
    "department": "Design"
  }'
```

**Response (201 Created):**
```json
{
  "id": 4,
  "name": "Sneha Rao",
  "department": "Design",
  "status": "Active"
}
```

---

### 2.2 Reject Missing/Empty Fields
**Request:**
```bash
curl -X POST http://127.0.0.1:8000/employees \
  -H "Content-Type: application/json" \
  -d '{
    "name": "   ",
    "department": "Engineering"
  }'
```

**Response (422 Unprocessable Entity):**
```json
{
  "error": "Validation error: 'name' and 'department' are required and cannot be empty."
}
```

---

## 3. Update and Filter Employees (Q1.3)

### 3.1 Update Status to Inactive
**Request:**
```bash
curl -X PATCH http://127.0.0.1:8000/employees/1/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Inactive"
  }'
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Rahul Sharma",
  "department": "Engineering",
  "status": "Inactive"
}
```

---

### 3.2 Update Status to Active
**Request:**
```bash
curl -X PATCH http://127.0.0.1:8000/employees/3/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Active"
  }'
```

**Response (200 OK):**
```json
{
  "id": 3,
  "name": "Amit Verma",
  "department": "Engineering",
  "status": "Active"
}
```

---

### 3.3 Reject Invalid Status Value
**Request:**
```bash
curl -X PATCH http://127.0.0.1:8000/employees/1/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Suspended"
  }'
```

**Response (422 Unprocessable Entity):**
```json
{
  "error": "Validation error: 'status' must be either 'Active' or 'Inactive'."
}
```

---

### 3.4 Update Status for Nonexistent Employee
**Request:**
```bash
curl -X PATCH http://127.0.0.1:8000/employees/999/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Active"
  }'
```

**Response (404 Not Found):**
```json
{
  "error": "Employee with ID 999 not found"
}
```

---

### 3.5 Filter Employees by Department
**Request:**
```bash
curl -X GET "http://127.0.0.1:8000/employees?department=Engineering"
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Rahul Sharma",
    "department": "Engineering",
    "status": "Active"
  },
  {
    "id": 3,
    "name": "Amit Verma",
    "department": "Engineering",
    "status": "Inactive"
  }
]
```

*(Department filter is case-insensitive, so `?department=engineering` returns identical results).*

---

## 4. Swagger UI Documentation
Open the interactive Swagger UI directly in your browser:
- `http://127.0.0.1:8000/docs`
