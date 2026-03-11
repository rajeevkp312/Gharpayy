import { useEffect, useState } from 'react'
import { axiosClient } from '../api/axiosClient.js'

export default function LeadTimeline({ leadId }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  function formatDate(value) {
    if (!value) return ''
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return ''
    return d.toLocaleString()
  }

  useEffect(() => {
    if (!leadId) return

    let mounted = true

    async function load() {
      try {
        setLoading(true)
        setError('')
        const res = await axiosClient.get(`/api/leads/${leadId}/activity`)
        if (mounted) setItems(res.data)
      } catch (e) {
        if (mounted) setError(e?.response?.data?.message || e.message)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()

    return () => {
      mounted = false
    }
  }, [leadId])

  if (!leadId) return null

  return (
    <div className="rounded border border-gray-200 bg-white p-4">
      <div className="text-sm font-semibold">Activity Timeline</div>

      {loading ? <p className="mt-3 text-sm">Loading...</p> : null}
      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

      {!loading && !error ? (
        <ol className="mt-3 space-y-3">
          {items.length ? (
            items.map((it) => (
              <li key={it._id} className="border-l-2 border-gray-200 pl-3">
                <div className="text-sm font-medium">{it.activityType}</div>
                <div className="text-xs text-gray-700">{it.description}</div>
                <div className="mt-1 text-xs text-gray-500">
                  {formatDate(it.timestamp)}
                  {it.agentId?.name ? ` • ${it.agentId.name}` : ''}
                </div>
              </li>
            ))
          ) : (
            <li className="text-sm text-gray-600">No activity yet.</li>
          )}
        </ol>
      ) : null}
    </div>
  )
}
