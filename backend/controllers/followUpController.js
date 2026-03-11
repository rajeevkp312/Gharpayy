import mongoose from 'mongoose'
import { FollowUp, FOLLOWUP_STATUSES } from '../models/FollowUp.js'

export async function getFollowUps(req, res) {
  try {
    const followups = await FollowUp.find()
      .sort({ reminderDate: -1 })
      .populate('leadId')
      .populate('agentId')

    return res.json(followups)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

export async function updateFollowUpStatus(req, res) {
  try {
    const { id } = req.params
    const { status } = req.body || {}

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid followup id' })
    }

    if (!status) {
      return res.status(400).json({ message: 'status is required' })
    }

    if (!FOLLOWUP_STATUSES.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' })
    }

    const updated = await FollowUp.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true, runValidators: true },
    )
      .populate('leadId')
      .populate('agentId')

    if (!updated) {
      return res.status(404).json({ message: 'FollowUp not found' })
    }

    return res.json(updated)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}
