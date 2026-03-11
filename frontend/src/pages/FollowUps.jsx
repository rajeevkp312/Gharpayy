import { useEffect, useState } from 'react'
import { axiosClient } from '../api/axiosClient.js'
import Topbar from '../components/layout/Topbar.jsx'

export default function FollowUps({ openSidebar }) {
  const [followups, setFollowups] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  function formatDate(value) {
    if (!value) return ''
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return ''
    return d.toLocaleString()
  }

  async function load() {
    const res = await axiosClient.get('/api/followups')
    setFollowups(res.data)
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

  async function markCompleted(id) {
    try {
      setError('')
      await axiosClient.patch(`/api/followups/${id}`, { status: 'Completed' })
      await load()
    } catch (e) {
      setError(e?.response?.data?.message || e.message)
    }
  }

  return (
    <div>
      <Topbar title="Follow-ups" onMenuClick={openSidebar} />

      <div className="px-4 py-4 sm:px-6 sm:py-5">
        {loading ? <p className="mt-4">Loading...</p> : null}
        {error ? <p className="mt-4 text-red-600">{error}</p> : null}

        {!loading && !error ? (
          <div className="mt-4 overflow-x-auto rounded-2xl border border-black/10 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
            <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="border-b px-3 py-2 text-left text-sm">Lead Name</th>
                <th className="border-b px-3 py-2 text-left text-sm">Agent</th>
                <th className="border-b px-3 py-2 text-left text-sm">Reminder Date</th>
                <th className="border-b px-3 py-2 text-left text-sm">Status</th>
                <th className="border-b px-3 py-2 text-left text-sm">Action</th>
              </tr>
            </thead>
            <tbody>
              {followups.map((f) => (
                <tr key={f._id} className="hover:bg-gray-50">
                  <td className="border-b px-3 py-2 text-sm">{f.leadId?.name || '-'}</td>
                  <td className="border-b px-3 py-2 text-sm">{f.agentId?.name || '-'}</td>
                  <td className="border-b px-3 py-2 text-sm">{formatDate(f.reminderDate)}</td>
                  <td className="border-b px-3 py-2 text-sm">{f.status}</td>
                  <td className="border-b px-3 py-2 text-sm">
                    {f.status !== 'Completed' ? (
                      <button
                        type="button"
                        className="rounded border border-gray-300 px-2 py-1 text-xs"
                        onClick={() => markCompleted(f._id)}
                      >
                        Mark Completed
                      </button>
                    ) : (
                      '-'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        ) : null}
      </div>
    </div>
  )
}
