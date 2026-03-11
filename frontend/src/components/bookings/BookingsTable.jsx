import BookingStatusPill from './BookingStatusPill.jsx'
import Button from '../ui/Button.jsx'

export default function BookingsTable({ rows, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-black/10 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="border-b px-3 py-2 text-left text-xs font-semibold text-black/60">Lead</th>
            <th className="border-b px-3 py-2 text-left text-xs font-semibold text-black/60">Property</th>
            <th className="border-b px-3 py-2 text-left text-xs font-semibold text-black/60">Room/Bed</th>
            <th className="border-b px-3 py-2 text-left text-xs font-semibold text-black/60">Start</th>
            <th className="border-b px-3 py-2 text-left text-xs font-semibold text-black/60">Amount</th>
            <th className="border-b px-3 py-2 text-left text-xs font-semibold text-black/60">Payment</th>
            <th className="border-b px-3 py-2 text-left text-xs font-semibold text-black/60">Status</th>
            <th className="border-b px-3 py-2 text-right text-xs font-semibold text-black/60">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((b) => (
            <tr key={b._id} className="hover:bg-gray-50">
              <td className="border-b px-3 py-2 text-sm">
                <div className="font-medium text-black/80">{b.lead?.name || '-'}</div>
                <div className="text-xs text-black/50">{b.lead?.phone || ''}</div>
              </td>
              <td className="border-b px-3 py-2 text-sm">{b.propertyName}</td>
              <td className="border-b px-3 py-2 text-sm">{[b.roomName, b.bedName].filter(Boolean).join(' / ') || '-'}</td>
              <td className="border-b px-3 py-2 text-sm">{b.startDate}</td>
              <td className="border-b px-3 py-2 text-sm">₹{Number(b.amount || 0).toLocaleString()}</td>
              <td className="border-b px-3 py-2 text-sm">{b.paymentStatus || 'Unpaid'}</td>
              <td className="border-b px-3 py-2 text-sm">
                <BookingStatusPill status={b.status} />
              </td>
              <td className="border-b px-3 py-2 text-right">
                <div className="inline-flex items-center gap-2">
                  <Button size="sm" variant="ghost" onClick={() => onEdit?.(b)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => onDelete?.(b)}>
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
