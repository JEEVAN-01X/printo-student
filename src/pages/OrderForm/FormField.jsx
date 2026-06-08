/**
 * FormField
 *
 * Reusable wrapper for every form input.
 * Handles: label, required marker, hint text, error display.
 *
 * Props:
 *   label    — field label text
 *   required — shows red asterisk if true
 *   hint     — small grey helper text below label
 *   error    — error string (shown in red below input)
 *   touched  — only show error if this field has been touched
 *   children — the actual <input>, <select>, or <textarea>
 */
export default function FormField({
  label,
  required = false,
  hint,
  error,
  touched = false,
  children,
}) {
  const showError = touched && error

  return (
    <div
      className="flex flex-col gap-1.5"
      data-error={showError ? 'true' : 'false'}
    >
      {/* Label row */}
      <div className="flex items-baseline justify-between">
        <label className="text-sm font-semibold text-stone-700">
          {label}
          {required && (
            <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
          )}
        </label>
        {hint && !showError && (
          <span className="text-xs text-stone-400">{hint}</span>
        )}
      </div>

      {/* Input slot */}
      {children}

      {/* Error message */}
      {showError && (
        <p
          role="alert"
          className="text-xs text-red-600 flex items-center gap-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-3.5 h-3.5 shrink-0"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  )
}