import { useNavigate } from 'react-router-dom'
import { FIELD_RULES } from '../../constants/validation'
import { useOrderForm } from '../../hooks/useOrderForm'
import { useSubmitOrder } from '../../hooks/useSubmitOrder'
import FormField from './FormField'
import FileShareNotice from './FileShareNotice'
import ToggleGroup from './ToggleGroup'
import CharCounter from './CharCounter'

/**
 * OrderForm — Screen 2
 *
 * Day 4 change: onSubmit now calls useSubmitOrder (real POST /orders)
 * instead of the Day 2 mock setTimeout.
 *
 * useOrderForm handles: field state, validation, touched tracking.
 * useSubmitOrder handles: fetch, error classification, context write, navigation.
 */
export default function OrderForm() {
  const { submitOrder, submitError, isSubmitting: isPosting } = useSubmitOrder()

  const {
    formData,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useOrderForm({
    onSubmit: submitOrder,
  })

  // Either the form-level submitting flag OR the network request in flight
  const busy = isSubmitting || isPosting

  // Shared input class — unchanged from Day 2
  const inputClass = (fieldName) => `
    w-full px-4 py-3 rounded-xl border text-sm text-stone-900
    bg-white placeholder:text-stone-400
    transition-colors duration-150
    focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent
    disabled:bg-stone-100 disabled:cursor-not-allowed
    ${touched[fieldName] && errors[fieldName]
      ? 'border-red-400 bg-red-50'
      : 'border-stone-200 hover:border-stone-300'
    }
  `

  return (
    <div className="flex flex-col gap-6">

      {/* ── Top-level submit error (rate limit, network, server) ── */}
      {submitError && (
        <div
          role="alert"
          className="flex items-start gap-3 bg-red-50 border border-red-300 rounded-xl px-4 py-3"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4 text-red-500 shrink-0 mt-0.5"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-sm text-red-700">{submitError}</p>
        </div>
      )}

      {/* ── Section: Personal Details ── */}
      <section>
        <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-4">
          Your Details
        </h2>
        <div className="flex flex-col gap-4">
          <FormField
            label={FIELD_RULES.student_name.label}
            required
            hint="2–60 characters only"
            error={errors.student_name}
            touched={touched.student_name}
          >
            <input
              type="text"
              value={formData.student_name}
              onChange={e => handleChange('student_name', e.target.value)}
              onBlur={() => handleBlur('student_name')}
              disabled={busy}
              maxLength={60}
              autoComplete="name"
              className={inputClass('student_name')}
            />
          </FormField>

          <FormField
            label={FIELD_RULES.student_phone.label}
            required
            hint="10 digits, starts with 6–9"
            error={errors.student_phone}
            touched={touched.student_phone}
          >
            <input
              type="tel"
              value={formData.student_phone}
              onChange={e => {
                const digits = e.target.value.replace(/\D/g, '').slice(0, 10)
                handleChange('student_phone', digits)
              }}
              onBlur={() => handleBlur('student_phone')}
              disabled={busy}
              maxLength={10}
              inputMode="numeric"
              autoComplete="tel"
              className={inputClass('student_phone')}
            />
          </FormField>
        </div>
      </section>

      <hr className="border-stone-100" />

      {/* ── Section: File Details ── */}
      <section>
        <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-4">
          File Details
        </h2>
        <div className="flex flex-col gap-4">
          <FileShareNotice />

          <FormField
            label={FIELD_RULES.file_link.label}
            required
            hint="Google Drive / OneDrive"
            error={errors.file_link}
            touched={touched.file_link}
          >
            <input
              type="url"
              value={formData.file_link}
              onChange={e => handleChange('file_link', e.target.value)}
              onBlur={() => handleBlur('file_link')}
              disabled={busy}
              inputMode="url"
              autoComplete="off"
              className={inputClass('file_link')}
            />
          </FormField>

          <FormField
            label={FIELD_RULES.file_type.label}
            required
            error={errors.file_type}
            touched={touched.file_type}
          >
            <select
              value={formData.file_type}
              onChange={e => handleChange('file_type', e.target.value)}
              onBlur={() => handleBlur('file_type')}
              disabled={busy}
              className={`${inputClass('file_type')} appearance-none cursor-pointer`}
            >
              {FIELD_RULES.file_type.options.map(opt => (
                <option key={opt.value} value={opt.value} disabled={opt.value === ''}>
                  {opt.label}
                </option>
              ))}
            </select>
          </FormField>
        </div>
      </section>

      <hr className="border-stone-100" />

      {/* ── Section: Print Settings ── */}
      <section>
        <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-4">
          Print Settings
        </h2>
        <div className="flex flex-col gap-4">
          <FormField
            label={FIELD_RULES.copies.label}
            required
            hint="1 to 50"
            error={errors.copies}
            touched={touched.copies}
          >
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleChange('copies', Math.max(1, formData.copies - 1))}
                onBlur={() => handleBlur('copies')}
                disabled={busy || formData.copies <= 1}
                aria-label="Decrease copies"
                className="h-11 w-11 rounded-xl border border-stone-200 bg-white text-stone-600
                           flex items-center justify-center text-xl font-light
                           hover:border-stone-300 active:bg-stone-50
                           disabled:opacity-40 disabled:cursor-not-allowed
                           transition-colors duration-150 shrink-0"
              >
                −
              </button>
              <input
                type="number"
                min={1}
                max={50}
                value={formData.copies}
                onChange={e => {
                  const val = parseInt(e.target.value, 10)
                  if (!isNaN(val)) handleChange('copies', Math.min(50, Math.max(1, val)))
                }}
                onBlur={() => handleBlur('copies')}
                disabled={busy}
                className={`${inputClass('copies')} text-center text-lg font-semibold`}
              />
              <button
                type="button"
                onClick={() => handleChange('copies', Math.min(50, formData.copies + 1))}
                onBlur={() => handleBlur('copies')}
                disabled={busy || formData.copies >= 50}
                aria-label="Increase copies"
                className="h-11 w-11 rounded-xl border border-stone-200 bg-white text-stone-600
                           flex items-center justify-center text-xl font-light
                           hover:border-stone-300 active:bg-stone-50
                           disabled:opacity-40 disabled:cursor-not-allowed
                           transition-colors duration-150 shrink-0"
              >
                +
              </button>
            </div>
          </FormField>

          <FormField
            label={FIELD_RULES.color.label}
            required
            error={errors.color}
            touched={touched.color}
          >
            <ToggleGroup
              options={FIELD_RULES.color.options}
              value={formData.color}
              onChange={val => { handleChange('color', val); handleBlur('color') }}
              disabled={busy}
            />
          </FormField>

          <FormField
            label={FIELD_RULES.double_sided.label}
            required
            error={errors.double_sided}
            touched={touched.double_sided}
          >
            <ToggleGroup
              options={FIELD_RULES.double_sided.options}
              value={formData.double_sided}
              onChange={val => { handleChange('double_sided', val); handleBlur('double_sided') }}
              disabled={busy}
            />
          </FormField>
        </div>
      </section>

      <hr className="border-stone-100" />

      {/* ── Section: Special Instructions ── */}
      <section>
        <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-4">
          Special Instructions
        </h2>
        <FormField
          label={FIELD_RULES.special_instructions.label}
          hint="Optional"
          error={errors.special_instructions}
          touched={touched.special_instructions}
        >
          <div className="relative">
            <textarea
              value={formData.special_instructions}
              onChange={e => handleChange('special_instructions', e.target.value)}
              onBlur={() => handleBlur('special_instructions')}
              disabled={busy}
              maxLength={200}
              rows={3}
              className={`${inputClass('special_instructions')} resize-none`}
            />
            <div className="absolute bottom-2.5 right-3">
              <CharCounter current={formData.special_instructions.length} max={200} />
            </div>
          </div>
        </FormField>
      </section>

      {/* ── Price reference ── */}
      <div className="bg-stone-50 rounded-xl border border-stone-200 px-4 py-3">
        <p className="text-xs text-stone-500 text-center">
          <span className="font-semibold text-stone-700">₹1.5</span>(B&amp;W)
          &nbsp;·&nbsp;
          <span className="font-semibold text-stone-700">₹10</span>(Colour)
          &nbsp;·&nbsp; 
        </p>
      </div>

      {/* ── Submit button ── */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={busy}
        className={`
          w-full py-4 rounded-xl font-semibold text-white text-base
          transition-all duration-200
          focus-visible:outline-none focus-visible:ring-2
          focus-visible:ring-orange-500 focus-visible:ring-offset-2
          ${busy
            ? 'bg-stone-300 cursor-not-allowed'
            : 'bg-orange-500 hover:bg-orange-600 active:scale-95'
          }
        `}
        aria-busy={busy}
      >
        {busy ? (
          <span className="flex items-center justify-center gap-2">
            <span
              className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"
              aria-hidden="true"
            />
            Submitting...
          </span>
        ) : (
          'Submit Order'
        )}
      </button>

      <p className="text-xs text-stone-400 text-center -mt-2">
        You will receive one SMS when your order is ready.
      </p>

    </div>
  )
}