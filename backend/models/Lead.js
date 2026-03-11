import mongoose from 'mongoose'

export const LEAD_STATUSES = [
  'New Lead',
  'Contacted',
  'Requirement Collected',
  'Property Suggested',
  'Visit Scheduled',
  'Visit Completed',
  'Booked',
  'Lost',
]

const leadSchema = new mongoose.Schema(
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
    source: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      default: 'New Lead',
      enum: LEAD_STATUSES,
      trim: true,
    },
    assignedAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Agent',
      default: null,
    },
    integration: {
      type: String,
      default: null,
      trim: true,
    },
    rawPayload: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  },
)

export const Lead = mongoose.model('Lead', leadSchema)
