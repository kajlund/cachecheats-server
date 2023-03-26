const express = require('express')

const cnf = require('./config')
const logger = require('./utils/logger')
const { AppError } = require('./utils/errors')
const { reasonPhrases, statusCodes } = require('./utils/statuscodes')

// Import Route Objects

class Router {
  constructor() {
    this.router = express.Router()
    this.apiRoutes = []
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
      err.statusCode = err.status || err.statusCode || statusCodes.INTERNAL_SERVER_ERROR

      if (cnf.nodeEnv !== 'development' && !(err instanceof AppError)) {
        if (err.statusCode <= statusCodes.BAD_REQUEST) {
          err.message = reasonPhrases.BAD_REQUEST
        } else if (err.statusCode >= statusCodes.INTERNAL_SERVER_ERROR) {
          logger.error(err, 'Generic exception handler caught error:')
          err.message = reasonPhrases.INTERNAL_SERVER_ERROR
        }
      }

      return res.status(err.statusCode).json({
        success: false,
        message: err.message,
        errors: err.errors || [],
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
