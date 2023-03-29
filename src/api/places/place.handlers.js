const { NotFoundError } = require('../../utils/errors')
const { statusCodes } = require('../../utils/statuscodes')
const Place = require('./place.model')

exports.allPlaces = async (req, res) => {
  const places = await Place.find().sort('code')
  res.status(statusCodes.OK).json({
    places,
  })
}

exports.createPlace = async (req, res) => {
  let { code, name } = req.body
  code = code * 1
  const place = await Place.create({ code, name })
  res.status(statusCodes.OK).json({
    place,
  })
}

exports.deletePlace = async (req, res) => {
  const place = await Place.findByIdAndDelete(req.params.id)
  if (!place) {
    throw new NotFoundError(`No place with id ${req.params.id}`)
  }
  res.status(statusCodes.NO_CONTENT).json({})
}

exports.findPlaceById = async (req, res) => {
  const place = await Place.findById(req.params.id)
  if (!place) throw new NotFoundError()
  res.status(statusCodes.OK).json({
    place,
  })
}

exports.updatePlace = async (req, res) => {
  let { code, name } = req.body
  code = code * 1
  const place = await Place.findByIdAndUpdate(req.params.id, { code, name }, { new: true, runValidators: true })
  if (!place) throw new NotFoundError(`No place with id ${req.params.id}`)
  res.status(statusCodes.OK).json({
    place,
  })
}
