import Button from '../ui/Button.jsx'

const STATUS_OPTIONS = ['', 'Pending', 'Confirmed', 'Cancelled', 'Completed']

export default function BookingsFilters({ q, status, onChange }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-black/10 bg-white p-4 shadow-[0_8px_30px_rgba(0,0,0,0.06)] md:flex-row md:items-end md:justify-between">
      <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-end">
        <div className="flex-1">
          <div className="text-xs uppercase tracking-[0.18em] text-black/50">Search</div>
          <input
            value={q}
            onChange={(e) => onChange?.({ q: e.target.value, status })}
            placeholder="Property / room / bed"
            className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-black/20"
          />
        </div>

        <div className="w-full md:w-64">
          <div className="text-xs uppercase tracking-[0.18em] text-black/50">Status</div>
          <select
            value={status}
            onChange={(e) => onChange?.({ q, status: e.target.value })}
            className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-black/20"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s || 'all'} value={s}>
                {s || 'All'}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button
          variant="ghost"
          onClick={() => onChange?.({ q: '', status: '' })}
        >
          Reset
        </Button>
      </div>
    </div>
  )
}
