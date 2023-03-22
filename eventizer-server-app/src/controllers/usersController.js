const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = require('../models/usersModel');
const { UnauthorizedError } = require('../utils/error');

async function login(req, res, next) {
  try {
    const { email, password } = { ...req.body };
    const user = await Users.findOne({ email: email }).lean();
    if (!user) res.json({ success: false, message: 'incorrect email' });
    const result = await bcrypt.compare(password, user.password);
    if (!result) res.json({ success: false, message: 'incorrect password' });
    jwt.sign({ ...user, password: null }, process.env.SECRET_KEY, (err, token) => {
      res.json({ success: true, data: { token: token } });
    });
  } catch (e) {
    next(e);
  }
}

async function signup(req, res, next) {
  try {
    const hashPassword = await bcrypt.hash(req.body.password, +process.env.saltRounds);
    const timestamps = Date.now();
    const user = {
      ...req.body,
      photo: { filename: req.body.photo },
      password: hashPassword,
      updatedAt: timestamps,
      createdAt: timestamps,
    };
    const newUser = await new Users(user).save();
    jwt.sign({ ...newUser._doc, password: null }, process.env.SECRET_KEY, (err, token) => {
      res.json({ success: true, data: { token: token } });
    });
  } catch (e) {
    res.json({ success: false, message: 'cannot signup' });
  }
}

async function getUserById(req, res, next) {
  try {
    const { user_id } = req.params;
    const result = await Users.findOne(
      { _id: user_id },
      { password: 0 }
    );
    res.json({ success: true, data: { user: result } });
  } catch (e) {
    next(e);
  }
}

async function updateUserById(req, res, next) {
  try {
    const { user_id } = req.params;
    if (req.user._id != user_id) throw new UnauthorizedError('not authorized to update user details');
    const timestamp = Date.now();
    // const oneDay = 24 * 60 * 60 * 1000;
    const userToBeUpdate = {
      ...req.body,
      photo: { filename: req.body.photo },
      updatedAt: timestamp
    };
    if (req.body.photo == "") delete userToBeUpdate.photo;
    const result = await Users.updateOne(
      // { _id: user_id, $expr: { $gt: [{ $subtract: [timestamp, "$updatedAt"] }, oneDay] } },
      { _id: user_id },
      { $set: userToBeUpdate }
    );
    // if (result.modifiedCount == 0) {
    //   res.json({ success: false, message: "re-update profile within 24 hour is not allowed" });
    //   return;
    // }
    res.json({ success: true, data: { result: result } });
  } catch (e) {
    next(e);
  }
}

module.exports = {
  login,
  signup,
  getUserById,
  updateUserById
}