const { allPlaces, findPlaceById, createPlace, updatePlace, deletePlace } = require('./place.handlers')
const { auth, admin } = require('../../middleware/auth')

module.exports = {
  group: {
    prefix: '/places',
    middleware: [auth], // Require auth for all routes
  },
  routes: [
    {
      method: 'get',
      path: '/',
      middleware: [],
      handler: allPlaces,
    },
    {
      method: 'get',
      path: '/:id',
      middleware: [],
      handler: findPlaceById,
    },
    {
      method: 'post',
      path: '/',
      middleware: [admin],
      handler: createPlace,
    },
    {
      method: 'put',
      path: '/:id',
      middleware: [admin],
      handler: updatePlace,
    },
    {
      method: 'delete',
      path: '/:id',
      middleware: [admin],
      handler: deletePlace,
    },
  ],
}
