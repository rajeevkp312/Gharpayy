import mongoose from 'mongoose'

export const VISIT_OUTCOMES = ['Scheduled', 'Completed', 'Cancelled', 'No Show']

const visitSchema = new mongoose.Schema(
  {
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lead',
      required: true,
    },
    propertyName: {
      type: String,
      required: true,
      trim: true,
    },
    visitDate: {
      type: String,
      required: true,
      trim: true,
    },
    visitTime: {
      type: String,
      required: true,
      trim: true,
    },
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Agent',
      required: true,
    },
    outcome: {
      type: String,
      enum: VISIT_OUTCOMES,
      default: 'Scheduled',
      trim: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  },
)

export const Visit = mongoose.model('Visit', visitSchema)
