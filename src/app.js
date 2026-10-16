const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.json');
const employeeRoutes = require('./routes/employees');

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Handle malformed JSON syntax errors gracefully
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Malformed JSON payload.' });
  }
  next(err);
});

// Swagger UI Documentation
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Root Endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Employee REST API',
    endpoints: {
      employees: '/employees',
      swagger_ui: '/docs'
    }
  });
});

// Employee Routes
app.use('/employees', employeeRoutes);

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.url} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;
