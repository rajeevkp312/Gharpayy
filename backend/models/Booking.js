import mongoose from 'mongoose'

export const BOOKING_STATUSES = ['Pending', 'Confirmed', 'Cancelled', 'Completed']

const bookingSchema = new mongoose.Schema(
  {
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lead',
      required: true,
      index: true,
    },
    propertyName: {
      type: String,
      required: true,
      trim: true,
    },
    roomName: {
      type: String,
      trim: true,
      default: '',
    },
    bedName: {
      type: String,
      trim: true,
      default: '',
    },
    startDate: {
      type: String,
      required: true,
      trim: true,
    },
    endDate: {
      type: String,
      trim: true,
      default: '',
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentStatus: {
      type: String,
      enum: ['Unpaid', 'Partial', 'Paid'],
      default: 'Unpaid',
      trim: true,
    },
    status: {
      type: String,
      enum: BOOKING_STATUSES,
      default: 'Pending',
      trim: true,
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

export const Booking = mongoose.model('Booking', bookingSchema)
