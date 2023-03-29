const express = require('express')

const cnf = require('./config')
const logger = require('./utils/logger')
const { AppError } = require('./utils/errors')
const { reasonPhrases, statusCodes } = require('./utils/statuscodes')

// Import Route Objects
const authRoutes = require('./api/auth/auth.routes')
const userRoutes = require('./api/users/user.routes')
const placeRoutes = require('./api/places/place.routes')

class Router {
  constructor() {
    this.router = express.Router()
    this.apiRoutes = [authRoutes, userRoutes, placeRoutes]
    this.webRoutes = []
  }

  _attachRoutes(routeGroups, prefix = '') {
    routeGroups.forEach(({ group, routes }) => {
      routes.forEach(({ method, path, middleware = [], handler }) => {
        logger.info(`Route: ${method} ${prefix}${group.prefix}${path}`)
        this.router[method](
          prefix + group.prefix + path,
          [...(group.middleware || []), ...middleware],
          this._catchError(handler)
        )
      })
    })
  }

  _catchError(route) {
    return (req, res, next) => {
      route(req, res, next).catch(next)
    }
  }

  _handleExceptions() {
    this.router.use((err, req, res, _next) => {
      const error = {
        statusCode: err.status || err.statusCode || statusCodes.INTERNAL_SERVER_ERROR,
      }

      if (err instanceof AppError) {
        error.message = err.message
        error.detail = err.detail
      }

      if (err.name === 'ValidationError') {
        error.detail = Object.values(err.errors)
          .map((item) => item.message)
          .join(', ')
        error.statusCode = statusCodes.BAD_REQUEST
        error.message = reasonPhrases.BAD_REQUEST
      }

      if (err.code && err.code === 11000) {
        error.statusCode = statusCodes.BAD_REQUEST
        error.message = reasonPhrases.BAD_REQUEST
        error.detail = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value`
      }

      if (err.name === 'CastError') {
        error.statusCode = statusCodes.NOT_FOUND
        error.message = reasonPhrases.NOT_FOUND
        error.detail = `No item found with id : ${err.value}`
      }

      if (cnf.nodeEnv !== 'development' && !(err instanceof AppError)) {
        if (error.statusCode <= statusCodes.BAD_REQUEST) {
          error.message = reasonPhrases.BAD_REQUEST
        } else if (error.statusCode >= statusCodes.INTERNAL_SERVER_ERROR) {
          logger.error(err, 'Generic exception handler caught error:')
          error.message = reasonPhrases.INTERNAL_SERVER_ERROR
        }
      }

      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        detail: error.detail || '',
      })
    })
  }

  _handlePageNotFound() {
    this.router.all('*', (req, res) => {
      res.status(statusCodes.NOT_FOUND).send({
        success: false,
        message: reasonPhrases.NOT_FOUND,
      })
    })
  }

  initializeRouter(app) {
    this._attachRoutes(this.apiRoutes, '/api')

    this._handlePageNotFound()
    this._handleExceptions()

    // register router
    app.use(this.router)
  }
}

// Export Singleton instance
module.exports = new Router()
