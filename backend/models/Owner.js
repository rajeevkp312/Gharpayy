import mongoose from 'mongoose'

const ownerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      default: '',
    },
    city: {
      type: String,
      trim: true,
      default: '',
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  },
)

ownerSchema.index({ name: 'text', phone: 'text', email: 'text', city: 'text' })

export const Owner = mongoose.model('Owner', ownerSchema)
