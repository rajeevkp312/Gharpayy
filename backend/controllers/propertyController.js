import mongoose from 'mongoose'
import { Property, PROPERTY_STATUSES, PROPERTY_TYPES } from '../models/Property.js'
import { Room } from '../models/Room.js'
import { Bed } from '../models/Bed.js'

export async function listProperties(req, res) {
  try {
    const { q, city, status, type } = req.query

    const filter = {}
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { address: { $regex: q, $options: 'i' } },
        { city: { $regex: q, $options: 'i' } },
      ]
    }
    if (city) filter.city = { $regex: city, $options: 'i' }
    if (status && PROPERTY_STATUSES.includes(status)) filter.status = status
    if (type && PROPERTY_TYPES.includes(type)) filter.type = type

    const rows = await Property.find(filter)
      .sort({ createdAt: -1 })
      .populate('ownerId')
      .lean()

    return res.json(rows)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

export async function getPropertyDetail(req, res) {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid property id' })
    }

    const property = await Property.findById(id).populate('ownerId').lean()
    if (!property) return res.status(404).json({ message: 'Property not found' })

    const rooms = await Room.find({ propertyId: id }).lean()
    const beds = await Bed.find({ propertyId: id }).lean()

    return res.json({ property, rooms, beds })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

export async function createProperty(req, res) {
  try {
    const payload = req.body || {}

    if (!payload.name) return res.status(400).json({ message: 'name is required' })
    if (!payload.address) return res.status(400).json({ message: 'address is required' })
    if (!payload.city) return res.status(400).json({ message: 'city is required' })

    const created = await Property.create(payload)
    const populated = await Property.findById(created._id).populate('ownerId').lean()

    return res.status(201).json(populated)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

export async function updateProperty(req, res) {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid property id' })
    }

    const payload = req.body || {}
    const updated = await Property.findByIdAndUpdate(id, payload, { new: true })
      .populate('ownerId')
      .lean()

    if (!updated) return res.status(404).json({ message: 'Property not found' })
    return res.json(updated)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

export async function deleteProperty(req, res) {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid property id' })
    }

    await Bed.deleteMany({ propertyId: id })
    await Room.deleteMany({ propertyId: id })
    const deleted = await Property.findByIdAndDelete(id)

    if (!deleted) return res.status(404).json({ message: 'Property not found' })
    return res.json({ ok: true })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}
