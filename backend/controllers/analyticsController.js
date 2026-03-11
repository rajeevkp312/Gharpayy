import mongoose from 'mongoose'
import { Lead } from '../models/Lead.js'
import { Booking } from '../models/Booking.js'
import { Visit } from '../models/Visit.js'
import { Agent } from '../models/Agent.js'

export async function getAnalytics(req, res) {
  try {
    const { dateFrom, dateTo } = req.query

    const dateFilter = {}
    if (dateFrom || dateTo) {
      dateFilter.createdAt = {}
      if (dateFrom) dateFilter.createdAt.$gte = new Date(dateFrom)
      if (dateTo) dateFilter.createdAt.$lte = new Date(dateTo + 'T23:59:59.999Z')
    }

    const [
      leadsByStatus,
      leadsBySource,
      bookingsByStatus,
      visitOutcomes,
      agentPerformance,
      conversionFunnel,
    ] = await Promise.all([
      Lead.aggregate([
        { $match: dateFilter },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Lead.aggregate([
        { $match: dateFilter },
        { $group: { _id: '$source', count: { $sum: 1 } } },
      ]),
      Booking.aggregate([
        { $match: dateFilter },
        { $group: { _id: '$status', count: { $sum: 1 }, revenue: { $sum: '$amount' } } },
      ]),
      Visit.aggregate([
        { $match: dateFilter },
        { $group: { _id: '$outcome', count: { $sum: 1 } } },
      ]),
      Agent.aggregate([
        {
          $lookup: {
            from: 'leads',
            localField: '_id',
            foreignField: 'assignedAgent',
            as: 'assignedLeads',
          },
        },
        {
          $project: {
            name: 1,
            leadsAssigned: { $size: '$assignedLeads' },
          },
        },
      ]),
      Promise.all([
        Lead.countDocuments(dateFilter),
        Booking.countDocuments({ ...dateFilter, status: 'Confirmed' }),
        Visit.countDocuments({ ...dateFilter, outcome: 'Completed' }),
      ]),
    ])

    const totalLeads = leadsByStatus.reduce((sum, s) => sum + s.count, 0)
    const totalBookings = bookingsByStatus.reduce((sum, b) => sum + b.count, 0)
    const totalRevenue = bookingsByStatus.reduce((sum, b) => sum + (b.revenue || 0), 0)

    return res.json({
      kpis: {
        totalLeads,
        totalBookings,
        totalRevenue,
        conversionRate: totalLeads > 0 ? ((totalBookings / totalLeads) * 100).toFixed(1) : 0,
        visitsCompleted: conversionFunnel[2] || 0,
      },
      leadsByStatus: leadsByStatus.map((s) => ({ name: s._id, value: s.count })),
      leadsBySource: leadsBySource.map((s) => ({ name: s._id, value: s.count })),
      bookingsByStatus: bookingsByStatus.map((b) => ({
        name: b._id,
        count: b.count,
        revenue: b.revenue || 0,
      })),
      visitOutcomes: visitOutcomes.map((v) => ({ name: v._id, value: v.count })),
      agentPerformance: agentPerformance.map((a) => ({
        name: a.name,
        leads: a.leadsAssigned,
      })),
    })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}
