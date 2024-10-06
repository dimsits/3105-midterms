const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Registration route
router.post('/register', userController.register);

// Login route
router.post('/login', userController.login);

// Profile route (requires authentication)
router.get('/profile', authMiddleware, userController.getProfile);

module.exports = router;