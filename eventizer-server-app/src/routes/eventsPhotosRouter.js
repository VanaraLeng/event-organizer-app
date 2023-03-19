const express = require('express');
const upload = require('../utils/setupMulter');
const { getAllEventPhotos, uploadEventPhotos, getEventPhotoById } = require('../controllers/eventsController');
const { verifyToken } = require('../middlewares/verifyToken');
const router = express.Router({ mergeParams: true });

// start route is /api/events/:event_id/photos

router.get('/', getAllEventPhotos);
router.post('/', verifyToken, upload.fields([{ name: 'gallery', maxCount: 3 }]), uploadEventPhotos);
router.get('/:photo_id', getEventPhotoById);

module.exports = router;