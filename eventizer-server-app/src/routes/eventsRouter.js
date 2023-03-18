const express = require('express');
const { getEventById, getEventAttendees, addNewEvent, updateEventById, deleteEventById, registerEventById, getAllEvents } = require('../controllers/eventsController');
const {verifyToken, ifTokenExist} = require('../middlewares/verifyToken');
const router = express.Router();

// start route is /api/events

router.get('/', ifTokenExist, getAllEvents);
router.get('/:event_id', getEventById);

router.post('/', verifyToken, addNewEvent);
router.put('/:event_id', verifyToken, updateEventById);
router.delete('/:event_id', verifyToken, deleteEventById);

router.post('/:event_id/registration', verifyToken, registerEventById);

module.exports = router;