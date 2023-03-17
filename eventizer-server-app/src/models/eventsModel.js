const mongoose = require('mongoose');
const { eventsSchema } = require('./schema');

module.exports = mongoose.model('event', eventsSchema);