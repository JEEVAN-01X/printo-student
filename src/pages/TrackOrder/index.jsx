import { useParams, useNavigate } from 'react-router-dom'
import { useTrackOrder } from '../../hooks/useTrackOrder'
import StatusTimeline from './StatusTimeline'
import StatusBanner from './StatusBanner'
import CountdownRefresh from '../../components/ui/CountdownRefresh'

/**
 * TrackOrder — /track/:token
 *
 * Per spec Section 08, Person B Task 7:
 *   - Auto-refreshes every 10 seconds
 *   - Shows current status
 *   - Handles all error states
 *
 * Per spec Section 17 Rule 06 (Index Strategy):
 *   The backend queries by token_number + created_at, both indexed.
 *   GET /orders/token/:token returns today's order matching that token.
 *
 * Guards:
 *   - If :token is not a valid number → show error immediately
 *   - If API returns 404 → token not found today
 *   - If API fails → pause polling 30s, show retry button
 *   - If status is COLLECTED or CANCELLED → stop polling
 */
export default function TrackOrder() {
  const { token }  = useParams()
  const navigate   = useNavigate()
  const tokenNum   = parseInt(token, 10)

  const {
    order,
    loading,
    error,
    countdown,
    lastUpdated,
    retry,
  } = useTrackOrder(isNaN(tokenNum) ? null : tokenNum)

  // ── Status colour helpers ────────────────────────────────────────
  const STATUS_COLORS = {
    PENDING:   { bg: 'bg-amber-50',  border: 'border-amber-300',  text: 'text-amber-700',  dot: 'bg-amber-400'  },
    PRINTING:  { bg: 'bg-blue-50',   border: 'border-blue-300',   text: 'text-blue-700',   dot: 'bg-blue-500'   },
    READY:     { bg: 'bg-green-50',  border: 'border-green-400',  text: 'text-green-700',  dot: 'bg-green-500'  },
    COLLECTED: { bg: 'bg-stone-50',  border: 'border-stone-300',  text: 'text-stone-600',  dot: 'bg-stone-400'  },
    CANCELLED: { bg: 'bg-red-50',    border: 'border-red-300',    text: 'text-red-700',    dot: 'bg-red-500'    },
  }
  const colors = order ? (STATUS_COLORS[order.status] ?? STATUS_COLORS.PENDING) : null

  return (
    <div className="min-h-screen bg-amber-50">

      {/* ── Header ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-amber-50 border-b border-stone-200">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={() => navigate('/confirm')}
            aria-label="Back to home"
            className="flex items-center gap-2 text-stone-600 hover:text-stone-900
                       transition-colors duration-150 text-sm font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
              fill="currentColor" className="w-4 h-4" aria-hidden="true">
              <path fillRule="evenodd"
                d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0
                   11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75
                   0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
                clipRule="evenodd" />
            </svg>
            Home
          </button>
          <span className="text-xl font-bold text-stone-900">
            Printo<span className="text-orange-500">.</span>
          </span>
          <div className="w-14" aria-hidden="true" />
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-20 pb-12">

        {/* ── Page heading ── */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-stone-900">
            Track Order
            {!isNaN(tokenNum) && (
              <span className="text-orange-500"> #{tokenNum}</span>
            )}
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            This page updates automatically every 10 seconds.
          </p>
        </div>

        {/* ── Invalid token ── */}
        {isNaN(tokenNum) && (
          <div className="bg-stone-50 rounded-2xl border border-stone-200 shadow-sm p-6">
            <div className="flex flex-col items-center gap-4 text-center py-4">
              <div className="h-12 w-12 rounded-full bg-red-50 border border-red-200
                              flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round"
                  className="w-5 h-5 text-red-500" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-stone-800">Invalid token number</p>
                <p className="text-sm text-stone-500 mt-1">
                  The URL is malformed. Go back to your confirmation page to get the correct link.
                </p>
              </div>
              <button
                onClick={() => navigate(-1)}
                className="px-5 py-2.5 rounded-xl border border-stone-200 bg-white
                           text-sm font-semibold text-stone-700
                           hover:border-orange-300 hover:text-orange-600
                           active:scale-95 transition-all duration-150"
              >
                Back to Home
              </button>
            </div>
          </div>
        )}

        {/* ── Loading state (first load only) ── */}
        {!isNaN(tokenNum) && loading && (
          <div className="bg-stone-50 rounded-2xl border border-stone-200 shadow-sm p-10
                          flex flex-col items-center gap-4"
            aria-live="polite" aria-label="Loading order status">
            <div className="h-10 w-10 rounded-full border-4 border-orange-500
                            border-t-transparent animate-spin" />
            <p className="text-sm text-stone-500">Loading order #{tokenNum}...</p>
          </div>
        )}

        {/* ── Error state ── */}
        {!isNaN(tokenNum) && !loading && error && (
          <div className="bg-stone-50 rounded-2xl border border-stone-200 shadow-sm p-6
                          flex flex-col gap-5">
            <div className="flex items-start gap-3 bg-red-50 border border-red-200
                            rounded-xl px-4 py-4" role="alert">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round"
                className="w-5 h-5 text-red-500 shrink-0 mt-0.5" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p className="text-sm text-red-700">{error}</p>
            </div>

            {/* Countdown during error pause */}
            {countdown !== null && (
              <CountdownRefresh countdown={countdown} lastUpdated={lastUpdated} />
            )}

            <button
              onClick={retry}
              className="w-full py-3 rounded-xl border border-stone-200 bg-white
                         text-sm font-semibold text-stone-700
                         hover:border-orange-300 hover:text-orange-600
                         active:scale-95 transition-all duration-150"
            >
              Retry Now
            </button>
          </div>
        )}

        {/* ── Success state ── */}
        {!isNaN(tokenNum) && !loading && !error && order && (
          <div className="flex flex-col gap-4">

            {/* ── Status pill card ── */}
            <div className={`rounded-2xl border shadow-sm p-5 flex flex-col gap-5
                             ${colors.bg} ${colors.border}`}>

              {/* Token + status badge row */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono text-stone-400 tracking-widest uppercase mb-1">
                    Token Number
                  </p>
                  <p className="font-black text-4xl text-stone-900 leading-none">
                    #{order.token_number}
                  </p>
                </div>
                {/* Status badge */}
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border
                                 ${colors.bg} ${colors.border}`}>
                  <span className={`h-2 w-2 rounded-full shrink-0 ${colors.dot} ${
                    order.status === 'PRINTING' ? 'animate-pulse' : ''
                  }`} aria-hidden="true" />
                  <span className={`text-xs font-bold uppercase tracking-widest ${colors.text}`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Student name */}
              <p className="text-sm text-stone-600">
                Order for <span className="font-semibold text-stone-800">{order.student_name}</span>
              </p>

              {/* Auto-refresh countdown */}
              <CountdownRefresh countdown={countdown} lastUpdated={lastUpdated} />
            </div>

            {/* ── READY / CANCELLED banner ── */}
            <StatusBanner status={order.status} tokenNumber={order.token_number} />

            {/* ── Timeline ── */}
            <div className="bg-stone-50 rounded-2xl border border-stone-200 shadow-sm p-5">
              <StatusTimeline status={order.status} />
            </div>

            {/* ── Order summary (collapsible details) ── */}
            <div className="bg-stone-50 rounded-2xl border border-stone-200 shadow-sm p-5">
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-4">
                Order Details
              </p>
              <div className="flex flex-col gap-2">
                {[
                  ['File Type',  order.file_type],
                  ['Copies',     order.copies],
                  ['Print Type', order.color === 'BLACK_WHITE' ? 'Black & White' : 'Colour'],
                  ['Sides',      order.double_sided ? 'Double Sided' : 'Single Sided'],
                  ...(order.special_instructions
                    ? [['Instructions', order.special_instructions]]
                    : []),
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between items-start gap-4">
                    <span className="text-xs text-stone-500 shrink-0">{label}</span>
                    <span className="text-xs font-semibold text-stone-800 text-right">
                      {String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Terminal state — no more polling note ── */}
            {(order.status === 'COLLECTED' || order.status === 'CANCELLED') && (
              <p className="text-xs text-stone-400 text-center">
                {order.status === 'COLLECTED'
                  ? 'Order complete. This page will not refresh further.'
                  : 'Order cancelled. Submit a new order from the home screen.'}
              </p>
            )}

            {/* ── Submit another order ── */}
            {(order.status === 'COLLECTED' || order.status === 'CANCELLED') && (
              <button
                onClick={() => navigate('/')}
                className="w-full py-3.5 rounded-xl border border-stone-200 bg-white
                           text-sm font-semibold text-stone-600
                           hover:border-orange-300 hover:text-orange-600
                           active:scale-95 transition-all duration-150"
              >
                Submit Another Order
              </button>
            )}

          </div>
        )}

      </main>
    </div>
  )
} 