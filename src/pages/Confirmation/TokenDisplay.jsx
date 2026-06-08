/**
 * TokenDisplay
 *
 * The primary element on the Confirmation screen.
 * Token number shown as large as possible — it's the ONE thing
 * the student needs to remember.
 *
 * Props:
 *   tokenNumber — number, e.g. 14
 *   studentName — string
 */
export default function TokenDisplay({ tokenNumber, studentName }) {
  return (
    <div className="flex flex-col items-center text-center py-6">

      {/* Eyebrow */}
      <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-4">
        Order Confirmed
      </p>

      {/* Token number — the hero element */}
      <div className="relative flex items-center justify-center mb-4">
        {/* Decorative ring */}
        <div className="relative flex flex-col items-center">
          <span className="text-xs font-mono text-stone-400 tracking-widest uppercase mb-1">
            Your Token
          </span>
          <span
            className="font-black text-7xl text-stone-900 leading-none tabular-nums"
            aria-label={`Token number ${tokenNumber}`}
          >
            #{tokenNumber}
          </span>
        </div>
      </div>

      {/* Personalised sub-copy */}
      <p className="text-sm text-stone-500 mt-2">
        Order placed for{' '}
        <span className="font-semibold text-stone-700">{studentName}</span>
      </p>

    </div>
  )
}