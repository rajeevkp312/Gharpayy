import mongoose from 'mongoose'
import { LeadActivity } from '../models/LeadActivity.js'

export async function getLeadActivity(req, res) {
  try {
    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid lead id' })
    }

    const activity = await LeadActivity.find({ leadId: id })
      .sort({ timestamp: 1 })
      .populate('agentId')

    return res.json(activity)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}
