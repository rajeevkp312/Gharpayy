export default function SimpleListCard({
  title,
  badge,
  rightLabel,
  rows,
  emptyText,
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-sm font-semibold">{title}</div>
          {typeof badge === 'number' ? (
            <div className="rounded-full border border-black/10 bg-black/[0.03] px-2 py-0.5 text-xs text-black/60">
              {badge}
            </div>
          ) : null}
        </div>

        {rightLabel ? (
          <div className="text-xs text-black/40">{rightLabel}</div>
        ) : null}
      </div>

      <div className="mt-3 space-y-2">
        {rows && rows.length ? (
          rows.map((r, idx) => (
            <div key={idx} className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-black/80">
                  {r.left}
                </div>
                {r.sub ? (
                  <div className="mt-1 truncate text-xs text-black/40">{r.sub}</div>
                ) : null}
              </div>

              {r.right ? (
                <div
                  className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                    r.rightTone === 'good'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-black/[0.03] text-black/60'
                  }`}
                >
                  {r.right}
                </div>
              ) : null}
            </div>
          ))
        ) : (
          <div className="text-sm text-black/50">{emptyText}</div>
        )}
      </div>
    </div>
  )
}
