import { Lead, LEAD_STATUSES } from '../models/Lead.js'

export async function getPipeline(req, res) {
  try {
    const leads = await Lead.find()
      .sort({ createdAt: -1 })
      .populate('assignedAgent')

    const grouped = {}
    for (const status of LEAD_STATUSES) {
      grouped[status] = []
    }

    for (const lead of leads) {
      if (!grouped[lead.status]) grouped[lead.status] = []
      grouped[lead.status].push(lead)
    }

    return res.json(grouped)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}
