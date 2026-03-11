import cron from 'node-cron'
import { Lead } from '../models/Lead.js'
import { FollowUp } from '../models/FollowUp.js'
import { logLeadActivity } from './activityService.js'

export function startReminderScheduler() {
  cron.schedule('0 * * * *', async () => {
    const now = new Date()
    const cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000)

    const leads = await Lead.find({
      updatedAt: { $lte: cutoff },
      status: { $nin: ['Booked', 'Lost'] },
      assignedAgent: { $ne: null },
    }).select('_id assignedAgent updatedAt')

    for (const lead of leads) {
      const existing = await FollowUp.findOne({
        leadId: lead._id,
        status: 'Pending',
      })

      if (existing) continue

      await FollowUp.create({
        leadId: lead._id,
        agentId: lead.assignedAgent,
        reminderDate: now,
        status: 'Pending',
      })

      await logLeadActivity({
        leadId: lead._id,
        agentId: lead.assignedAgent,
        activityType: 'Follow-up Reminder',
        description: 'Follow-up reminder created due to inactivity > 24h',
      })
    }
  })
}
