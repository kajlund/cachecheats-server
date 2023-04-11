const { NotFoundError } = require('../../utils/errors')
const { statusCodes } = require('../../utils/statuscodes')
const Cache = require('./cache.model')
const Place = require('../places/place.model')

const populate = [
  { path: 'place', model: 'Place', select: 'name' },
  { path: 'user', model: 'User', select: 'name' },
]

exports.allCaches = async (req, res) => {
  const caches = await Cache.find().limit(req.paging.limit).skip(req.paging.skip).populate(populate).sort('-updatedAt')

  res.status(statusCodes.OK).json({
    success: true,
    message: 'List caches',
    page: req.paging.page,
    limit: req.paging.limit,
    caches,
  })
}

exports.createCache = async (req, res) => {
  const { gc, kind, name, coords, verified, comments, place, user } = req.body
  const cache = await Cache.create({ gc, kind, name, coords, verified, comments, place, user })

  res.status(statusCodes.OK).json({
    success: true,
    message: `Created cache ${cache.gc}`,
    cache,
  })
}

exports.deleteCache = async (req, res) => {
  const cache = await Cache.findByIdAndDelete(req.params.id)
  if (!cache) {
    throw new NotFoundError(`No cache with id ${req.params.id}`)
  }

  res.status(statusCodes.OK).json({
    success: true,
    message: `Deleted cache ${cache.gc}`,
    cache,
  })
}

exports.findByCode = async (req, res) => {
  const cache = await Cache.findOne({ gc: req.params.gc }).populate(populate)
  if (!cache) throw new NotFoundError()

  res.status(statusCodes.OK).json({
    success: true,
    message: `Found cache ${cache.gc}`,
    cache,
  })
}

exports.findCacheById = async (req, res) => {
  const cache = await Cache.findById(req.params.id).populate(populate)
  if (!cache) throw new NotFoundError()

  res.status(statusCodes.OK).json({
    success: true,
    message: `Found cache ${cache.gc}`,
    cache,
  })
}

exports.findPlaceCaches = async (req, res) => {
  const place = await Place.findById(req.params.id)
  const caches = await Cache.find({ place: req.params.id }).populate(populate)

  res.status(statusCodes.OK).json({
    success: true,
    message: `Caches for ${place.name}`,
    count: caches.length,
    caches: caches,
  })
}

exports.findUserCaches = async (req, res) => {
  const caches = await Cache.find({ user: req.user.id }).populate(populate)

  res.status(statusCodes.OK).json({
    success: true,
    message: `Caches belonging to you`,
    count: caches.length,
    caches: caches,
  })
}

exports.updateCache = async (req, res) => {
  const { gc, kind, name, coords, verified, comments, place } = req.body

  const cache = await Cache.findByIdAndUpdate(
    req.params.id,
    { gc, kind, name, coords, verified, comments, place, user: req.user._id },
    { new: true, runValidators: true }
  )
  if (!cache) throw new NotFoundError(`No cache with id ${req.params.id}`)

  res.status(statusCodes.OK).json({
    success: true,
    message: `Updated cache ${cache.gc}`,
    cache,
  })
}
