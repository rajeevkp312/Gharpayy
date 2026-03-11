import mongoose from 'mongoose'

export const BED_TYPES = ['Single', 'Double', 'Bunk Upper', 'Bunk Lower', 'Queen', 'King']
export const BED_STATUSES = ['Available', 'Occupied', 'Maintenance', 'Reserved', 'Blocked']

const pricingRuleSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    durationMonths: { type: Number, default: 1 },
    rent: { type: Number, required: true },
    deposit: { type: Number, default: 0 },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true },
)

const bedSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
      index: true,
    },
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
    bedType: {
      type: String,
      enum: BED_TYPES,
      default: 'Single',
    },
    status: {
      type: String,
      enum: BED_STATUSES,
      default: 'Available',
    },
    baseRent: {
      type: Number,
      required: true,
      min: 0,
    },
    deposit: {
      type: Number,
      default: 0,
      min: 0,
    },
    pricingRules: {
      type: [pricingRuleSchema],
      default: [],
    },
    currentBookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      default: null,
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

bedSchema.index({ propertyId: 1, status: 1 })
bedSchema.index({ roomId: 1, name: 1 })

export const Bed = mongoose.model('Bed', bedSchema)
