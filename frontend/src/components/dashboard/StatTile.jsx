function Icon({ name }) {
  const cls = 'h-4 w-4'
  switch (name) {
    case 'users':
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none">
          <path
            d="M16 11c1.66 0 3-1.34 3-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3ZM8 11c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3Zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13Zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5C23 14.17 18.33 13 16 13Z"
            fill="currentColor"
            opacity="0.9"
          />
        </svg>
      )
    case 'clock':
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none">
          <path
            d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2Zm1 11h5v-2h-4V6h-2v7Z"
            fill="currentColor"
            opacity="0.9"
          />
        </svg>
      )
    case 'calendar':
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none">
          <path
            d="M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h1a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h1V3a1 1 0 0 1 1-1Zm14 9H3v8a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-8Z"
            fill="currentColor"
            opacity="0.9"
          />
        </svg>
      )
    case 'check':
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none">
          <path
            d="m9 16.17-3.88-3.88L3.7 13.7 9 19l12-12-1.41-1.41L9 16.17Z"
            fill="currentColor"
            opacity="0.9"
          />
        </svg>
      )
    case 'spark':
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none">
          <path
            d="M11 21s-1-3 1-6 4-4 4-7-2-5-2-5 1 3-1 6-4 4-4 7 2 5 2 5Z"
            fill="currentColor"
            opacity="0.9"
          />
        </svg>
      )
    case 'shield':
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none">
          <path
            d="M12 2 4 5v6c0 5 3.4 9.6 8 11 4.6-1.4 8-6 8-11V5l-8-3Zm-1 15-4-4 1.4-1.4L11 14.2l4.6-4.6L17 11l-6 6Z"
            fill="currentColor"
            opacity="0.9"
          />
        </svg>
      )
    case 'alert':
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none">
          <path
            d="M12 2 1 21h22L12 2Zm1 14h-2v-2h2v2Zm0-4h-2V8h2v4Z"
            fill="currentColor"
            opacity="0.9"
          />
        </svg>
      )
    default:
      return null
  }
}

function Trend({ trend, value }) {
  if (!trend || !value) return null
  const up = trend === 'up'
  return (
    <div
      className={`text-xs font-medium ${
        up ? 'text-emerald-600' : 'text-red-500'
      }`}
    >
      {up ? '↑' : '↓'} {value}
    </div>
  )
}

export default function StatTile({
  title,
  value,
  suffix,
  icon,
  trend,
  trendValue,
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm transition hover:-translate-y-[1px] hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[rgba(var(--gh-accent),0.12)] text-[rgb(var(--gh-accent))]">
          <Icon name={icon} />
        </div>
        <Trend trend={trend} value={trendValue} />
      </div>

      <div className="mt-3 text-[22px] font-semibold leading-none tracking-tight text-[rgb(var(--gh-black))]">
        {value}
        {suffix ? <span className="ml-1 text-sm font-medium text-black/50">{suffix}</span> : null}
      </div>
      <div className="mt-1 text-xs text-black/50">{title}</div>
    </div>
  )
}
