import { Lead } from '../models/Lead.js'
import { assignAgent } from '../services/assignmentService.js'
import { Agent } from '../models/Agent.js'
import { logLeadActivity } from '../services/activityService.js'

export async function createPublicLead(req, res) {
  try {
    const { name, phone, source } = req.body || {}

    if (!name || !phone || !source) {
      return res
        .status(400)
        .json({ success: false, message: 'name, phone, source are required' })
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

      await Agent.updateOne(
        { _id: assignedAgent._id },
        { $inc: { activeLeads: 1 } },
      )
    }

    return res.status(201).json({
      success: true,
      message: 'Lead created successfully',
    })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}
