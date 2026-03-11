import mongoose from 'mongoose'
import { Owner } from '../models/Owner.js'

export async function listOwners(req, res) {
  try {
    const { q } = req.query

    const filter = {}
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { phone: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { city: { $regex: q, $options: 'i' } },
      ]
    }

    const rows = await Owner.find(filter).sort({ createdAt: -1 }).lean()
    return res.json(rows)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

export async function createOwner(req, res) {
  try {
    const { name, phone, email = '', city = '', notes = '' } = req.body || {}

    if (!name) return res.status(400).json({ message: 'name is required' })
    if (!phone) return res.status(400).json({ message: 'phone is required' })

    const owner = await Owner.create({ name, phone, email, city, notes })
    return res.status(201).json(owner)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

export async function updateOwner(req, res) {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid owner id' })
    }

    const patch = req.body || {}

    const updated = await Owner.findByIdAndUpdate(id, patch, { new: true }).lean()
    if (!updated) return res.status(404).json({ message: 'Owner not found' })

    return res.json(updated)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

export async function deleteOwner(req, res) {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid owner id' })
    }

    const deleted = await Owner.findByIdAndDelete(id)
    if (!deleted) return res.status(404).json({ message: 'Owner not found' })

    return res.json({ ok: true })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}
