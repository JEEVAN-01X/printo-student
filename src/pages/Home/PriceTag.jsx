/**
 * PriceTag
 *
 * Displays a single print price (B&W or Colour).
 * Per-spec (Section 08): reference only, no calculation.
 *
 * Props:
 *   label    — e.g. "Black & White"
 *   price    — number, e.g. 1.5
 *   accent   — boolean: highlight this tag (used for colour)
 */
export default function PriceTag({ label, price, accent = false }) {
  return (
    <div
      className={`
        flex flex-col items-center justify-center
        px-5 py-4 rounded-xl border
        ${accent
          ? 'border-brand-orange/30 bg-brand-orange/5'
          : 'border-brand-border bg-brand-paper'
        }
      `}
    >
      <span className="font-mono text-2xl font-semibold text-brand-ink leading-none">
        ₹{price}
      </span>
      <span className="mt-1 text-xs text-brand-muted font-body">
        {label}
      </span>
      <span className="mt-0.5 text-[10px] text-brand-muted/70 font-body">
        per page
      </span>
    </div>
  )
}