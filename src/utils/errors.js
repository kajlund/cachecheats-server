const { reasonPhrases, statusCodes } = require('./statuscodes')

class AppError extends Error {
  constructor(message = reasonPhrases.INTERNAL_SERVER_ERROR, status = statusCodes.INTERNAL_SERVER_ERROR, detail = '') {
    super(message)
    this.status = status
    this.name = this.constructor.name
    this.detail = detail
    Error.captureStackTrace(this, this.constructor)
  }
}

class BadRequestError extends AppError {
  constructor(detail) {
    super(reasonPhrases.BAD_REQUEST, statusCodes.BAD_REQUEST, detail)
  }
}

class InternalServerError extends AppError {
  constructor(detail = '') {
    super(reasonPhrases.INTERNAL_SERVER_ERROR, statusCodes.INTERNAL_SERVER_ERROR, detail)
  }
}

class MaximumFileSizeException extends AppError {
  constructor(size = 100) {
    super(reasonPhrases.BAD_REQUEST, statusCodes.BAD_REQUEST, `Maximum upload file size (${size}) exceeded`)
  }
}

class NotFoundError extends AppError {
  constructor(detail = '') {
    super(reasonPhrases.NOT_FOUND, statusCodes.NOT_FOUND, detail)
  }
}

class UnauthorizedError extends AppError {
  constructor(detail = '') {
    super(reasonPhrases.UNAUTHORIZED, statusCodes.UNAUTHORIZED, detail)
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
