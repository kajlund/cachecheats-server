const { paging } = require('../../middleware/paging')
const {
  allCaches,
  createCache,
  deleteCache,
  findCacheByCode,
  findCacheById,
  findPlaceCaches,
  findUserCaches,
  updateCache,
} = require('./cache.handlers')
const { auth } = require('../../middleware/auth')

module.exports = {
  group: {
    prefix: '/caches',
    middleware: [auth],
  },
  routes: [
    {
      method: 'get',
      path: '/',
      middleware: [paging],
      handler: allCaches,
    },
    {
      method: 'get',
      path: '/user',
      middleware: [],
      handler: findUserCaches,
    },
    {
      method: 'get',
      path: '/places/:id',
      middleware: [],
      handler: findPlaceCaches,
    },
    {
      method: 'get',
      path: '/:id',
      middleware: [],
      handler: findCacheById,
    },
    {
      method: 'get',
      path: '/bygc/:gc',
      middleware: [],
      handler: findCacheByCode,
    },
    {
      method: 'post',
      path: '/',
      middleware: [],
      handler: createCache,
    },
    {
      method: 'put',
      path: '/:id',
      middleware: [],
      handler: updateCache,
    },
    {
      method: 'delete',
      path: '/:id',
      middleware: [],
      handler: deleteCache,
    },
  ],
}
