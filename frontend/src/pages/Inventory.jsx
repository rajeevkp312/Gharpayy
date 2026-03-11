import { useEffect, useState } from 'react'
import { axiosClient } from '../api/axiosClient.js'
import Topbar from '../components/layout/Topbar.jsx'
import Button from '../components/ui/Button.jsx'
import PropertyFilters from '../components/inventory/PropertyFilters.jsx'
import PropertiesTable from '../components/inventory/PropertiesTable.jsx'
import PropertyFormModal from '../components/inventory/PropertyFormModal.jsx'
import PropertyDetail from '../components/inventory/PropertyDetail.jsx'

export default function Inventory({ openSidebar }) {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [q, setQ] = useState('')
  const [city, setCity] = useState('')
  const [status, setStatus] = useState('')
  const [type, setType] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [viewing, setViewing] = useState(null)

  async function load() {
    const res = await axiosClient.get('/api/properties', { params: { q, city, status, type } })
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
  }, [q, city, status, type])

  async function onDelete(row) {
    if (!row?._id) return
    const ok = window.confirm('Delete this property and all its rooms/beds?')
    if (!ok) return

    try {
      setError('')
      await axiosClient.delete(`/api/properties/${row._id}`)
      await load()
    } catch (e) {
      setError(e?.response?.data?.message || e.message)
    }
  }

  return (
    <div>
      <Topbar
        title="Inventory"
        subtitle="Manage properties, rooms & beds"
        onMenuClick={openSidebar}
        action={{
          label: 'New Property',
          onClick: () => {
            setEditing(null)
            setModalOpen(true)
          },
        }}
      />

      <div className="px-4 py-4 sm:px-6 sm:py-5">
        <PropertyFilters
          q={q}
          city={city}
          status={status}
          type={type}
          onChange={({ q: nQ, city: nCity, status: nStatus, type: nType }) => {
            setQ(nQ)
            setCity(nCity)
            setStatus(nStatus)
            setType(nType)
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
            <PropertiesTable
              rows={rows}
              onView={(row) => setViewing(row)}
              onEdit={(row) => {
                setEditing(row)
                setModalOpen(true)
              }}
              onDelete={onDelete}
            />
          ) : (
            <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
              <div className="text-sm font-semibold">No properties</div>
              <div className="mt-2 text-sm text-black/60">Create your first property.</div>
              <div className="mt-4">
                <Button
                  variant="gold"
                  onClick={() => {
                    setEditing(null)
                    setModalOpen(true)
                  }}
                >
                  New Property
                </Button>
              </div>
            </div>
          )}
        </div>

        <PropertyFormModal
          open={modalOpen}
          property={editing}
          onClose={() => setModalOpen(false)}
          onSaved={async () => {
            await load()
          }}
        />

        {viewing && (
          <PropertyDetail
            property={viewing}
            onClose={() => setViewing(null)}
            onChange={(row) => {
              setEditing(row)
              setModalOpen(true)
            }}
          />
        )}
      </div>
    </div>
  )
}
