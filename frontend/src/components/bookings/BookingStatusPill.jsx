const styles = {
  Pending: 'bg-orange-50 text-orange-700 border-orange-200',
  Confirmed: 'bg-green-50 text-green-700 border-green-200',
  Cancelled: 'bg-red-50 text-red-700 border-red-200',
  Completed: 'bg-slate-50 text-slate-700 border-slate-200',
}

export default function BookingStatusPill({ status }) {
  const cls = styles[status] || styles.Pending
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${cls}`}>
      {status || 'Pending'}
    </span>
  )
}
