const express = require('express');
const { getPhoto, uploadPhoto } = require('../controllers/photosController');
const { upload } = require('../utils/setupMulter');

const router = express.Router();

// start route is /api/photo

router.post('/', upload.single('photo'), uploadPhoto);
router.get('/:photo_key', getPhoto);

module.exports = router;