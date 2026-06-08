/**
 * ToggleGroup
 *
 * Two-option toggle button used for:
 *   - Print Type: Black & White / Colour
 *   - Sides: Single Sided / Double Sided
 *
 * Props:
 *   options  — array of { value, label }
 *   value    — currently selected value
 *   onChange — called with the new value when selection changes
 *   disabled — disables all options when form is submitting
 */
export default function ToggleGroup({ options, value, onChange, disabled = false }) {
  return (
    <div
      className="grid grid-cols-2 gap-0 rounded-xl border border-stone-200 overflow-hidden"
      role="group"
    >
      {options.map((option) => {
        const isSelected = option.value === value

        return (
          <button
            key={String(option.value)}
            type="button"
            onClick={() => !disabled && onChange(option.value)}
            disabled={disabled}
            aria-pressed={isSelected}
            className={`
              px-4 py-3 text-sm font-medium transition-all duration-150
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-orange-500 focus-visible:ring-inset
              ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
              ${isSelected
                ? 'bg-orange-500 text-white'
                : 'bg-white text-stone-600 hover:bg-stone-50'
              }
            `}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}