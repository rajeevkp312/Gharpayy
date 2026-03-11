import { LeadActivity } from '../models/LeadActivity.js'

export async function logLeadActivity({ leadId, agentId = null, activityType, description }) {
  if (!leadId || !activityType || !description) return

  await LeadActivity.create({
    leadId,
    agentId,
    activityType,
    description,
    timestamp: new Date(),
  })
}
