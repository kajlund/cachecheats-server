const cookieParser = require('cookie-parser')
const cors = require('cors')
const express = require('express')
const helmet = require('helmet')
const mongoose = require('mongoose')
// const pino = require('pino-http')
const rateLimit = require('express-rate-limit')
const swaggerUI = require('swagger-ui-express')
const xss = require('xss-clean')
const yaml = require('yamljs')

const logger = require('./utils/logger')
const router = require('./router')
const swaggerDoc = yaml.load('./swagger.yaml')

// const whitelist = ['http://localhost:5173']
// const corsOptions = {
//   credentials: true,
//   origin: (origin, callback) => {
//     logger.info(origin)
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error())
//     }
//   },
// }

class App {
  constructor(cnf) {
    this.cnf = cnf
    this.port = cnf.port
    this.app = express()
    this._setupMiddleware()
    this.router = router
  }

  _listen() {
    this.app.listen(this.port, () => {
      logger.info(`Server listening on ${this.port}`)
    })
  }

  _setupMiddleware() {
    // security middleware
    this.app.use(helmet())
    this.app.use(xss())
    this.app.use(cors())

    this.app.use(cookieParser(this.cnf.cookieSecret))
    this.app.use(express.json({ limit: '10kb' }))
    this.app.use(express.urlencoded({ extended: true }))

    // rate limiter
    const limiter = rateLimit({
      max: 1000,
      windowMs: 60 * 60 * 1000,
      message: 'Too many requests from this client',
    })
    this.app.use('/api', limiter)

    this.app.use('/doc', swaggerUI.serve, swaggerUI.setup(swaggerDoc))

    // Uncomment to log req/res data
    // const httpLogConfig = { ...cnf.log, ...{logger }}
    // this.app.use(pino(httpLogConfig))
  }

  _setupRoutes() {
    this.app.get('/ping', (req, res) => res.send('PONG'))
    this.router.initializeRouter(this.app)
  }

  _setViewEngine() {}

  async initialize() {
    this._setupMiddleware()
    this._setViewEngine()
    this._setupRoutes()
  }

  async start() {
    try {
      await mongoose.connect(this.cnf.db.url)
      this._listen()
    } catch (err) {
      logger.error(err)
    }
  }
}

module.exports = App
