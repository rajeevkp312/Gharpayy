import { useEffect, useState } from 'react'
import { axiosClient } from '../api/axiosClient.js'
import Topbar from '../components/layout/Topbar.jsx'
import Button from '../components/ui/Button.jsx'
import OwnersFilters from '../components/owners/OwnersFilters.jsx'
import OwnersTable from '../components/owners/OwnersTable.jsx'
import OwnerFormModal from '../components/owners/OwnerFormModal.jsx'

export default function Owners({ openSidebar }) {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [q, setQ] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  async function load() {
    const res = await axiosClient.get('/api/owners', { params: { q } })
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
  }, [q])

  async function onDelete(row) {
    if (!row?._id) return
    // eslint-disable-next-line no-alert
    const ok = window.confirm('Delete this owner?')
    if (!ok) return

    try {
      setError('')
      await axiosClient.delete(`/api/owners/${row._id}`)
      await load()
    } catch (e) {
      setError(e?.response?.data?.message || e.message)
    }
  }

  return (
    <div>
      <Topbar
        title="Owners"
        subtitle="Manage PG owners"
        onMenuClick={openSidebar}
        action={{
          label: 'New Owner',
          onClick: () => {
            setEditing(null)
            setModalOpen(true)
          },
        }}
      />

      <div className="px-4 py-4 sm:px-6 sm:py-5">
        <OwnersFilters q={q} onChange={setQ} />

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
            <OwnersTable
              rows={rows}
              onEdit={(row) => {
                setEditing(row)
                setModalOpen(true)
              }}
              onDelete={onDelete}
            />
          ) : (
            <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
              <div className="text-sm font-semibold">No owners</div>
              <div className="mt-2 text-sm text-black/60">Create your first owner.</div>
              <div className="mt-4">
                <Button
                  variant="gold"
                  onClick={() => {
                    setEditing(null)
                    setModalOpen(true)
                  }}
                >
                  New Owner
                </Button>
              </div>
            </div>
          )}
        </div>

        <OwnerFormModal
          open={modalOpen}
          owner={editing}
          onClose={() => setModalOpen(false)}
          onSaved={async () => {
            await load()
          }}
        />
      </div>
    </div>
  )
}
