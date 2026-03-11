import mongoose from 'mongoose'
import { Bed, BED_STATUSES, BED_TYPES } from '../models/Bed.js'

export async function listBedsByProperty(req, res) {
  try {
    const { propertyId } = req.params
    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({ message: 'Invalid property id' })
    }

    const { roomId, status } = req.query
    const filter = { propertyId }
    if (roomId) filter.roomId = roomId
    if (status && BED_STATUSES.includes(status)) filter.status = status

    const beds = await Bed.find(filter).sort({ name: 1 }).lean()
    return res.json(beds)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

export async function createBed(req, res) {
  try {
    const { propertyId, roomId } = req.params
    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({ message: 'Invalid property id' })
    }
    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      return res.status(400).json({ message: 'Invalid room id' })
    }

    const payload = req.body || {}
    if (!payload.name) return res.status(400).json({ message: 'name is required' })
    if (payload.baseRent === undefined || payload.baseRent === null) {
      return res.status(400).json({ message: 'baseRent is required' })
    }

    const created = await Bed.create({
      ...payload,
      propertyId,
      roomId,
      baseRent: Number(payload.baseRent),
      deposit: Number(payload.deposit || 0),
    })

    return res.status(201).json(created)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

export async function updateBed(req, res) {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid bed id' })
    }

    const payload = req.body || {}

    if (payload.status && !BED_STATUSES.includes(payload.status)) {
      return res.status(400).json({ message: 'Invalid bed status' })
    }

    if (payload.baseRent !== undefined) payload.baseRent = Number(payload.baseRent)
    if (payload.deposit !== undefined) payload.deposit = Number(payload.deposit)

    const updated = await Bed.findByIdAndUpdate(id, payload, { new: true }).lean()
    if (!updated) return res.status(404).json({ message: 'Bed not found' })

    return res.json(updated)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

export async function deleteBed(req, res) {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid bed id' })
    }

    const deleted = await Bed.findByIdAndDelete(id)
    if (!deleted) return res.status(404).json({ message: 'Bed not found' })

    return res.json({ ok: true })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

export async function updateBedStatus(req, res) {
  try {
    const { id } = req.params
    const { status } = req.body || {}

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid bed id' })
    }
    if (!status || !BED_STATUSES.includes(status)) {
      return res.status(400).json({ message: 'Invalid bed status' })
    }

    const updated = await Bed.findByIdAndUpdate(id, { status }, { new: true }).lean()
    if (!updated) return res.status(404).json({ message: 'Bed not found' })

    return res.json(updated)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}
