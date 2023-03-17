class BadRequestError extends Error {
  constructor(msg) {
    super(msg);
  }
}

class NotFoundError extends Error {
  constructor(msg) {
    super(msg);
  }
}

module.exports = {
  BadRequestError,
  NotFoundError
}