const mongoose = require('mongoose')

const PlaceSchema = new mongoose.Schema(
  {
    code: {
      type: Number,
      min: [1, `The value of path {PATH} ({VALUE}) is beneath the limit ({MIN}).`],
      max: [999, `The value of path {PATH} ({VALUE}) exceeds the limit ({MAX}).`],
    },
    name: {
      type: String,
      required: [true, 'Please provide a name between 2 and 200 characters'],
      maxlength: 200,
      minlength: 2,
    },
    token: String,
  },
  { timestamps: true }
)

module.exports = mongoose.model('Place', PlaceSchema)
