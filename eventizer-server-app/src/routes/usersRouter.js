const express = require('express');
const { login, signup, getUserById, updateUserById } = require('../controllers/usersController');
const { verifyToken } = require('../middlewares/verifyToken');
const router = express.Router();

// start route is /api/users

router.post('/login', login);
router.post('/signup', signup);

router.get('/:user_id', getUserById);
router.put('/:user_id', verifyToken, updateUserById);

module.exports = router;