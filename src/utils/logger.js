const pino = require('pino')

const cnf = require('../config')

const logger = pino(cnf.log)
logger.debug(cnf.log, 'Logger configured:')

module.exports = logger
