module.exports = {
  log: {
    level: 'trace',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    },
  },
}
