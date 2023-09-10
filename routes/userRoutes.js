const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

// User registration route
router.post('/register', UserController.registerUser);

// User login route
router.post('/login', UserController.loginUser);

// Update user route
router.put('/update/:id', UserController.updateUser);

// Password recovery route
router.post('/recover', UserController.recoverPassword);

// Add more routes for profile creation, updating, etc.

module.exports = router;
