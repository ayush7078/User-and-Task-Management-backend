const express = require('express');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs-extra');
const { authenticateJWT } = require('../middleware/auth');
const { validateTaskCreation } = require('../utils/validate');

const router = express.Router();
const tasksFilePath = './data/tasks.json';

// Helper function to get tasks
const getTasks = async () => JSON.parse(await fs.readFile(tasksFilePath, 'utf8'));

// // Get all tasks for authenticated user
router.get('/', authenticateJWT, async (req, res, next) => {
    try {
      const page = req.query.page ? req.query.page : 1;
      const limit = req.query.limit ? req.query.limit : 10;
      const tasks = await getTasks();
      const userTasks = tasks.filter(task => task.userId === req.user.id);
      
      const paginatedTasks = userTasks.slice((page - 1) * limit, page * limit);
      res.json(paginatedTasks);
    } catch (error) {
      next(error);
    }
  });
  

// Get task by ID
router.get('/:id', authenticateJWT, async (req, res, next) => {
  try {
    const tasks = await getTasks();
    const task = tasks.find(task => task.id === req.params.id && task.userId === req.user.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    res.json(task);
  } catch (error) {
    next(error);
  }
});

// Create new task
router.post('/', authenticateJWT, async (req, res, next) => {
  try {
    const { title, completed } = req.body;
    const errors = validateTaskCreation(req.body);
    if (errors.length > 0) return res.status(400).json({ errors });

    const newTask = { id: uuidv4(), userId: req.user.id, title, completed: completed || false };
    const tasks = await getTasks();
    tasks.push(newTask);

    await fs.writeFile(tasksFilePath, JSON.stringify(tasks));
    res.status(201).json(newTask);
  } catch (error) {
    next(error);
  }
});

// Update task
router.put('/:id', authenticateJWT, async (req, res, next) => {
  try {
    const tasks = await getTasks();
    const task = tasks.find(task => task.id === req.params.id && task.userId === req.user.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    const { title, completed } = req.body;
    task.title = title || task.title;
    task.completed = completed !== undefined ? completed : task.completed;

    await fs.writeFile(tasksFilePath, JSON.stringify(tasks));
    res.json(task);
  } catch (error) {
    next(error);
  }
});

// Delete task
router.delete('/:id', authenticateJWT, async (req, res, next) => {
  try {
    const tasks = await getTasks();
    const updatedTasks = tasks.filter(task => task.id !== req.params.id || task.userId !== req.user.id);
    if (tasks.length === updatedTasks.length) return res.status(404).json({ error: 'Task not found' });

    await fs.writeFile(tasksFilePath, JSON.stringify(updatedTasks));
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
