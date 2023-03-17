const express = require('express');
const { getEventById, getEventAttendees, addNewEvent, updateEventById, deleteEventById, registerEventById } = require('../controllers/eventsController');
const router = express.Router();

// start route is /api/events

// router.get('/')
router.get('/:event_id', getEventById);
router.get('/:event_id/attendees', getEventAttendees);

router.post('/', addNewEvent);
router.put('/:event_id', updateEventById);
router.delete('/:event_id', deleteEventById);

router.post('/:event_id/registration?action', registerEventById);

module.exports = router;