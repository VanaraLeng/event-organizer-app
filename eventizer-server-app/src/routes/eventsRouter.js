const express = require('express');
const { getEventById, getEventAttendees, addNewEvent, updateEventById, deleteEventById, registerEventById } = require('../controllers/eventsController');
const verifyToken = require('../middlewares/verifyToken');
const router = express.Router();

// start route is /api/events

// router.get('/')
router.get('/:event_id', getEventById);
router.get('/:event_id/attendees', getEventAttendees);

router.post('/', verifyToken, addNewEvent);
router.put('/:event_id', verifyToken, updateEventById);
router.delete('/:event_id', verifyToken, deleteEventById);

router.post('/:event_id/registration?action', verifyToken, registerEventById);

module.exports = router;