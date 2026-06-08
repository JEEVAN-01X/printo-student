import { useState, useCallback } from 'react'
import { validateField, validateForm, isFormValid } from '../constants/validation'

/**
 * useOrderForm
 *
 * Manages ALL form state and validation for the Order Form.
 * No API calls here — this is pure local state management.
 *
 * On Day 3, useSubmitOrder.js will handle POST /orders.
 * This hook hands it the validated formData only.
 *
 * Returns:
 *   formData     — current field values
 *   errors       — per-field error strings (empty = no error)
 *   touched      — tracks which fields the user has interacted with
 *   isSubmitting — true while POST is in flight (Day 3)
 *   handleChange — call on every input change
 *   handleBlur   — call on every input blur (shows error after leaving field)
 *   handleSubmit — call on form submit button click
 *   resetForm    — resets everything to initial state
 */
export function useOrderForm({ onSubmit }) {
  const INITIAL_STATE = {
    student_name:         '',
    student_phone:        '',
    file_link:            '',
    file_type:            '',
    copies:               1,
    color:                'BLACK_WHITE',
    double_sided:         false,
    special_instructions: '',
  }

  const [formData, setFormData]       = useState(INITIAL_STATE)
  const [errors, setErrors]           = useState({})
  const [touched, setTouched]         = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  /**
   * handleChange
   * Called by every input's onChange handler.
   * Validates inline ONLY if the field has been touched (user already left it).
   * This prevents showing errors on fields the user hasn't reached yet.
   */
  const handleChange = useCallback((fieldName, value) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }))

    // Only re-validate if the user has already blurred this field
    setErrors(prev => {
      if (!touched[fieldName]) return prev
      return { ...prev, [fieldName]: validateField(fieldName, value) }
    })
  }, [touched])

  /**
   * handleBlur
   * Called when a field loses focus.
   * Marks the field as touched and validates it immediately.
   */
  const handleBlur = useCallback((fieldName) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }))
    setErrors(prev => ({
      ...prev,
      [fieldName]: validateField(fieldName, formData[fieldName]),
    }))
  }, [formData])

  /**
   * handleSubmit
   * Validates ALL fields at once (touches everything).
   * If valid, calls the onSubmit callback with formData.
   * If invalid, shows all errors and stops.
   */
  const handleSubmit = useCallback(async () => {
    // Touch every field so all errors become visible
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true
      return acc
    }, {})
    setTouched(allTouched)

    // Run full validation
    const allErrors = validateForm(formData)
    setErrors(allErrors)

    if (!isFormValid(allErrors)) {
      // Scroll to first error field
      const firstErrorField = document.querySelector('[data-error="true"]')
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }

    // Valid — hand off to parent (Day 3: will POST to API)
    setIsSubmitting(true)
    try {
      await onSubmit(formData)
    } finally {
      setIsSubmitting(false)
    }
  }, [formData, onSubmit])

  /**
   * resetForm
   * Resets all state to initial. Called from Confirmation screen's
   * "Submit Another Order" button.
   */
  const resetForm = useCallback(() => {
    setFormData(INITIAL_STATE)
    setErrors({})
    setTouched({})
    setIsSubmitting(false)
  }, [])

  return {
    formData,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
  }
}