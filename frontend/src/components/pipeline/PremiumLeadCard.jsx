export default function PremiumLeadCard({ lead }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition hover:-translate-y-[2px] hover:shadow-[0_18px_45px_rgba(0,0,0,0.10)]">
      <div className="text-sm font-semibold tracking-tight text-[rgb(var(--gh-black))]">
        {lead.name}
      </div>
      <div className="mt-1 text-xs text-black/60">{lead.phone}</div>
      <div className="mt-3 flex items-center justify-between text-xs text-black/60">
        <span className="rounded-full border border-black/10 bg-black/5 px-2 py-1">
          {lead.source}
        </span>
        <span className="text-black/70">{lead.assignedAgent?.name || '-'}</span>
      </div>
    </div>
  )
}
