const { login, register } = require('./auth.controller')

module.exports = {
  group: {
    prefix: '',
    middleware: [],
  },
  routes: [
    {
      method: 'post',
      path: '/login',
      middleware: [],
      handler: login,
    },
    {
      method: 'post',
      path: '/register',
      middleware: [],
      handler: register,
    },
  ],
}
