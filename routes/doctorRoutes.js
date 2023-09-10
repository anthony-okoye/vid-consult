const express = require('express');
const router = express.Router();
const DoctorController = require('../controllers/doctorController');

// Doctor registration route
router.post('/register', DoctorController.registerDoctor);

// Doctor profile creation route (if needed)
// router.post('/create-profile', DoctorController.createDoctorProfile);

// Doctor verification route
router.post('/verify/:id', DoctorController.verifyDoctor);

module.exports = router;
