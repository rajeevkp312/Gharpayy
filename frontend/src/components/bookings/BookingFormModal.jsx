import { useEffect, useMemo, useState } from 'react'
import { axiosClient } from '../../api/axiosClient.js'
import Button from '../ui/Button.jsx'

const STATUS_OPTIONS = ['Pending', 'Confirmed', 'Cancelled', 'Completed']
const PAYMENT_OPTIONS = ['Unpaid', 'Partial', 'Paid']

export default function BookingFormModal({ open, onClose, onSaved, booking }) {
  const isEdit = Boolean(booking?._id)

  const [leads, setLeads] = useState([])
  const [loadingLeads, setLoadingLeads] = useState(false)

  const [leadId, setLeadId] = useState('')
  const [propertyName, setPropertyName] = useState('')
  const [roomName, setRoomName] = useState('')
  const [bedName, setBedName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [amount, setAmount] = useState('')
  const [paymentStatus, setPaymentStatus] = useState('Unpaid')
  const [status, setStatus] = useState('Pending')
  const [notes, setNotes] = useState('')

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const title = useMemo(() => (isEdit ? 'Edit Booking' : 'New Booking'), [isEdit])

  useEffect(() => {
    if (!open) return

    async function loadLeads() {
      try {
        setLoadingLeads(true)
        const res = await axiosClient.get('/api/leads')
        setLeads(res.data || [])
      } finally {
        setLoadingLeads(false)
      }
    }

    loadLeads().catch(() => {})
  }, [open])

  useEffect(() => {
    if (!open) return

    setError('')

    setLeadId(booking?.leadId?._id || booking?.leadId || '')
    setPropertyName(booking?.propertyName || '')
    setRoomName(booking?.roomName || '')
    setBedName(booking?.bedName || '')
    setStartDate(booking?.startDate || '')
    setEndDate(booking?.endDate || '')
    setAmount(booking?.amount?.toString?.() || '')
    setPaymentStatus(booking?.paymentStatus || 'Unpaid')
    setStatus(booking?.status || 'Pending')
    setNotes(booking?.notes || '')
  }, [open, booking])

  if (!open) return null

  async function onSubmit(e) {
    e.preventDefault()
    setError('')

    try {
      setSaving(true)

      if (!leadId) throw new Error('Please select a lead')
      if (!propertyName) throw new Error('Property name is required')
      if (!startDate) throw new Error('Start date is required')
      if (amount === '' || Number.isNaN(Number(amount))) throw new Error('Amount is required')

      const payload = {
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
      }

      if (isEdit) {
        await axiosClient.patch(`/api/bookings/${booking._id}`, payload)
      } else {
        await axiosClient.post('/api/bookings', payload)
      }

      onSaved?.()
      onClose?.()
    } catch (err) {
      setError(err?.response?.data?.message || err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 p-3 sm:items-center">
      <div className="w-full max-w-2xl rounded-2xl border border-black/10 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-black/10 px-4 py-3">
          <div className="text-sm font-semibold">{title}</div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-black/10 px-2 py-1 text-sm text-black/70"
          >
            Close
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-4">
          {error ? (
            <div className="mb-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <div className="text-xs font-semibold text-black/60">Lead</div>
              <select
                value={leadId}
                onChange={(e) => setLeadId(e.target.value)}
                className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none"
                disabled={loadingLeads}
              >
                <option value="">{loadingLeads ? 'Loading...' : 'Select lead'}</option>
                {leads.map((l) => (
                  <option key={l._id} value={l._id}>
                    {l.name} ({l.phone})
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <div className="text-xs font-semibold text-black/60">Property</div>
              <input
                value={propertyName}
                onChange={(e) => setPropertyName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none"
                placeholder="e.g. Gharpayy HSR"
              />
            </div>

            <div>
              <div className="text-xs font-semibold text-black/60">Room</div>
              <input
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none"
                placeholder="e.g. 203"
              />
            </div>

            <div>
              <div className="text-xs font-semibold text-black/60">Bed</div>
              <input
                value={bedName}
                onChange={(e) => setBedName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none"
                placeholder="e.g. B2"
              />
            </div>

            <div>
              <div className="text-xs font-semibold text-black/60">Start Date</div>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none"
              />
            </div>

            <div>
              <div className="text-xs font-semibold text-black/60">End Date</div>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none"
              />
            </div>

            <div>
              <div className="text-xs font-semibold text-black/60">Amount</div>
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none"
                placeholder="e.g. 6000"
              />
            </div>

            <div>
              <div className="text-xs font-semibold text-black/60">Payment</div>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none"
              >
                {PAYMENT_OPTIONS.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="text-xs font-semibold text-black/60">Status</div>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none"
              >
                {STATUS_OPTIONS.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <div className="text-xs font-semibold text-black/60">Notes</div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="mt-1 w-full resize-none rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none"
              />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-end gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="gold" disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
