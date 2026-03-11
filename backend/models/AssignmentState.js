import mongoose from 'mongoose'

const assignmentStateSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    lastIndex: {
      type: Number,
      required: true,
      default: -1,
      min: -1,
    },
  },
  { timestamps: true },
)

export const AssignmentState = mongoose.model('AssignmentState', assignmentStateSchema)
