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
    const user = { ...req.body, password: hashPassword };
    user.photo = { filename: req.body.photo };
    const newUser = new Users(user);
    await newUser.save();
    jwt.sign({ ...req.body, password: null }, process.env.SECRET_KEY, (err, token) => {
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
    console.log(req.body);
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

module.exports = {
  login,
  signup,
  getUserById,
  updateUserById
}