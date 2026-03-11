import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { axiosClient } from '../api/axiosClient.js'
import Topbar from '../components/layout/Topbar.jsx'

export default function LeadForm({ openSidebar }) {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [source, setSource] = useState('website')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    setError('')

    try {
      setLoading(true)
      await axiosClient.post('/api/leads', { name, phone, source })
      navigate('/leads')
    } catch (err) {
      setError(err?.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Topbar title="Create Lead" onMenuClick={openSidebar} />

      <div className="px-4 py-4 sm:px-6 sm:py-5">
        <form onSubmit={onSubmit} className="mt-4 max-w-xl space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
            placeholder="Rahul Sharma"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Phone</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
            placeholder="9876543210"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Source</label>
          <select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
          >
            <option value="website">website</option>
            <option value="whatsapp">whatsapp</option>
            <option value="google">google</option>
            <option value="referral">referral</option>
          </select>
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {loading ? 'Creating...' : 'Create Lead'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/leads')}
            className="rounded border border-gray-300 px-4 py-2 text-sm font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
      </div>
    </div>
  )
}
