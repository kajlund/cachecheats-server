const { deleteUser, getAllUsers, getUserById, updateUser } = require('./user.controller')
const { auth, admin } = require('../../middleware/auth')

module.exports = {
  group: {
    prefix: '/users',
    middleware: [auth], // auth all routes
  },
  routes: [
    {
      method: 'get',
      path: '/',
      middleware: [admin],
      handler: getAllUsers,
    },
    {
      method: 'get',
      path: '/:id',
      middleware: [],
      handler: getUserById,
    },
    {
      method: 'put',
      path: '/:id',
      middleware: [admin],
      handler: updateUser,
    },
    {
      method: 'delete',
      path: '/:id',
      middleware: [admin],
      handler: deleteUser,
    },
  ],
}
