import mongoose from 'mongoose'

const messageThreadSchema = new mongoose.Schema(
  {
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lead',
      required: true,
    },
    lastMessageAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  },
)

messageThreadSchema.index({ leadId: 1 }, { unique: true })

export const MessageThread = mongoose.model('MessageThread', messageThreadSchema)
