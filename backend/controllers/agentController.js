import { Agent } from '../models/Agent.js'
import { Lead } from '../models/Lead.js'
import { Visit } from '../models/Visit.js'

export async function getAgents(req, res) {
  try {
    const agents = await Agent.find().sort({ createdAt: 1 })
    return res.json(agents)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

export async function getAgentPerformance(req, res) {
  try {
    const agents = await Agent.find().sort({ createdAt: 1 })

    const leadsAgg = await Lead.aggregate([
      { $match: { assignedAgent: { $ne: null } } },
      { $group: { _id: '$assignedAgent', totalLeads: { $sum: 1 } } },
    ])

    const contactedAgg = await Lead.aggregate([
      { $match: { assignedAgent: { $ne: null }, status: { $ne: 'New Lead' } } },
      { $group: { _id: '$assignedAgent', leadsContacted: { $sum: 1 } } },
    ])

    const bookedAgg = await Lead.aggregate([
      { $match: { assignedAgent: { $ne: null }, status: 'Booked' } },
      { $group: { _id: '$assignedAgent', bookings: { $sum: 1 } } },
    ])

    const visitsAgg = await Visit.aggregate([
      { $group: { _id: '$agentId', visitsScheduled: { $sum: 1 } } },
    ])

    const map = new Map()
    for (const row of leadsAgg) map.set(String(row._id), { totalLeads: row.totalLeads })
    for (const row of contactedAgg) {
      const key = String(row._id)
      map.set(key, { ...(map.get(key) || {}), leadsContacted: row.leadsContacted })
    }
    for (const row of bookedAgg) {
      const key = String(row._id)
      map.set(key, { ...(map.get(key) || {}), bookings: row.bookings })
    }
    for (const row of visitsAgg) {
      const key = String(row._id)
      map.set(key, { ...(map.get(key) || {}), visitsScheduled: row.visitsScheduled })
    }

    const result = agents
      .map((a) => {
        const metrics = map.get(String(a._id)) || {}
        return {
          agentId: a._id,
          agentName: a.name,
          totalLeads: metrics.totalLeads || 0,
          leadsContacted: metrics.leadsContacted || 0,
          visitsScheduled: metrics.visitsScheduled || 0,
          bookings: metrics.bookings || 0,
        }
      })
      .sort((x, y) => y.bookings - x.bookings)

    return res.json(result)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}
