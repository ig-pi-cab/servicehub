class AppError extends Error {
  constructor(message, status = 500, extra = {}) {
    super(message);
    this.status = status;
    Object.assign(this, extra);
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
