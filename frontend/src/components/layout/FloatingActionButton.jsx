export default function FloatingActionButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[rgb(var(--gh-accent))] text-white shadow-[0_18px_40px_rgba(249,115,22,0.45)] transition hover:-translate-y-[2px] hover:shadow-[0_22px_55px_rgba(249,115,22,0.55)]"
      aria-label="Quick action"
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
        <path d="M11 5h2v14h-2V5Zm-6 6h14v2H5v-2Z" fill="currentColor" />
      </svg>
    </button>
  )
}
