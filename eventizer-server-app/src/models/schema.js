const mongoose = require('mongoose');

const picturesSchema = mongoose.Schema({
  filename: String
})

const usersSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  bio: { type: String },
  location: [],
  photo: picturesSchema
});

const userSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  bio: { type: String },
  location: [],
  photo: picturesSchema
})

const eventsSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  createdBy: { type: userSchema, required: true },
  startAt: { type: Number, required: true },
  endAt: { type: Number, required: true },
  location: [],
  seatLimit: { type: Number, required: true },
  attendees: [userSchema],
  photos: [picturesSchema],
  createdAt: {type: Number, required: true},
  updatedAt: {type: Number, required: true}
});

module.exports = {
  usersSchema,
  eventsSchema
}