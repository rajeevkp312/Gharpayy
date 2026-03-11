import mongoose from 'mongoose'
import { Effort } from '../models/Effort.js'

export async function listEfforts(req, res) {
  try {
    const { agentId, dateFrom, dateTo } = req.query

    const filter = {}
    if (agentId && mongoose.Types.ObjectId.isValid(agentId)) filter.agentId = agentId
    if (dateFrom || dateTo) {
      filter.date = {}
      if (dateFrom) filter.date.$gte = dateFrom
      if (dateTo) filter.date.$lte = dateTo
    }

    const rows = await Effort.find(filter)
      .sort({ date: -1 })
      .populate('agentId')
      .lean()

    const result = rows.map((e) => ({
      ...e,
      agent: e.agentId,
      agentId: e.agentId?._id ?? e.agentId,
    }))

    return res.json(result)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

export async function upsertEffort(req, res) {
  try {
    const { agentId, date, ...metrics } = req.body || {}

    if (!agentId) return res.status(400).json({ message: 'agentId is required' })
    if (!date) return res.status(400).json({ message: 'date is required' })
    if (!mongoose.Types.ObjectId.isValid(agentId)) {
      return res.status(400).json({ message: 'Invalid agentId' })
    }

    const payload = {
      agentId,
      date,
      callsMade: Number(metrics.callsMade || 0),
      messagesSent: Number(metrics.messagesSent || 0),
      visitsScheduled: Number(metrics.visitsScheduled || 0),
      visitsCompleted: Number(metrics.visitsCompleted || 0),
      leadsAssigned: Number(metrics.leadsAssigned || 0),
      leadsContacted: Number(metrics.leadsContacted || 0),
      notes: metrics.notes || '',
    }

    const updated = await Effort.findOneAndUpdate(
      { agentId, date },
      payload,
      { new: true, upsert: true },
    )
      .populate('agentId')
      .lean()

    return res.status(201).json({
      ...updated,
      agent: updated.agentId,
      agentId: updated.agentId?._id ?? updated.agentId,
    })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

export async function deleteEffort(req, res) {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid effort id' })
    }

    const deleted = await Effort.findByIdAndDelete(id)
    if (!deleted) return res.status(404).json({ message: 'Effort entry not found' })

    return res.json({ ok: true })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}
