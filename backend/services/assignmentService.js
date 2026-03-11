import { Agent } from '../models/Agent.js'
import { AssignmentState } from '../models/AssignmentState.js'

export async function assignAgent() {
  const agents = await Agent.find().sort({ createdAt: 1 })

  if (!agents.length) return null

  const state = await AssignmentState.findOneAndUpdate(
    { key: 'leadRoundRobin' },
    { $setOnInsert: { lastIndex: -1 } },
    { new: true, upsert: true },
  )

  const nextIndex = (state.lastIndex + 1) % agents.length

  await AssignmentState.updateOne(
    { _id: state._id },
    { $set: { lastIndex: nextIndex } },
  )

  return agents[nextIndex]
}
