const { reasonPhrases, statusCodes } = require('./statuscodes')

class AppError extends Error {
  constructor(message = reasonPhrases.INTERNAL_SERVER_ERROR, status = statusCodes.INTERNAL_SERVER_ERROR, errors = []) {
    super(message)
    this.status = status
    this.name = this.constructor.name
    this.errors = errors
    Error.captureStackTrace(this, this.constructor)
  }
}

class BadRequestError extends AppError {
  constructor(message = reasonPhrases.BAD_REQUEST, status = statusCodes.BAD_REQUEST, errors) {
    super(message, status, errors)
  }
}

class InternalServerError extends AppError {
  constructor(message = reasonPhrases.INTERNAL_SERVER_ERROR, status = statusCodes.INTERNAL_SERVER_ERROR) {
    super(message, status)
  }
}

class MaximumFileSizeException extends AppError {
  constructor(size = 100, status = statusCodes.BAD_REQUEST) {
    super(`Maximum upload file size (${size}) exceeded`, status)
  }
}

class NotFoundError extends AppError {
  constructor(message = reasonPhrases.NOT_FOUND, status = statusCodes.NOT_FOUND) {
    super(message, status)
  }
}

class UnauthorizedError extends AppError {
  constructor(message = reasonPhrases.UNAUTHORIZED, status = statusCodes.UNAUTHORIZED) {
    super(message, status)
  }
}

module.exports = {
  AppError,
  BadRequestError,
  InternalServerError,
  MaximumFileSizeException,
  NotFoundError,
  UnauthorizedError,
}
