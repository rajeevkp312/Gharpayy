import mongoose from 'mongoose'

export const ROOM_TYPES = ['Single', 'Double', 'Triple', 'Quad', 'Dormitory', 'Studio', 'Suite']

const roomSchema = new mongoose.Schema(
  {
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    floor: {
      type: String,
      trim: true,
      default: '1',
    },
    roomType: {
      type: String,
      enum: ROOM_TYPES,
      default: 'Double',
    },
    amenities: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  },
)

roomSchema.index({ propertyId: 1, name: 1 })

export const Room = mongoose.model('Room', roomSchema)
