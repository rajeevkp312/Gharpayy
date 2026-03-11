import { useEffect, useMemo, useState } from 'react'
import { axiosClient } from '../../api/axiosClient.js'
import Button from '../ui/Button.jsx'

export default function OwnerFormModal({ open, onClose, onSaved, owner }) {
  const isEdit = Boolean(owner?._id)

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [city, setCity] = useState('')
  const [notes, setNotes] = useState('')

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const title = useMemo(() => (isEdit ? 'Edit Owner' : 'New Owner'), [isEdit])

  useEffect(() => {
    if (!open) return
    setError('')

    setName(owner?.name || '')
    setPhone(owner?.phone || '')
    setEmail(owner?.email || '')
    setCity(owner?.city || '')
    setNotes(owner?.notes || '')
  }, [open, owner])

  if (!open) return null

  async function onSubmit(e) {
    e.preventDefault()
    setError('')

    try {
      setSaving(true)
      if (!name.trim()) throw new Error('Name is required')
      if (!phone.trim()) throw new Error('Phone is required')

      const payload = {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        city: city.trim(),
        notes: notes.trim(),
      }

      if (isEdit) {
        await axiosClient.patch(`/api/owners/${owner._id}`, payload)
      } else {
        await axiosClient.post('/api/owners', payload)
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
      <div className="w-full max-w-xl rounded-2xl border border-black/10 bg-white shadow-xl">
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

          <div className="grid grid-cols-1 gap-3">
            <div>
              <div className="text-xs font-semibold text-black/60">Name</div>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none"
                placeholder="Owner name"
              />
            </div>

            <div>
              <div className="text-xs font-semibold text-black/60">Phone</div>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none"
                placeholder="Phone"
              />
            </div>

            <div>
              <div className="text-xs font-semibold text-black/60">Email</div>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none"
                placeholder="Email"
              />
            </div>

            <div>
              <div className="text-xs font-semibold text-black/60">City</div>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none"
                placeholder="City"
              />
            </div>

            <div>
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
