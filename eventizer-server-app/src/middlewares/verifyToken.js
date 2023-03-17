const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../configs/configs.json');
const { UnauthorizedError } = require('../utils/error');

async function verifyToken(req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) next(new UnauthorizedError('unauthorized'));
      req.user = decoded;
      next()
    })
  } catch (e) {
    next(e);
  }
}

module.exports = verifyToken;