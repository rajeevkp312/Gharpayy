import { useState } from 'react'
import Button from '../ui/Button.jsx'

const PROPERTY_TYPES = ['', 'PG', 'Hostel', 'Co-living', 'Apartment', 'Independent']
const PROPERTY_STATUSES = ['', 'Active', 'Inactive', 'Maintenance', 'Coming Soon']

export default function PropertyFilters({ q, city, status, type, onChange }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-black/10 bg-white p-4 shadow-[0_8px_30px_rgba(0,0,0,0.06)] md:flex-row md:items-end md:justify-between">
      <div className="grid flex-1 grid-cols-1 gap-3 md:grid-cols-4">
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-black/50">Search</div>
          <input
            value={q}
            onChange={(e) => onChange?.({ q: e.target.value, city, status, type })}
            placeholder="Property name / address"
            className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-black/20"
          />
        </div>

        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-black/50">City</div>
          <input
            value={city}
            onChange={(e) => onChange?.({ q, city: e.target.value, status, type })}
            placeholder="e.g. Bangalore"
            className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-black/20"
          />
        </div>

        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-black/50">Status</div>
          <select
            value={status}
            onChange={(e) => onChange?.({ q, city, status: e.target.value, type })}
            className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-black/20"
          >
            {PROPERTY_STATUSES.map((s) => (
              <option key={s || 'all'} value={s}>
                {s || 'All'}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-black/50">Type</div>
          <select
            value={type}
            onChange={(e) => onChange?.({ q, city, status, type: e.target.value })}
            className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-black/20"
          >
            {PROPERTY_TYPES.map((t) => (
              <option key={t || 'all'} value={t}>
                {t || 'All'}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button
          variant="ghost"
          onClick={() => onChange?.({ q: '', city: '', status: '', type: '' })}
        >
          Reset
        </Button>
      </div>
    </div>
  )
}
