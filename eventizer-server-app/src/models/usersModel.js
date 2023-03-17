const mongoose = require('mongoose');
const { usersSchema } = require('./schema');

module.exports = mongoose.model('user', usersSchema);