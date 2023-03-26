const dotenv = require('dotenv')

// Load environment variables BEFORE setting up config
dotenv.config()

const ENV = process.env.NODE_ENV || 'development'
const envConfig = require(`./${ENV}`) || {}

const baseConfig = {
  cookieSecret: process.env.COOKIE_SECRET,
  db: {
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    port: process.env.PGPORT,
  },
  pageSize: parseInt(process.env.PAGE_SIZE) || 10,
  port: parseInt(process.env.PORT) || 8080,
  nodeEnv: ENV,
  saltRounds: parseInt(process.env.SALT_ROUNDS) || 12,
  jwtAccessTokenExpiresIn: '1d',
  jwtAccessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
  // Days to Milliseconds
  jwtCookieExpiresIn: process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
  jwtRefreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
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
