const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../../configs.json');
const { UnauthorizedError } = require('../utils/error');

async function verifyToken(req, res, next) {
  try {
    const auth = req.headers.authorization;
    if (auth) {
      const token = req.headers.authorization.split(' ')[1];
      jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) next(new UnauthorizedError('unauthorized'));
        req.user = decoded;
        next()
      });
    } else {
      next(new UnauthorizedError('token is required'));
    }
  } catch (e) {
    next(e);
  }
}

async function ifTokenExist(req, res, next) {
  try {
    const auth = req.headers.authorization;
    if (auth) {
      const token = auth.split(' ')[1];
      jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (decoded) req.user = decoded;
      });
    }
    next();
  } catch (e) {
    next(e);
  }
}

module.exports = {
  verifyToken,
  ifTokenExist
};