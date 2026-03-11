import Topbar from '../components/layout/Topbar.jsx'
import { useEffect, useState } from 'react'
import { axiosClient } from '../api/axiosClient.js'
import Button from '../components/ui/Button.jsx'
import BookingsFilters from '../components/bookings/BookingsFilters.jsx'
import BookingsTable from '../components/bookings/BookingsTable.jsx'
import BookingFormModal from '../components/bookings/BookingFormModal.jsx'

export default function Bookings({ openSidebar }) {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  async function load() {
    const res = await axiosClient.get('/api/bookings', { params: { q, status } })
    setRows(res.data || [])
  }

  useEffect(() => {
    let mounted = true

    async function init() {
      try {
        setLoading(true)
        setError('')
        await load()
      } catch (e) {
        if (mounted) setError(e?.response?.data?.message || e.message)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    init()

    return () => {
      mounted = false
    }
  }, [q, status])

  async function onDelete(row) {
    if (!row?._id) return
    // eslint-disable-next-line no-alert
    const ok = window.confirm('Delete this booking?')
    if (!ok) return

    try {
      setError('')
      await axiosClient.delete(`/api/bookings/${row._id}`)
      await load()
    } catch (e) {
      setError(e?.response?.data?.message || e.message)
    }
  }

  return (
    <div>
      <Topbar
        title="Bookings"
        subtitle="Confirmed bed allocations"
        onMenuClick={openSidebar}
        action={{
          label: 'New Booking',
          onClick: () => {
            setEditing(null)
            setModalOpen(true)
          },
        }}
      />

      <div className="px-4 py-4 sm:px-6 sm:py-5">
        <BookingsFilters
          q={q}
          status={status}
          onChange={({ q: nextQ, status: nextStatus }) => {
            setQ(nextQ)
            setStatus(nextStatus)
          }}
        />

        {error ? (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="mt-4">
          {loading ? (
            <div className="rounded-2xl border border-black/10 bg-white p-6 text-sm text-black/60 shadow-sm">
              Loading...
            </div>
          ) : rows.length ? (
            <BookingsTable
              rows={rows}
              onEdit={(row) => {
                setEditing(row)
                setModalOpen(true)
              }}
              onDelete={onDelete}
            />
          ) : (
            <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
              <div className="text-sm font-semibold">No bookings</div>
              <div className="mt-2 text-sm text-black/60">Create your first booking.</div>
              <div className="mt-4">
                <Button
                  variant="gold"
                  onClick={() => {
                    setEditing(null)
                    setModalOpen(true)
                  }}
                >
                  New Booking
                </Button>
              </div>
            </div>
          )}
        </div>

        <BookingFormModal
          open={modalOpen}
          booking={editing}
          onClose={() => setModalOpen(false)}
          onSaved={async () => {
            await load()
          }}
        />
      </div>
    </div>
  )
}
