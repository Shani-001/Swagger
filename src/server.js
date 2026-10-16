const app = require('./app');

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running at http://127.0.0.1:${PORT}`);
  console.log(`Swagger UI Documentation available at http://127.0.0.1:${PORT}/docs`);
});
