const express = require('express');
const { login, signup } = require('../controllers/usersController');
const usersPhotosRouter = require('./usersPhotosRouter');
const router = express.Router();

// start route is /api/users

router.post('/login', login);
router.post('/signup', signup);

router.use('/:user_id/photos', usersPhotosRouter);

module.exports = router;