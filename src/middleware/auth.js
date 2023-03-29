const jwt = require('jsonwebtoken')

const cnf = require('../config')
const { UnauthorizedError } = require('../utils/errors')
const logger = require('../utils/logger')
const User = require('../api/users/user.model')

exports.auth = async (req, res, next) => {
  const token = req.header('Authorization') ? req.header('Authorization').replace('Bearer ', '') : req.cookies.token
  if (!token) {
    throw new UnauthorizedError('Invalid token')
  }

  try {
    const decoded = jwt.verify(token, cnf.jwtAccessTokenSecret)
    // attach the user to request
    req.user = await User.findById(decoded.userId)
    if (!req.user || !req.user.role) {
      next(new UnauthorizedError('Confirmed users only'))
    }
    next()
  } catch (err) {
    logger.error(err)
    next(new UnauthorizedError('Invalid token'))
  }
}

exports.admin = (req, res, next) => {
  if (req.user.role === 'admin') {
    return next()
  }
  next(new UnauthorizedError('Admins only'))
}
