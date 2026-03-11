import mongoose from 'mongoose'
import { Visit, VISIT_OUTCOMES } from '../models/Visit.js'
import { Lead } from '../models/Lead.js'
import { logLeadActivity } from '../services/activityService.js'

export async function createVisit(req, res) {
  try {
    const { leadId, propertyName, visitDate, visitTime, agentId } = req.body || {}

    if (!leadId || !propertyName || !visitDate || !visitTime || !agentId) {
      return res.status(400).json({
        message: 'leadId, propertyName, visitDate, visitTime, agentId are required',
      })
    }

    if (!mongoose.isValidObjectId(leadId)) {
      return res.status(400).json({ message: 'Invalid leadId' })
    }

    if (!mongoose.isValidObjectId(agentId)) {
      return res.status(400).json({ message: 'Invalid agentId' })
    }

    const visit = await Visit.create({
      leadId,
      propertyName,
      visitDate,
      visitTime,
      agentId,
      outcome: 'Scheduled',
    })

    await Lead.updateOne(
      { _id: leadId },
      { $set: { status: 'Visit Scheduled' } },
    )

    await logLeadActivity({
      leadId,
      agentId,
      activityType: 'Visit Scheduled',
      description: `Visit scheduled for ${propertyName} on ${visitDate} at ${visitTime}`,
    })

    return res.status(201).json(visit)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

export async function getVisits(req, res) {
  try {
    const visits = await Visit.find()
      .sort({ createdAt: -1 })
      .populate('leadId')
      .populate('agentId')

    return res.json(visits)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

export async function updateVisitOutcome(req, res) {
  try {
    const { id } = req.params
    const { outcome } = req.body || {}

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid visit id' })
    }

    if (!outcome) {
      return res.status(400).json({ message: 'outcome is required' })
    }

    if (!VISIT_OUTCOMES.includes(outcome)) {
      return res.status(400).json({ message: 'Invalid outcome value' })
    }

    const visit = await Visit.findByIdAndUpdate(
      id,
      { $set: { outcome } },
      { new: true, runValidators: true },
    )

    if (!visit) {
      return res.status(404).json({ message: 'Visit not found' })
    }

    if (outcome === 'Completed') {
      await Lead.updateOne(
        { _id: visit.leadId },
        { $set: { status: 'Visit Completed' } },
      )

      await logLeadActivity({
        leadId: visit.leadId,
        agentId: visit.agentId,
        activityType: 'Visit Completed',
        description: 'Visit marked as completed',
      })
    }

    const populated = await Visit.findById(visit._id)
      .populate('leadId')
      .populate('agentId')

    return res.json(populated)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}
