export default function Button({
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[rgba(var(--gh-accent),0.35)] disabled:opacity-50 disabled:pointer-events-none'

  const variants = {
    default:
      'bg-[rgb(var(--gh-black))] text-white shadow-sm hover:shadow-md hover:-translate-y-[1px]',
    gold:
      'bg-[rgb(var(--gh-accent))] text-white shadow-sm hover:shadow-md hover:-translate-y-[1px]',
    ghost:
      'bg-transparent text-[rgb(var(--gh-black))] hover:bg-black/5 border border-black/10',
  }

  const sizes = {
    sm: 'h-9 px-3',
    md: 'h-10 px-4',
    lg: 'h-11 px-5',
  }

  return (
    <button
      className={`${base} ${variants[variant] || variants.default} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    />
  )
}
