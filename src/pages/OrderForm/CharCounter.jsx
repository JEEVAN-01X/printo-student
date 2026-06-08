/**
 * CharCounter
 *
 * Live character count display for textarea fields.
 * Shows "180 / 200" and turns red when near the limit.
 *
 * Props:
 *   current — current character count
 *   max     — maximum allowed characters
 */
export default function CharCounter({ current, max }) {
  const remaining = max - current
  const isNearLimit = remaining <= 30
  const isAtLimit   = remaining <= 0

  return (
    <span
      className={`text-xs font-mono tabular-nums transition-colors duration-200 ${
        isAtLimit   ? 'text-red-500 font-semibold' :
        isNearLimit ? 'text-amber-500' :
        'text-stone-400'
      }`}
      aria-live="polite"
      aria-label={`${current} of ${max} characters used`}
    >
      {current} / {max}
    </span>
  )
}