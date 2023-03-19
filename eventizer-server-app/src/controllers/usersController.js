const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { SECRET_KEY, saltRounds } = require('../configs/configs.json');
const Users = require('../models/usersModel');
const { BadRequestError, UnauthorizedError } = require('../utils/error');

async function login(req, res, next) {
  try {
    const { email, password } = { ...req.body };
    const user = await Users.findOne({ email: email }).lean();
    if (!user) res.json({ success: false, message: 'incorrect email' });
    const result = await bcrypt.compare(password, user.password);
    if (!result) res.json({ success: false, message: 'incorrect password' });
    jwt.sign({ ...user, password: null }, SECRET_KEY, (err, token) => {
      res.json({ success: true, data: { token: token } });
    });
  } catch (e) {
    next(e);
  }
}

async function signup(req, res, next) {
  try {
    const hashPassword = await bcrypt.hash(req.body.password, saltRounds);
    const newUser = new Users({ ...req.body, password: hashPassword });
    await newUser.save();
    jwt.sign({ ...req.body, password: null }, SECRET_KEY, (err, token) => {
      res.json({ success: true, data: { token: token } });
    });
  } catch (e) {
    res.json({ success: false, message: 'email already exist' });
  }
}

async function getUserById(req, res, next) {
  try {
    const { user_id } = req.params;
    const result = await Users.findOne({ _id: user_id });
    res.json({ success: true, data: { user: result } });
  } catch (e) {
    next(e);
  }
}

async function updateUserById(req, res, next) {
  try {
    const { user_id } = req.params;
    if (req.user._id != user_id) throw new UnauthorizedError('not authorized to update user details');
    const result = await Users.updateOne(
      { _id: user_id },
      { $set: { ...req.body } }
    );
    res.json({ success: true, data: { result: result } });
  } catch (e) {
    next(e);
  }
}

async function uploadPhoto(req, res, next) {
  try {
    const { user_id } = req.params;
    if (req.user._id != user_id) throw new UnauthorizedError('not authorized to upload photo');
    const photo = { filename: req.file.filename };
    const result = await Users.updateOne(
      { _id: user_id },
      { $set: { photo: photo } }
    );
    res.json({ success: true, data: { result: result } });
  } catch (e) {
    next(e);
  }
}

async function getPhoto(req, res, next) {
  try {
    const { user_id } = req.params;
    const result = await Users.findOne(
      { _id: user_id },
      { photo: 1 }
    );
    if (!result) throw new BadRequestError('no user found');
    res.json({ success: true, data: { photos: [result.photo] } });
  } catch (e) {
    next(e);
  }
}

module.exports = {
  login,
  signup,
  getUserById,
  updateUserById,
  uploadPhoto,
  getPhoto
}