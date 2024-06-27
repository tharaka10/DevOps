const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth.controller');

// using HTTP POST method for register & login
router.post('/register', register);
router.post('/login', login);

module.exports = router;
