import mongoose from 'mongoose'
import { Lead } from '../models/Lead.js'
import { assignAgent } from '../services/assignmentService.js'
import { Agent } from '../models/Agent.js'
import { logLeadActivity } from '../services/activityService.js'

export async function createLead(req, res) {
  try {
    const { name, phone, source } = req.body || {}

    if (!name || !phone) {
      return res.status(400).json({ message: 'name and phone are required' })
    }

    if (!source) {
      return res.status(400).json({ message: 'source is required' })
    }

    const assignedAgent = await assignAgent()

    const lead = await Lead.create({
      name,
      phone,
      source,
      status: 'New Lead',
      assignedAgent: assignedAgent?._id ?? null,
    })

    await logLeadActivity({
      leadId: lead._id,
      agentId: assignedAgent?._id ?? null,
      activityType: 'Lead Created',
      description: `Lead captured from ${source}`,
    })

    if (assignedAgent) {
      await logLeadActivity({
        leadId: lead._id,
        agentId: assignedAgent._id,
        activityType: 'Agent Assigned',
        description: `Assigned to ${assignedAgent.name}`,
      })
    }

    if (assignedAgent) {
      await Agent.updateOne(
        { _id: assignedAgent._id },
        { $inc: { activeLeads: 1 } },
      )
    }

    const populated = await Lead.findById(lead._id).populate('assignedAgent')
    return res.status(201).json(populated)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

export async function getLeads(req, res) {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 }).populate('assignedAgent')
    return res.json(leads)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

export async function updateLeadStatus(req, res) {
  try {
    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid lead id' })
    }

    const { status } = req.body || {}

    if (!status) {
      return res.status(400).json({ message: 'status is required' })
    }

    const before = await Lead.findById(id)

    const updated = await Lead.findByIdAndUpdate(
      id,
      { $set: { status } },
      {
        new: true,
        runValidators: true,
      },
    ).populate('assignedAgent')

    if (!updated) {
      return res.status(404).json({ message: 'Lead not found' })
    }

    await logLeadActivity({
      leadId: updated._id,
      agentId: updated.assignedAgent?._id ?? null,
      activityType: 'Status Updated',
      description: before?.status
        ? `Status changed: ${before.status} → ${updated.status}`
        : `Status updated to ${updated.status}`,
    })

    return res.json(updated)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}
