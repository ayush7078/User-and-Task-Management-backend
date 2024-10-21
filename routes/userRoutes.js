const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs-extra');
const { validateUserRegistration, validateUserLogin } = require('../utils/validate');
//const { authenticateJWT, authorizeRole } = require('../middleware/auth');

const { authenticateJWT, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();
const usersFilePath = './data/users.json';

// Helper function to get users
const getUsers = async () => JSON.parse(await fs.readFile(usersFilePath, 'utf8'));

// User Registration
router.post('/register', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const errors = validateUserRegistration(req.body);
    if (errors.length > 0) return res.status(400).json({ errors });

    const users = await getUsers();
    const existingUser = users.find(user => user.username === username);
    if (existingUser) return res.status(400).json({ error: 'Username already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: uuidv4(), username, password: hashedPassword };
    users.push(newUser);

    await fs.writeFile(usersFilePath, JSON.stringify(users));
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    next(error);
  }
});

// User Login
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const errors = validateUserLogin(req.body);
    if (errors.length > 0) return res.status(400).json({ errors });

    const users = await getUsers();
    const user = users.find(user => user.username === username);
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    next(error);
  }
});

// Admin-only routes
router.get('/', authenticateJWT, authorizeAdmin, async (req, res, next) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', authenticateJWT, authorizeAdmin, async (req, res, next) => {
  try {
    const users = await getUsers();
    const user = users.find(user => user.id === req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (error) {
    next(error);
  }
});

// Role Based Registration it is particular for only user
// // User Registration
// router.post('/register', async (req, res, next) => {
//   try {
//     const { username, password } = req.body;
//     const errors = validateUserRegistration(req.body);
//     if (errors.length > 0) return res.status(400).json({ errors });

//     const users = await getUsers();
//     const existingUser = users.find(user => user.username === username);
//     if (existingUser) return res.status(400).json({ error: 'Username already exists' });

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = { id: uuidv4(), username, password: hashedPassword, role: 'user' }; // Set role to 'user'
//     users.push(newUser);

//     await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2)); // Pretty print JSON
//     res.status(201).json({ message: 'User registered successfully' });
//   } catch (error) {
//     next(error);
//   }
// });


// // User and admin both can Login
// router.post('/login', async (req, res, next) => {
//   try {
//     const { username, password } = req.body;
//     const errors = validateUserLogin(req.body);
//     if (errors.length > 0) return res.status(400).json({ errors });

//     const users = await getUsers();
//     const user = users.find(user => user.username === username);
//     if (!user) return res.status(400).json({ error: 'Invalid credentials' });

//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) return res.status(400).json({ error: 'Invalid credentials' });

//     const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, 'secretKey', { expiresIn: '1h' });
//     res.json({ token });
//   } catch (error) {
//     next(error);
//   }
// });

// Role Based Registration it is particular for only admin
// // Admin Registration
// router.post('/admin-register', async (req, res, next) => {
//   try {
//     const { username, password } = req.body;
//     const errors = validateUserRegistration(req.body);
//     if (errors.length > 0) return res.status(400).json({ errors });

//     const users = await getUsers();
//     const existingUser = users.find(user => user.username === username);
//     if (existingUser) return res.status(400).json({ error: 'Username already exists' });

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newAdmin = { id: uuidv4(), username, password: hashedPassword, role: 'admin' }; // Set role to 'admin'
//     users.push(newAdmin);

//     await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2)); // Pretty print JSON
//     res.status(201).json({ message: 'Admin registered successfully' });
//   } catch (error) {
//     next(error);
//   }
// });


module.exports = router;
