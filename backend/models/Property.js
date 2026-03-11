import mongoose from 'mongoose'

export const PROPERTY_STATUSES = ['Active', 'Inactive', 'Maintenance', 'Coming Soon']
export const PROPERTY_TYPES = ['PG', 'Hostel', 'Co-living', 'Apartment', 'Independent']

const propertySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: PROPERTY_TYPES,
      default: 'PG',
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
      default: '',
    },
    pincode: {
      type: String,
      trim: true,
      default: '',
    },
    geo: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
    },
    amenities: {
      type: [String],
      default: [],
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Owner',
      default: null,
    },
    status: {
      type: String,
      enum: PROPERTY_STATUSES,
      default: 'Active',
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
    rules: {
      type: [String],
      default: [],
    },
    nearbyPlaces: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  },
)

propertySchema.index({ name: 'text', address: 'text', city: 'text' })

export const Property = mongoose.model('Property', propertySchema)
