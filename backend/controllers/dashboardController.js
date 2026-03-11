import { Lead, LEAD_STATUSES } from '../models/Lead.js'
import { Visit } from '../models/Visit.js'

export async function getDashboard(req, res) {
  try {
    const totalLeads = await Lead.countDocuments()

    const byStatus = await Lead.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ])

    const map = {}
    for (const s of LEAD_STATUSES) map[s] = 0
    for (const row of byStatus) {
      map[row._id] = row.count
    }

    const visitsScheduled = await Visit.countDocuments({ outcome: 'Scheduled' })
    const visitCompleted = await Visit.countDocuments({ outcome: 'Completed' })

    return res.json({
      totalLeads,
      newLeads: map['New Lead'],
      contacted: map['Contacted'],
      visitsScheduled,
      visitCompleted,
      booked: map['Booked'],
      lost: map['Lost'],
      byStage: map,
    })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}
