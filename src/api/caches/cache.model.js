const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CACHETYPES = [
  'TRADITIONAL',
  'MYSTERY',
  'MULTI',
  'EARTH',
  'LETTERBOX',
  'EVENT',
  'CITO',
  'MEGA',
  'GIGA',
  'WHERIGO',
  'HQ',
  'LAB',
  'VIRTUAL',
  'WEBCAM',
]

const cacheSchema = new Schema(
  {
    gc: {
      required: [true, 'A geocache must have a unique GC-code'],
      trim: true,
      type: String,
      unique: true,
    },
    kind: {
      type: String,
      enum: CACHETYPES,
      required: true,
    },
    name: {
      required: [true, 'A geocache must have a name'],
      trim: true,
      type: String,
    },
    coords: {
      trim: true,
      type: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    comments: {
      type: String,
      default: '',
    },
    place: {
      type: Schema.Types.ObjectId,
      ref: 'Place',
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Cache', cacheSchema)
