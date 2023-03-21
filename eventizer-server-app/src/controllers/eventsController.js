const { BadRequestError } = require('../utils/error');
const Events = require('../models/eventsModel');

async function getAllEvents(req, res, next) {
  try {
    // construct query
    const { registered, startBefore, startAfter, popular, lat, long } = req.query;
    const query = {};
    if (req.user) {
      if (req.user.location) query['location'] = { $near: req.user.location };
      if (registered === "true") query['attendees._id'] = req.user._id;
      else if (registered === "false") query['createdBy._id'] = req.user._id;
    }
    if (startBefore) query['startAt'] = { $lte: startBefore }
    if (startAfter && startBefore) query['startAt'] = { $gte: startAfter, $lte: startBefore }
    if (popular) query['$expr'] = { $gt: [{ $size: "$attendees" }, { $multiply: ["$seatLimit", 0.5] }] }
    if (lat && long) query['location'] = { $near: [+long, +lat] };

    // find events
    let result = await Events.find(query).sort({ createdAt: -1 }).lean();

    // flag events that req.user registered
    if (req.user && (!registered || registered === "true")) {
      result = result.map(event => {
        event.attendees.forEach(attendee => {
          if (attendee._id == req.user._id) event.registered = true;
        });
        return event;
      });
    }

    // respond result
    res.json({ success: true, data: { events: result } });
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

async function addNewEvent(req, res, next) {
  try {
    const timestamp = Date.now();
    const newEvent = new Events({
      ...req.body,
      photo: [{ filename: req.body.photo }],
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
    const updatedEvent = {
      ...req.body,
      photo: [{ filename: req.body.photo }],
      updatedAt: Date.now()
    };
    if (req.body.photo == "") delete updatedEvent.photo;
    const result = await Events.updateOne(
      { _id: event_id, "createdBy._id": req.user._id },
      { $set: updatedEvent }
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
    const { event_id } = req.params;
    const { action } = req.query;
    let result = await Events.findOne(
      { _id: event_id, "createdBy._id": req.user._id }
    );
    if (result) res.json({ success: false, message: 'creator not allow to register' });
    else if (action === "register") {
      result = await Events.updateOne(
        { _id: event_id },
        { $push: { attendees: req.user } }
      );
    } else {
      result = await Events.updateOne(
        { _id: event_id },
        { $pull: { attendees: { _id: req.user._id } } }
      );
    }
    res.json({ success: true, data: { result: result } });
  } catch (e) {
    next(e);
  }
}

module.exports = {
  getAllEvents,
  getEventById,
  addNewEvent,
  updateEventById,
  deleteEventById,
  registerEventById
}