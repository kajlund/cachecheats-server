const dotenv = require('dotenv')

// Load environment variables BEFORE setting up config
dotenv.config()

const ENV = process.env.NODE_ENV || 'development'
const envConfig = require(`./${ENV}`) || {}

const baseConfig = {
  cookieSecret: process.env.COOKIE_SECRET,
  db: {
    url: process.env.MONGO_URI,
  },
  pageSize: parseInt(process.env.PAGE_SIZE) || 10,
  port: parseInt(process.env.PORT) || 8080,
  nodeEnv: ENV,
  saltRounds: parseInt(process.env.SALT_ROUNDS) || 12,
  jwtAccessTokenExpiresIn: '1d',
  jwtAccessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
  // Days to seconds
  jwtCookieExpiresIn: process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000,
  log: {
    level: 'debug',
  },
  mail: {
    connection: process.env.MAIL_CONNECTION || 'smtp',
    from: process.env.MAIL_FROM,
    smtp: {
      driver: 'smtp',
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    },
  },
}

const config = { ...baseConfig, ...envConfig }

module.exports = config
