const { BadRequestError, UnauthorizedError } = require('../../utils/errors')
const { statusCodes } = require('../../utils/statuscodes')
const User = require('../users/user.model')

exports.login = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    throw new BadRequestError('Please provide email and password')
  }
  const user = await User.findOne({ email })
  if (!user) {
    throw new UnauthorizedError('Invalid Credentials')
  }
  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new UnauthorizedError('Invalid Credentials')
  }
  const token = user.createJWT()
  res.status(statusCodes.OK).json({
    token,
    user: { name: user.name, email: user.email, role: user.role },
  })
}

exports.register = async (req, res) => {
  const { name, email, password } = req.body
  const user = await User.create({ name, email, password })
  const token = user.createJWT()
  res.status(statusCodes.CREATED).json({
    token,
    user: { name: user.name, email: user.email, role: user.role },
  })
}
