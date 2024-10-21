const express = require('express');
const fs = require('fs-extra');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const { handleErrors , notFound } = require('./middleware/error');

const app = express();
app.use(express.json());

// Routes
app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);

// Error handling middleware
app.use(handleErrors);
// 404 Error Handling Middleware
app.use(notFound);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
