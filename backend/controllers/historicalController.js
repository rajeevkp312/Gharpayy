import mongoose from 'mongoose'
import { Lead } from '../models/Lead.js'
import { Booking } from '../models/Booking.js'
import { Visit } from '../models/Visit.js'
import { FollowUp } from '../models/FollowUp.js'

export async function getHistorical(req, res) {
  try {
    const { dateFrom, dateTo, agentId, type } = req.query

    const dateFilter = {}
    if (dateFrom || dateTo) {
      dateFilter.createdAt = {}
      if (dateFrom) dateFilter.createdAt.$gte = new Date(dateFrom)
      if (dateTo) dateFilter.createdAt.$lte = new Date(dateTo + 'T23:59:59.999Z')
    }

    const agentFilter = agentId && mongoose.Types.ObjectId.isValid(agentId)
      ? { assignedAgent: new mongoose.Types.ObjectId(agentId) }
      : {}

    const results = []

    if (!type || type === 'leads') {
      const leads = await Lead.find({ ...dateFilter, ...agentFilter })
        .sort({ createdAt: -1 })
        .populate('assignedAgent')
        .lean()
      results.push(...leads.map((l) => ({
        type: 'Lead',
        date: l.createdAt,
        title: l.name,
        subtitle: `${l.phone} · ${l.status}`,
        agent: l.assignedAgent?.name || '-',
        status: l.status,
        source: l.source,
      })))
    }

    if (!type || type === 'bookings') {
      const bookings = await Booking.find(dateFilter)
        .sort({ createdAt: -1 })
        .populate('leadId')
        .lean()
      results.push(...bookings.map((b) => ({
        type: 'Booking',
        date: b.createdAt,
        title: b.propertyName,
        subtitle: `₹${(b.amount || 0).toLocaleString()} · ${b.status}`,
        agent: '-',
        status: b.status,
        source: b.leadId?.source || '-',
      })))
    }

    if (!type || type === 'visits') {
      const visits = await Visit.find(dateFilter)
        .sort({ createdAt: -1 })
        .populate('agentId')
        .lean()
      results.push(...visits.map((v) => ({
        type: 'Visit',
        date: v.createdAt,
        title: v.propertyName,
        subtitle: `${v.visitDate} ${v.visitTime} · ${v.outcome}`,
        agent: v.agentId?.name || '-',
        status: v.outcome,
        source: '-',
      })))
    }

    results.sort((a, b) => new Date(b.date) - new Date(a.date))

    return res.json(results)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

export async function exportHistorical(req, res) {
  try {
    const { dateFrom, dateTo, type } = req.query

    const dateFilter = {}
    if (dateFrom || dateTo) {
      dateFilter.createdAt = {}
      if (dateFrom) dateFilter.createdAt.$gte = new Date(dateFrom)
      if (dateTo) dateFilter.createdAt.$lte = new Date(dateTo + 'T23:59:59.999Z')
    }

    let csv = 'Type,Date,Title,Subtitle,Agent,Status,Source\n'

    if (!type || type === 'leads') {
      const leads = await Lead.find(dateFilter).populate('assignedAgent').lean()
      leads.forEach((l) => {
        csv += `Lead,"${new Date(l.createdAt).toISOString()}","${l.name}","${l.phone} · ${l.status}","${l.assignedAgent?.name || '-'}",${l.status},${l.source}\n`
      })
    }

    if (!type || type === 'bookings') {
      const bookings = await Booking.find(dateFilter).populate('leadId').lean()
      bookings.forEach((b) => {
        csv += `Booking,"${new Date(b.createdAt).toISOString()}","${b.propertyName}","₹${(b.amount || 0).toLocaleString()} · ${b.status}",-,${b.status},${b.leadId?.source || '-'}\n`
      })
    }

    if (!type || type === 'visits') {
      const visits = await Visit.find(dateFilter).populate('agentId').lean()
      visits.forEach((v) => {
        csv += `Visit,"${new Date(v.createdAt).toISOString()}","${v.propertyName}","${v.visitDate} ${v.visitTime} · ${v.outcome}","${v.agentId?.name || '-'}",${v.outcome},-\n`
      })
    }

    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', 'attachment; filename="historical-report.csv"')
    return res.send(csv)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}
