const util = require('util')

const cnf = require('./config')
const logger = require('./utils/logger')
const App = require('./app')

process.on('uncaughtException', (err) => {
  logger.error(`UNCAUGHT EXCEPTION - ${err.stack || err}`)
  throw err
})

process.on('unhandledRejection', (reason, p) => {
  logger.error(`UNHANDLED PROMISE REJECTION: ${util.inspect(p)} reason: ${reason}`)
})

logger.info('Starting server')
const app = new App(cnf)
app.initialize()
app.start()
