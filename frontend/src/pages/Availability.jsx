import { useEffect, useState } from 'react'
import { axiosClient } from '../api/axiosClient.js'
import Topbar from '../components/layout/Topbar.jsx'

const STATUS_COLORS = {
  Available: 'bg-green-50 text-green-700 border-green-200',
  Occupied: 'bg-red-50 text-red-700 border-red-200',
  Maintenance: 'bg-orange-50 text-orange-700 border-orange-200',
  Reserved: 'bg-blue-50 text-blue-700 border-blue-200',
  Blocked: 'bg-gray-50 text-gray-700 border-gray-200',
}

export default function Availability({ openSidebar }) {
  const [properties, setProperties] = useState([])
  const [selectedProperty, setSelectedProperty] = useState('')
  const [beds, setBeds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadProperties() {
      try {
        const res = await axiosClient.get('/api/properties')
        setProperties(res.data || [])
        if (res.data?.[0]) setSelectedProperty(res.data[0]._id)
      } catch (e) {
        setError(e?.response?.data?.message || e.message)
      }
    }
    loadProperties()
  }, [])

  useEffect(() => {
    if (!selectedProperty) return

    async function loadBeds() {
      try {
        setLoading(true)
        setError('')
        const res = await axiosClient.get(`/api/properties/${selectedProperty}/beds`)
        setBeds(res.data || [])
      } catch (e) {
        setError(e?.response?.data?.message || e.message)
      } finally {
        setLoading(false)
      }
    }

    loadBeds()
  }, [selectedProperty])

  const stats = {
    total: beds.length,
    available: beds.filter((b) => b.status === 'Available').length,
    occupied: beds.filter((b) => b.status === 'Occupied').length,
    maintenance: beds.filter((b) => b.status === 'Maintenance').length,
    reserved: beds.filter((b) => b.status === 'Reserved').length,
    blocked: beds.filter((b) => b.status === 'Blocked').length,
  }

  return (
    <div>
      <Topbar title="Availability" subtitle="Live bed availability" onMenuClick={openSidebar} />

      <div className="px-4 py-4 sm:px-6 sm:py-5">
        {error ? (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="mb-4 rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
          <div className="text-xs uppercase tracking-[0.18em] text-black/50">Select Property</div>
          <select
            value={selectedProperty}
            onChange={(e) => setSelectedProperty(e.target.value)}
            className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none md:w-96"
          >
            {properties.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} ({p.city})
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
            <div className="text-xs text-black/50">Total Beds</div>
            <div className="mt-1 text-2xl font-semibold">{stats.total}</div>
          </div>
          <div className="rounded-2xl border border-green-200 bg-green-50 p-4 shadow-sm">
            <div className="text-xs text-green-700">Available</div>
            <div className="mt-1 text-2xl font-semibold text-green-700">{stats.available}</div>
          </div>
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 shadow-sm">
            <div className="text-xs text-red-700">Occupied</div>
            <div className="mt-1 text-2xl font-semibold text-red-700">{stats.occupied}</div>
          </div>
          <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4 shadow-sm">
            <div className="text-xs text-orange-700">Maintenance</div>
            <div className="mt-1 text-2xl font-semibold text-orange-700">{stats.maintenance}</div>
          </div>
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 shadow-sm">
            <div className="text-xs text-blue-700">Reserved</div>
            <div className="mt-1 text-2xl font-semibold text-blue-700">{stats.reserved}</div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 shadow-sm">
            <div className="text-xs text-gray-700">Blocked</div>
            <div className="mt-1 text-2xl font-semibold text-gray-700">{stats.blocked}</div>
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-black/10 bg-white p-6 text-sm text-black/60 shadow-sm">
            Loading...
          </div>
        ) : beds.length ? (
          <div className="overflow-x-auto rounded-2xl border border-black/10 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border-b px-3 py-2 text-left text-xs font-semibold text-black/60">Room ID</th>
                  <th className="border-b px-3 py-2 text-left text-xs font-semibold text-black/60">Bed</th>
                  <th className="border-b px-3 py-2 text-left text-xs font-semibold text-black/60">Type</th>
                  <th className="border-b px-3 py-2 text-left text-xs font-semibold text-black/60">Rent</th>
                  <th className="border-b px-3 py-2 text-left text-xs font-semibold text-black/60">Status</th>
                </tr>
              </thead>
              <tbody>
                {beds.map((bed) => (
                  <tr key={bed._id} className="hover:bg-gray-50">
                    <td className="border-b px-3 py-2 text-sm">{bed.roomId}</td>
                    <td className="border-b px-3 py-2 text-sm font-medium">{bed.name}</td>
                    <td className="border-b px-3 py-2 text-sm">{bed.bedType}</td>
                    <td className="border-b px-3 py-2 text-sm">₹{Number(bed.baseRent).toLocaleString()}</td>
                    <td className="border-b px-3 py-2 text-sm">
                      <span
                        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${
                          STATUS_COLORS[bed.status] || STATUS_COLORS.Available
                        }`}
                      >
                        {bed.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-2xl border border-black/10 bg-white p-6 text-center shadow-sm">
            <div className="text-sm text-black/60">No beds found for this property.</div>
            <div className="mt-2 text-xs text-black/50">Add beds from the Inventory page.</div>
          </div>
        )}
      </div>
    </div>
  )
}
