// app.js

const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const loggingMiddleware = require('./middleware/loggingMiddleware');

const app = express();

app.use(bodyParser.json());

// Logging middleware
app.use(loggingMiddleware);

// User routes
app.use('/user', userRoutes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
