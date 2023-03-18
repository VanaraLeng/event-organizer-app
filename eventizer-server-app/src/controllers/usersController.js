const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { SECRET_KEY, saltRounds } = require('../configs/configs.json');
const Users = require('../models/usersModel');
const { BadRequestError } = require('../utils/error');

async function login(req, res, next) {
  try {
    const { email, password } = { ...req.body };
    const user = await Users.findOne({ email: email }).lean();
    if (!user) throw new BadRequestError('incorrect email');
    const result = await bcrypt.compare(password, user.password);
    if (!result) throw new BadRequestError('incorrect password');
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
    next(e);
  }
}

module.exports = {
  login,
  signup
}