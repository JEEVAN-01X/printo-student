import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * useTrackOrder
 *
 * Polls GET /orders/token/:token every 10 seconds.
 *
 * Rules per spec Section 08 + Section 17:
 *   - Polls every 10,000ms using setInterval
 *   - Clears interval on unmount (memory leak prevention)
 *   - Pauses on API error, retries after 30 seconds
 *   - Stops polling entirely when status is COLLECTED or CANCELLED
 *     (terminal states — no further updates possible)
 *   - Countdown resets to 10 after every poll attempt
 *
 * Returns:
 *   order        — full order object from GET /orders/token/:token
 *   loading      — true only on the very first load
 *   error        — string | null — shown in the error state card
 *   countdown    — number 10→0, resets after each poll
 *   lastUpdated  — Date | null — timestamp of last successful fetch
 *   retry        — function — manual retry after error
 */

const POLL_INTERVAL_MS  = 10_000   // 10 seconds normal polling
const ERROR_RETRY_MS    = 30_000   // 30 seconds after an error
const TERMINAL_STATUSES = ['COLLECTED', 'CANCELLED']

export function useTrackOrder(tokenNumber) {
  const [order, setOrder]             = useState(null)
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(null)
  const [countdown, setCountdown]     = useState(10)
  const [lastUpdated, setLastUpdated] = useState(null)

  // Refs so closures inside intervals always see latest values
  const intervalRef    = useRef(null)
  const countdownRef   = useRef(null)
  const isTerminalRef  = useRef(false)
  const retryDelayRef  = useRef(POLL_INTERVAL_MS)

  // ── Fetch once ────────────────────────────────────────────────────
  const fetchOrder = useCallback(async () => {
  if (isTerminalRef.current) return

  // TEMPORARY MOCK — delete when Person A's backend is ready
  await new Promise(r => setTimeout(r, 800))
  setOrder({
    token_number:         tokenNumber,
    student_name: (() => { try { return JSON.parse(sessionStorage.getItem('printo_order'))?.student_name ?? 'Student' } catch { return 'Student' } })(),
    status:               'PENDING',
    file_type:            'PDF',
    copies:               2,
    color:                'BLACK_WHITE',
    double_sided:         false,
    special_instructions: '',
  })
  setError(null)
  setLastUpdated(new Date())
  setLoading(false)
  restartPolling(POLL_INTERVAL_MS)
  return
  // END MOCK

  try {   // ← your existing try block continues here
      const apiBase = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1'
      const res     = await fetch(`${apiBase}/orders/token/${tokenNumber}`)
      const json    = await res.json()

      if (!res.ok || !json.success) {
        // 404 = token not found today
        if (res.status === 404) {
          setError(`No order found for token #${tokenNumber} today. Tokens reset daily.`)
        } else {
          setError('Could not load order details. Tap retry or wait for auto-refresh.')
        }
        retryDelayRef.current = ERROR_RETRY_MS
        restartPolling(ERROR_RETRY_MS)
        return
      }

      const orderData = json.data
      setOrder(orderData)
      setError(null)
      setLastUpdated(new Date())
      retryDelayRef.current = POLL_INTERVAL_MS

      // Check for terminal status — stop polling
      if (TERMINAL_STATUSES.includes(orderData.status)) {
        isTerminalRef.current = true
        stopPolling()
        stopCountdown()
        setCountdown(null) // null = don't show countdown
      } else {
        restartPolling(POLL_INTERVAL_MS)
      }
    } catch {
      // fetch() threw — network failure
      setError('No internet connection. Tap retry or move to a better signal area.')
      retryDelayRef.current = ERROR_RETRY_MS
      restartPolling(ERROR_RETRY_MS)
    } finally {
      setLoading(false)
    }
  }, [tokenNumber])

  // ── Countdown ticker ─────────────────────────────────────────────
  function startCountdown(seconds) {
    stopCountdown()
    setCountdown(seconds)
    let remaining = seconds
    countdownRef.current = setInterval(() => {
      remaining -= 1
      if (remaining <= 0) {
        stopCountdown()
        setCountdown(0)
      } else {
        setCountdown(remaining)
      }
    }, 1_000)
  }

  function stopCountdown() {
    if (countdownRef.current) {
      clearInterval(countdownRef.current)
      countdownRef.current = null
    }
  }

  // ── Polling control ───────────────────────────────────────────────
  function stopPolling() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  function restartPolling(delayMs) {
    stopPolling()
    stopCountdown()

    const seconds = Math.round(delayMs / 1_000)
    startCountdown(seconds)

    intervalRef.current = setInterval(() => {
      fetchOrder()
    }, delayMs)
  }

  // ── Manual retry ─────────────────────────────────────────────────
  const retry = useCallback(() => {
    setError(null)
    setLoading(true)
    stopPolling()
    stopCountdown()
    fetchOrder()
  }, [fetchOrder])

  // ── Mount / unmount ───────────────────────────────────────────────
  useEffect(() => {
    if (!tokenNumber) {
      setError('No token number provided.')
      setLoading(false)
      return
    }

    // Initial fetch
    fetchOrder()

    // Cleanup on unmount — critical to prevent memory leaks
    return () => {
      stopPolling()
      stopCountdown()
    }
  }, [tokenNumber, fetchOrder])

  return { order, loading, error, countdown, lastUpdated, retry }
}