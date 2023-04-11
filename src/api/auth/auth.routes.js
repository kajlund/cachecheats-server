const { checkSession, login, register } = require('./auth.controller')
const { auth } = require('../../middleware/auth')

module.exports = {
  group: {
    prefix: '',
    middleware: [],
  },
  routes: [
    {
      method: 'get',
      path: '/auth',
      middleware: [auth],
      handler: checkSession,
    },
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
