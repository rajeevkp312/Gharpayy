import mongoose from 'mongoose'
import { Room } from '../models/Room.js'
import { Bed } from '../models/Bed.js'

export async function listRoomsByProperty(req, res) {
  try {
    const { propertyId } = req.params
    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({ message: 'Invalid property id' })
    }

    const rooms = await Room.find({ propertyId }).sort({ name: 1 }).lean()
    const beds = await Bed.find({ propertyId }).lean()

    const roomsWithBeds = rooms.map((r) => ({
      ...r,
      beds: beds.filter((b) => String(b.roomId) === String(r._id)),
    }))

    return res.json(roomsWithBeds)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

export async function createRoom(req, res) {
  try {
    const { propertyId } = req.params
    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({ message: 'Invalid property id' })
    }

    const payload = req.body || {}
    if (!payload.name) return res.status(400).json({ message: 'name is required' })

    const created = await Room.create({ ...payload, propertyId })
    return res.status(201).json(created)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

export async function updateRoom(req, res) {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid room id' })
    }

    const payload = req.body || {}
    const updated = await Room.findByIdAndUpdate(id, payload, { new: true }).lean()
    if (!updated) return res.status(404).json({ message: 'Room not found' })
    return res.json(updated)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

export async function deleteRoom(req, res) {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid room id' })
    }

    await Bed.deleteMany({ roomId: id })
    const deleted = await Room.findByIdAndDelete(id)

    if (!deleted) return res.status(404).json({ message: 'Room not found' })
    return res.json({ ok: true })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}
