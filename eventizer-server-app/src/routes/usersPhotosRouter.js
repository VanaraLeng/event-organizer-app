const express = require('express');
const { uploadPhoto, getPhoto } = require('../controllers/usersController');
const { verifyToken } = require('../middlewares/verifyToken');
const upload = require('../utils/setupMulter');
const router = express.Router({ mergeParams: true });

// start route is /api/users/:user_id/photos

router.post('/', verifyToken, upload.single('photo'), uploadPhoto);
router.get('/', getPhoto);

module.exports = router;