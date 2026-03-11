export default function LeadCard({ lead }) {
  return (
    <div className="rounded border border-gray-200 bg-white p-3 shadow-sm">
      <div className="text-sm font-semibold">{lead.name}</div>
      <div className="mt-1 text-xs text-gray-700">{lead.phone}</div>
      <div className="mt-1 text-xs text-gray-700">Source: {lead.source}</div>
      <div className="mt-1 text-xs text-gray-700">
        Agent: {lead.assignedAgent?.name || '-'}
      </div>
    </div>
  )
}
