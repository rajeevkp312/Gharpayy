import { useEffect, useState } from 'react'
import { axiosClient } from '../api/axiosClient.js'
import VisitModal from '../components/VisitModal.jsx'
import Topbar from '../components/layout/Topbar.jsx'

export default function Visits({ openSidebar }) {
  const [visits, setVisits] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)

  function formatDate(value) {
    if (!value) return ''
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return ''
    return d.toLocaleString()
  }

  async function load() {
    const res = await axiosClient.get('/api/visits')
    setVisits(res.data)
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
  }, [])

  return (
    <div>
      <Topbar
        title="Visits"
        onMenuClick={openSidebar}
        action={{
          label: 'Schedule Visit',
          onClick: () => setOpen(true),
        }}
      />

      <div className="px-4 py-4 sm:px-6 sm:py-5">
        {loading ? <p className="mt-4">Loading...</p> : null}
        {error ? <p className="mt-4 text-red-600">{error}</p> : null}

      {!loading && !error ? (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="border-b px-3 py-2 text-left text-sm">Lead Name</th>
                <th className="border-b px-3 py-2 text-left text-sm">Property</th>
                <th className="border-b px-3 py-2 text-left text-sm">Visit Date</th>
                <th className="border-b px-3 py-2 text-left text-sm">Time</th>
                <th className="border-b px-3 py-2 text-left text-sm">Agent</th>
                <th className="border-b px-3 py-2 text-left text-sm">Outcome</th>
                <th className="border-b px-3 py-2 text-left text-sm">Created At</th>
              </tr>
            </thead>
            <tbody>
              {visits.map((v) => (
                <tr key={v._id} className="hover:bg-gray-50">
                  <td className="border-b px-3 py-2 text-sm">{v.leadId?.name || '-'}</td>
                  <td className="border-b px-3 py-2 text-sm">{v.propertyName}</td>
                  <td className="border-b px-3 py-2 text-sm">{v.visitDate}</td>
                  <td className="border-b px-3 py-2 text-sm">{v.visitTime}</td>
                  <td className="border-b px-3 py-2 text-sm">{v.agentId?.name || '-'}</td>
                  <td className="border-b px-3 py-2 text-sm">{v.outcome}</td>
                  <td className="border-b px-3 py-2 text-sm">{formatDate(v.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        ) : null}

        <VisitModal
          open={open}
          onClose={() => setOpen(false)}
          onCreated={async () => {
            try {
              setError('')
              await load()
            } catch (e) {
              setError(e?.response?.data?.message || e.message)
            }
          }}
        />
      </div>
    </div>
  )
}
