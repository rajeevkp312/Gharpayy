import mongoose from 'mongoose'

export const ACTIVITY_TYPES = [
  'Lead Created',
  'Agent Assigned',
  'Status Updated',
  'Visit Scheduled',
  'Visit Completed',
  'Follow-up Reminder',
]

const leadActivitySchema = new mongoose.Schema(
  {
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lead',
      required: true,
    },
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Agent',
      default: null,
    },
    activityType: {
      type: String,
      enum: ACTIVITY_TYPES,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    timestamp: {
      type: Date,
      required: true,
      default: () => new Date(),
    },
  },
  {
    timestamps: false,
  },
)

export const LeadActivity = mongoose.model('LeadActivity', leadActivitySchema)
