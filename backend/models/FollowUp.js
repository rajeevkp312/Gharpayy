import mongoose from 'mongoose'

export const FOLLOWUP_STATUSES = ['Pending', 'Completed']

const followUpSchema = new mongoose.Schema(
  {
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lead',
      required: true,
    },
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Agent',
      required: true,
    },
    reminderDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: FOLLOWUP_STATUSES,
      default: 'Pending',
      required: true,
      trim: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  },
)

export const FollowUp = mongoose.model('FollowUp', followUpSchema)
