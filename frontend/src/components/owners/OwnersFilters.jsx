import Button from '../ui/Button.jsx'

export default function OwnersFilters({ q, onChange }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-black/10 bg-white p-4 shadow-[0_8px_30px_rgba(0,0,0,0.06)] md:flex-row md:items-end md:justify-between">
      <div className="flex-1">
        <div className="text-xs uppercase tracking-[0.18em] text-black/50">Search</div>
        <input
          value={q}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder="Name / phone / email / city"
          className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-black/20"
        />
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button variant="ghost" onClick={() => onChange?.('')}>
          Reset
        </Button>
      </div>
    </div>
  )
}
