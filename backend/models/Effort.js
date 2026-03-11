import mongoose from 'mongoose'

const effortSchema = new mongoose.Schema(
  {
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Agent',
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    callsMade: {
      type: Number,
      default: 0,
      min: 0,
    },
    messagesSent: {
      type: Number,
      default: 0,
      min: 0,
    },
    visitsScheduled: {
      type: Number,
      default: 0,
      min: 0,
    },
    visitsCompleted: {
      type: Number,
      default: 0,
      min: 0,
    },
    leadsAssigned: {
      type: Number,
      default: 0,
      min: 0,
    },
    leadsContacted: {
      type: Number,
      default: 0,
      min: 0,
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

effortSchema.index({ agentId: 1, date: 1 }, { unique: true })

export const Effort = mongoose.model('Effort', effortSchema)
