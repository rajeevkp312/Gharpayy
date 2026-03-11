import { useState } from 'react'
import { axiosClient } from '../api/axiosClient.js'
import Button from '../components/ui/Button.jsx'

const SOURCES = [
  { value: 'website', label: 'Website' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'call', label: 'Call' },
  { value: 'google_form', label: 'Google Form' },
]

export default function PublicLeadForm() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [source, setSource] = useState('website')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      setLoading(true)
      await axiosClient.post('/api/public/lead', { name, phone, source })
      setSuccess('Thank you! Our team will contact you shortly.')
      setName('')
      setPhone('')
      setSource('website')
    } catch (err) {
      setError(err?.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[rgb(var(--gh-bg))] px-4 py-10">
      <div className="mx-auto w-full max-w-lg">
        <div className="text-center">
          <div className="text-xs uppercase tracking-[0.2em] text-black/50">
            Gharpayy CRM
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[rgb(var(--gh-black))]">
            Find Your Perfect PG in Bangalore
          </h1>
          <p className="mt-3 text-sm text-black/60">
            Fill the form and our team will assist you.
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-black/10 bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black/80">
                Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-black/20"
                placeholder="Your full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black/80">
                Phone Number
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-2 w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-black/20"
                placeholder="10-digit phone"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black/80">
                Lead Source
              </label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="mt-2 w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-black/20"
              >
                {SOURCES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {success ? (
              <div className="rounded-xl border border-black/10 bg-black/[0.02] px-4 py-3 text-sm text-black/70">
                {success}
              </div>
            ) : null}

            {error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <Button
              type="submit"
              variant="gold"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Find PG Now'}
            </Button>

            <div className="text-center text-xs text-black/50">
              By submitting, you agree to be contacted by our team.
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
