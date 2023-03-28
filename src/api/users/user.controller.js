const { NotFoundError } = require('../../utils/errors')
const { statusCodes } = require('../../utils/statuscodes')

const User = require('./user.model')

exports.deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id)
  if (!user) {
    throw new NotFoundError(`No user with id ${req.params.id}`)
  }
  res.status(statusCodes.NO_CONTENT).json({})
}

exports.getAllUsers = async (req, res) => {
  const users = await User.find().sort('name').select('-password')
  res.status(statusCodes.OK).json({
    users,
  })
}

exports.getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password')
  if (!user) {
    throw new NotFoundError(`No user with id ${req.params.id}`)
  }
  res.status(statusCodes.OK).json({ user })
}

exports.updateUser = async (req, res) => {
  const { name, email, role } = req.body
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { name, email, role },
    { new: true, runValidators: true }
  ).select('-password')
  res.status(statusCodes.OK).json({ user })
}
