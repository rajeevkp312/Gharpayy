import mongoose from 'mongoose'
import { Booking, BOOKING_STATUSES } from '../models/Booking.js'

export async function listBookings(req, res) {
  try {
    const { status, q } = req.query

    const filter = {}
    if (status) filter.status = status

    if (q) {
      filter.$or = [
        { propertyName: { $regex: q, $options: 'i' } },
        { roomName: { $regex: q, $options: 'i' } },
        { bedName: { $regex: q, $options: 'i' } },
      ]
    }

    const rows = await Booking.find(filter)
      .sort({ createdAt: -1 })
      .populate('leadId')
      .lean()

    const result = rows.map((b) => ({
      ...b,
      lead: b.leadId,
      leadId: b.leadId?._id ?? b.leadId,
    }))

    return res.json(result)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

export async function createBooking(req, res) {
  try {
    const {
      leadId,
      propertyName,
      roomName = '',
      bedName = '',
      startDate,
      endDate = '',
      amount,
      paymentStatus = 'Unpaid',
      status = 'Pending',
      notes = '',
    } = req.body || {}

    if (!leadId) return res.status(400).json({ message: 'leadId is required' })
    if (!mongoose.Types.ObjectId.isValid(leadId)) {
      return res.status(400).json({ message: 'Invalid leadId' })
    }
    if (!propertyName) return res.status(400).json({ message: 'propertyName is required' })
    if (!startDate) return res.status(400).json({ message: 'startDate is required' })
    if (amount === undefined || amount === null || Number.isNaN(Number(amount))) {
      return res.status(400).json({ message: 'amount is required' })
    }
    if (!BOOKING_STATUSES.includes(status)) {
      return res.status(400).json({ message: 'Invalid booking status' })
    }

    const booking = await Booking.create({
      leadId,
      propertyName,
      roomName,
      bedName,
      startDate,
      endDate,
      amount: Number(amount),
      paymentStatus,
      status,
      notes,
    })

    const populated = await Booking.findById(booking._id).populate('leadId').lean()

    return res.status(201).json({
      ...populated,
      lead: populated.leadId,
      leadId: populated.leadId?._id ?? populated.leadId,
    })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

export async function updateBooking(req, res) {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid booking id' })
    }

    const patch = req.body || {}

    if (patch.status && !BOOKING_STATUSES.includes(patch.status)) {
      return res.status(400).json({ message: 'Invalid booking status' })
    }

    if (patch.amount !== undefined) {
      if (patch.amount === null || Number.isNaN(Number(patch.amount))) {
        return res.status(400).json({ message: 'Invalid amount' })
      }
      patch.amount = Number(patch.amount)
    }

    const updated = await Booking.findByIdAndUpdate(id, patch, { new: true })
      .populate('leadId')
      .lean()

    if (!updated) return res.status(404).json({ message: 'Booking not found' })

    return res.json({
      ...updated,
      lead: updated.leadId,
      leadId: updated.leadId?._id ?? updated.leadId,
    })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

export async function deleteBooking(req, res) {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid booking id' })
    }

    const deleted = await Booking.findByIdAndDelete(id)
    if (!deleted) return res.status(404).json({ message: 'Booking not found' })

    return res.json({ ok: true })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}
