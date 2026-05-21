const express = require('express');
const router = express.Router();
const { register, login, resetPassword, signup } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/reset-password', resetPassword);
router.post('/signup', signup);

module.exports = router;