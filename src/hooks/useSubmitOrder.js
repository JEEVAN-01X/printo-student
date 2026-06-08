import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOrderContext } from '../context/OrderContext'

/**
 * Error code → human-readable message mapping.
 * Mirrors the normalized codes from the interceptor plan (Day 3).
 * Backend returns these shapes:
 *   400 → validation error   (Joi abortEarly: false)
 *   429 → rate limit error
 *   503 → shop closed mid-session
 *   5xx → server error
 */
const ERROR_MESSAGES = {
  RATE_LIMITED:
    'You have submitted the maximum 3 orders for today. Please collect your existing orders first.',
  SHOP_CLOSED:
    'The shop has closed while you were filling the form. Please try again later.',
  NETWORK:
    'Could not reach the server. Check your connection and try again.',
  SERVER:
    'Something went wrong on our end. Please try again in a moment.',
}

/**
 * useSubmitOrder
 *
 * Handles POST /orders with:
 *   - Real fetch to VITE_API_URL/orders
 *   - Normalized error classification
 *   - OrderContext population on success
 *   - Navigation to /confirm on success
 *
 * Returns:
 *   submitOrder(formData) — async function to call from the form
 *   submitError           — string | null — top-level error to show on the form
 *   isSubmitting          — boolean
 */
let mockTokenCounter = 1
export function useSubmitOrder() {
  const navigate = useNavigate()
  const { setConfirmedOrder } = useOrderContext()
  const [submitError, setSubmitError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submitOrder = useCallback(async (formData) => {
    setIsSubmitting(true)
    setSubmitError(null)

   try {
 // TEMPORARY MOCK
await new Promise(r => setTimeout(r, 1200))
const token = mockTokenCounter++
const orderObj = {
  token_number:   token,
  queue_position: token,
  wait_minutes:   token * 4,
  student_name:   formData.student_name,
  student_phone:  formData.student_phone,
}
sessionStorage.setItem('printo_order', JSON.stringify(orderObj))
setConfirmedOrder(orderObj)
navigate('/confirm')
return
// END MOCK

      const json = await res.json()

      // ── Success ──────────────────────────────────────────────
      if (res.ok && json.success) {
        /**
         * Expected success shape from Person A's backend:
         * {
         *   success: true,
         *   data: {
         *     token_number:   number,
         *     queue_position: number,
         *     wait_minutes:   number,
         *     student_name:   string,
         *     student_phone:  string,
         *   }
         * }
         *
         * If the backend doesn't return queue_position / wait_minutes yet,
         * we fall back to safe defaults so the UI never crashes.
         */
        const data = json.data ?? {}
        setConfirmedOrder({
          token_number:   data.token_number   ?? data.tokenNumber ?? 1,
          queue_position: data.queue_position ?? data.queuePosition ?? 1,
          wait_minutes:   data.wait_minutes   ?? data.waitMinutes   ?? 5,
          student_name:   data.student_name   ?? formData.student_name,
          student_phone:  data.student_phone  ?? formData.student_phone,
        })
        navigate('/confirm')
        return
      }

      // ── Error classification ──────────────────────────────────
      if (res.status === 429) {
        setSubmitError(ERROR_MESSAGES.RATE_LIMITED)
        return
      }

      if (res.status === 503 || json?.error?.code === 'SHOP_CLOSED') {
        setSubmitError(ERROR_MESSAGES.SHOP_CLOSED)
        return
      }

      if (res.status >= 400 && res.status < 500) {
        // Validation error — Joi returns array of messages
        const msgs = json?.error?.details
          ? json.error.details.map(d => d.message).join('. ')
          : json?.error ?? 'Please check your details and try again.'
        setSubmitError(typeof msgs === 'string' ? msgs : 'Please check your details and try again.')
        return
      }

      // 5xx fallthrough
      setSubmitError(ERROR_MESSAGES.SERVER)

    } catch (err) {
      // fetch() itself threw — network failure
      setSubmitError(ERROR_MESSAGES.NETWORK)
    } finally {
      setIsSubmitting(false)
    }
  }, [navigate, setConfirmedOrder])

  return { submitOrder, submitError, isSubmitting }
}