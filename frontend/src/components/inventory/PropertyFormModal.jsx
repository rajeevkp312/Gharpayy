import { useEffect, useMemo, useState } from 'react'
import { axiosClient } from '../../api/axiosClient.js'
import Button from '../ui/Button.jsx'

const PROPERTY_TYPES = ['PG', 'Hostel', 'Co-living', 'Apartment', 'Independent']
const PROPERTY_STATUSES = ['Active', 'Inactive', 'Maintenance', 'Coming Soon']
const AMENITIES_OPTIONS = [
  'WiFi',
  'AC',
  'TV',
  'Washing Machine',
  'Refrigerator',
  'Microwave',
  'Geyser',
  'Parking',
  'Lift',
  'Power Backup',
  'Security',
  'CCTV',
  'Housekeeping',
  'Laundry',
  'Common Area',
  'Gym',
  'Swimming Pool',
]

export default function PropertyFormModal({ open, onClose, onSaved, property }) {
  const isEdit = Boolean(property?._id)

  const [owners, setOwners] = useState([])
  const [loadingOwners, setLoadingOwners] = useState(false)

  const [name, setName] = useState('')
  const [type, setType] = useState('PG')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [pincode, setPincode] = useState('')
  const [geoLat, setGeoLat] = useState('')
  const [geoLng, setGeoLng] = useState('')
  const [amenities, setAmenities] = useState([])
  const [ownerId, setOwnerId] = useState('')
  const [status, setStatus] = useState('Active')
  const [description, setDescription] = useState('')
  const [rules, setRules] = useState('')
  const [nearbyPlaces, setNearbyPlaces] = useState('')

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const title = useMemo(() => (isEdit ? 'Edit Property' : 'New Property'), [isEdit])

  useEffect(() => {
    if (!open) return

    async function loadOwners() {
      try {
        setLoadingOwners(true)
        const res = await axiosClient.get('/api/owners')
        setOwners(res.data || [])
      } finally {
        setLoadingOwners(false)
      }
    }

    loadOwners().catch(() => {})
  }, [open])

  useEffect(() => {
    if (!open) return

    setError('')

    setName(property?.name || '')
    setType(property?.type || 'PG')
    setAddress(property?.address || '')
    setCity(property?.city || '')
    setState(property?.state || '')
    setPincode(property?.pincode || '')
    setGeoLat(property?.geo?.lat?.toString() || '')
    setGeoLng(property?.geo?.lng?.toString() || '')
    setAmenities(property?.amenities || [])
    setOwnerId(property?.ownerId?._id || property?.ownerId || '')
    setStatus(property?.status || 'Active')
    setDescription(property?.description || '')
    setRules((property?.rules || []).join('\n'))
    setNearbyPlaces((property?.nearbyPlaces || []).join('\n'))
  }, [open, property])

  if (!open) return null

  function toggleAmenity(a) {
    setAmenities((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a],
    )
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')

    try {
      setSaving(true)

      if (!name.trim()) throw new Error('Name is required')
      if (!address.trim()) throw new Error('Address is required')
      if (!city.trim()) throw new Error('City is required')

      const payload = {
        name: name.trim(),
        type,
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
        geo: {
          lat: geoLat ? Number(geoLat) : null,
          lng: geoLng ? Number(geoLng) : null,
        },
        amenities,
        ownerId: ownerId || null,
        status,
        description: description.trim(),
        rules: rules.split('\n').map((r) => r.trim()).filter(Boolean),
        nearbyPlaces: nearbyPlaces.split('\n').map((p) => p.trim()).filter(Boolean),
      }

      if (isEdit) {
        await axiosClient.patch(`/api/properties/${property._id}`, payload)
      } else {
        await axiosClient.post('/api/properties', payload)
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
      <div className="h-[85vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-black/10 bg-white shadow-xl">
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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <div className="text-xs font-semibold text-black/60">Property Name</div>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none"
                placeholder="e.g. Gharpayy HSR"
              />
            </div>

            <div>
              <div className="text-xs font-semibold text-black/60">Type</div>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none"
              >
                {PROPERTY_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
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
                {PROPERTY_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <div className="text-xs font-semibold text-black/60">Address</div>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none"
                placeholder="Full address"
              />
            </div>

            <div>
              <div className="text-xs font-semibold text-black/60">City</div>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none"
                placeholder="e.g. Bangalore"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs font-semibold text-black/60">State</div>
                <input
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none"
                  placeholder="State"
                />
              </div>
              <div>
                <div className="text-xs font-semibold text-black/60">Pincode</div>
                <input
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none"
                  placeholder="560001"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs font-semibold text-black/60">Latitude</div>
                <input
                  value={geoLat}
                  onChange={(e) => setGeoLat(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none"
                  placeholder="12.9716"
                />
              </div>
              <div>
                <div className="text-xs font-semibold text-black/60">Longitude</div>
                <input
                  value={geoLng}
                  onChange={(e) => setGeoLng(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none"
                  placeholder="77.5946"
                />
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-black/60">Owner</div>
              <select
                value={ownerId}
                onChange={(e) => setOwnerId(e.target.value)}
                className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none"
                disabled={loadingOwners}
              >
                <option value="">{loadingOwners ? 'Loading...' : 'No owner'}</option>
                {owners.map((o) => (
                  <option key={o._id} value={o._id}>
                    {o.name} ({o.phone})
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <div className="text-xs font-semibold text-black/60">Amenities</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {AMENITIES_OPTIONS.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => toggleAmenity(a)}
                    className={`rounded-full border px-3 py-1 text-xs transition ${
                      amenities.includes(a)
                        ? 'border-[rgb(var(--gh-accent))] bg-[rgb(var(--gh-accent))] text-white'
                        : 'border-black/10 bg-white text-black/70 hover:bg-black/[0.02]'
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            <div className="sm:col-span-2">
              <div className="text-xs font-semibold text-black/60">Description</div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="mt-1 w-full resize-none rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none"
                placeholder="Property description..."
              />
            </div>

            <div className="sm:col-span-2">
              <div className="text-xs font-semibold text-black/60">House Rules (one per line)</div>
              <textarea
                value={rules}
                onChange={(e) => setRules(e.target.value)}
                rows={3}
                className="mt-1 w-full resize-none rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none"
                placeholder="No smoking&#10;No pets"
              />
            </div>

            <div className="sm:col-span-2">
              <div className="text-xs font-semibold text-black/60">Nearby Places (one per line)</div>
              <textarea
                value={nearbyPlaces}
                onChange={(e) => setNearbyPlaces(e.target.value)}
                rows={3}
                className="mt-1 w-full resize-none rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none"
                placeholder="Metro station&#10;IT parks"
              />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-end gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="gold" disabled={saving}>
              {saving ? 'Saving...' : 'Save Property'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
