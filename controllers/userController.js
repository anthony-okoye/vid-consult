const User = require('../models/User');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

class UserController {
  async registerUser(req, res) {
    try {
      const { firstname, lastname, username, mobile, email, password } = req.body;
  
      // Check if the email or mobile already exist in the database
      const emailExists = await User.findOne({ email });
      const mobileExists = await User.findOne({ mobile });
  
      if (emailExists) {
        return res.status(400).json({ error: 'Email already in use' });
      }
  
      if (mobileExists) {
        return res.status(400).json({ error: 'Mobile number already in use' });
      }
  
      // Hash the password before saving it
      const hashedPassword = await bcrypt.hash(password, 10); // The second argument is the salt rounds
  
      // If email and mobile are unique, create and save the user with the hashed password
      const user = new User({ firstname, lastname, username, mobile, email, password: hashedPassword });
      await user.save();
      return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Registration failed' });
    }
  }

  async loginUser(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Compare the hashed input password with the stored hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Password is valid; you can proceed with authentication
      // You can generate a JWT token here for authentication if needed

      return res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
      return res.status(500).json({ error: 'Login failed' });
    }
  }

  async updateUser(req, res) {
    try {
      const userId = req.params.id;
      const updateData = req.body;
      const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
      return res.status(500).json({ error: 'User update failed' });
    }
  }

  async recoverPassword(req, res) {
    try {
      const { email } = req.body;

      // Implement password recovery logic (e.g., sending a reset email)
      // Generate and send a password reset token to the user's email

      return res.status(200).json({ message: 'Password recovery email sent' });
    } catch (error) {
      return res.status(500).json({ error: 'Password recovery failed' });
    }
  }

  // Add methods for profile creation, updating, and other user-related actions
}

module.exports = new UserController();
