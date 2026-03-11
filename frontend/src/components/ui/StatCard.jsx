const ICONS = {
  leads: (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d="M16 11c1.66 0 3-1.34 3-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3ZM8 11c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3Zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13Zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5C23 14.17 18.33 13 16 13Z"
        fill="currentColor"
        opacity="0.9"
      />
    </svg>
  ),
  spark: (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d="M11 21s-1-3 1-6 4-4 4-7-2-5-2-5 1 3-1 6-4 4-4 7 2 5 2 5Z"
        fill="currentColor"
        opacity="0.9"
      />
    </svg>
  ),
  calendar: (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d="M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h1a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h1V3a1 1 0 0 1 1-1Zm14 9H3v8a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-8Z"
        fill="currentColor"
        opacity="0.9"
      />
    </svg>
  ),
  crown: (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d="M5 16 3 7l6 5 3-7 3 7 6-5-2 9H5Zm0 2h14v2H5v-2Z"
        fill="currentColor"
        opacity="0.9"
      />
    </svg>
  ),
}

export default function StatCard({ label, value, sublabel, icon = 'leads' }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-black/10 bg-white p-5 shadow-[0_10px_40px_rgba(0,0,0,0.08)] transition hover:-translate-y-[2px] hover:shadow-[0_18px_55px_rgba(0,0,0,0.12)]">
      <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100 bg-[radial-gradient(450px_circle_at_10%_10%,rgba(var(--gh-accent),0.14),transparent_60%)]" />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-black/50">
            {label}
          </div>
          <div className="mt-3 text-3xl font-semibold tracking-tight text-[rgb(var(--gh-black))]">
            {value}
          </div>
          {sublabel ? (
            <div className="mt-2 text-sm text-black/60">{sublabel}</div>
          ) : null}
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-black/10 bg-black/[0.02] text-[rgb(var(--gh-black))]">
          <div className="text-[rgb(var(--gh-accent))]">{ICONS[icon] || ICONS.leads}</div>
        </div>
      </div>

      <div className="relative mt-5 h-1 w-full rounded-full bg-black/5">
        <div className="h-full w-2/5 rounded-full bg-[rgb(var(--gh-accent))] transition group-hover:w-3/5" />
      </div>
    </div>
  )
}
