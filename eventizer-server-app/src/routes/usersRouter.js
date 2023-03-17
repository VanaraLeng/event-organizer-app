const express = require('express');
const { login, signup } = require('../controllers/usersController');
const router = express.Router();

// start route is /api/users

router.post('/login', login);
router.post('/signup', signup);

module.exports = router;