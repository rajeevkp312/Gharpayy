import mongoose from 'mongoose'
import { MessageThread } from '../models/MessageThread.js'
import { Message } from '../models/Message.js'

export async function listThreads(req, res) {
  try {
    const threads = await MessageThread.find()
      .sort({ lastMessageAt: -1, updatedAt: -1 })
      .populate('leadId')
      .lean()

    const ids = threads.map((t) => t._id)

    const lastMessages = await Message.aggregate([
      { $match: { threadId: { $in: ids } } },
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: '$threadId',
          message: { $first: '$$ROOT' },
        },
      },
    ])

    const lastByThread = new Map(
      lastMessages.map((x) => [String(x._id), x.message]),
    )

    const result = threads.map((t) => ({
      ...t,
      lead: t.leadId,
      leadId: t.leadId?._id ?? t.leadId,
      lastMessage: lastByThread.get(String(t._id)) || null,
    }))

    return res.json(result)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

export async function createOrGetThread(req, res) {
  try {
    const { leadId } = req.body || {}

    if (!leadId) {
      return res.status(400).json({ message: 'leadId is required' })
    }

    if (!mongoose.Types.ObjectId.isValid(leadId)) {
      return res.status(400).json({ message: 'Invalid leadId' })
    }

    const thread = await MessageThread.findOneAndUpdate(
      { leadId },
      { $setOnInsert: { leadId } },
      { new: true, upsert: true },
    ).populate('leadId')

    return res.status(201).json(thread)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

export async function listMessages(req, res) {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid thread id' })
    }

    const msgs = await Message.find({ threadId: id })
      .sort({ timestamp: 1 })
      .lean()

    return res.json(msgs)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

export async function sendMessage(req, res) {
  try {
    const { id } = req.params
    const { text, senderType = 'agent' } = req.body || {}

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid thread id' })
    }

    if (!text) {
      return res.status(400).json({ message: 'text is required' })
    }

    const thread = await MessageThread.findById(id)

    if (!thread) {
      return res.status(404).json({ message: 'Thread not found' })
    }

    const msg = await Message.create({
      threadId: thread._id,
      leadId: thread.leadId,
      senderType,
      text,
      timestamp: new Date(),
    })

    await MessageThread.updateOne(
      { _id: thread._id },
      { $set: { lastMessageAt: msg.timestamp } },
    )

    return res.status(201).json(msg)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}
