/**
 * StatusBadge
 *
 * Displays the shop's open / closed state.
 * Maps directly to the `is_accepting_orders` boolean from GET /config.
 */
export default function StatusBadge({ isOpen }) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        px-3 py-1 rounded-full text-xs font-mono font-semibold tracking-widest uppercase
        ${isOpen
          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          : 'bg-red-50 text-red-700 border border-red-200'
        }
      `}
    >
      {/* Live indicator dot */}
      <span
        className={`
          h-1.5 w-1.5 rounded-full
          ${isOpen ? 'bg-emerald-500 animate-pulse-slow' : 'bg-red-400'}
        `}
        aria-hidden="true"
      />
      {isOpen ? 'Open' : 'Closed'}
    </span>
  )
}