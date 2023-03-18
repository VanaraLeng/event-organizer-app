const { BadRequestError } = require('../utils/error');
const Events = require('../models/eventsModel');

async function getAllEvents(req, res, next) {
  try {

  } catch (e) {
    next(e);
  }
}

async function getEventById(req, res, next) {
  try {
    const { event_id } = req.params;
    const result = await Events.findOne({ _id: event_id });
    if (!result) throw new BadRequestError('no event found');
    res.json({ success: true, data: { events: [result] } });
  } catch (e) {
    next(e);
  }
}

async function getEventAttendees(req, res, next) {
  try {

  } catch (e) {
    next(e);
  }
}

async function addNewEvent(req, res, next) {
  try {
    const timestamp = Date.now();
    const newEvent = new Events({
      ...req.body,
      createdBy: req.user,
      createdAt: timestamp,
      updatedAt: timestamp
    });
    const result = await newEvent.save();
    res.json({ success: true, data: { result: result } });
  } catch (e) {
    next(e);
  }
}

async function updateEventById(req, res, next) {
  try {
    const { event_id } = req.params;
    const result = await Events.updateOne(
      { _id: event_id, "createdBy._id": req.user._id },
      { $set: { ...req.body, updatedAt: Date.now() } }
    );
    res.json({ success: true, data: { result: result } });
  } catch (e) {
    next(e);
  }
}

async function deleteEventById(req, res, next) {
  try {
    const { event_id } = req.params;
    const result = await Events.deleteOne({ _id: event_id, "createdBy._id": req.user._id });
    res.json({ success: true, data: { result: result } });
  } catch (e) {
    next(e);
  }
}

async function registerEventById(req, res, next) {
  try {

  } catch (e) {
    next(e);
  }
}

module.exports = {
  getAllEvents,
  getEventById,
  getEventAttendees,
  addNewEvent,
  updateEventById,
  deleteEventById,
  registerEventById
}