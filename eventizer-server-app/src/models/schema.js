const mongoose = require('mongoose');

const photosSchema = mongoose.Schema({
  filename: String
})

const usersSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  bio: { type: String },
  location: [Number],
  photo: photosSchema,
  createdAt: { type: Number, required: true },
  updatedAt: { type: Number, required: true }
});

const userSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  bio: { type: String },
  location: [Number],
  photo: photosSchema
})

const eventsSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  createdBy: { type: userSchema, required: true },
  startAt: { type: Number, required: true },
  endAt: { type: Number, required: true },
  location: { type: [Number], index: '2d' },
  seatLimit: { type: Number, required: true },
  attendees: [userSchema],
  photo: photosSchema,
  createdAt: { type: Number, required: true },
  updatedAt: { type: Number, required: true }
});

module.exports = {
  usersSchema,
  eventsSchema
}