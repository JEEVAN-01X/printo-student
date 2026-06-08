/**
 * StatusTimeline
 *
 * Visual pipeline: PENDING → PRINTING → READY → COLLECTED
 * CANCELLED breaks the normal flow and shows a red state.
 *
 * Props:
 *   status — string: PENDING | PRINTING | READY | COLLECTED | CANCELLED
 */

const STEPS = [
  {
    key:   'PENDING',
    label: 'Pending',
    desc:  'Your order is in the queue',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round"
        className="w-5 h-5" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    key:   'PRINTING',
    label: 'Printing',
    desc:  'Your file is being printed now',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round"
        className="w-5 h-5" aria-hidden="true">
        <polyline points="6 9 6 2 18 2 18 9" />
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16
                 a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
        <rect x="6" y="14" width="12" height="8" />
      </svg>
    ),
  },
  {
    key:   'READY',
    label: 'Ready',
    desc:  'SMS sent — come collect now',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round"
        className="w-5 h-5" aria-hidden="true">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
  {
    key:   'COLLECTED',
    label: 'Collected',
    desc:  'Order complete — all done',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round"
        className="w-5 h-5" aria-hidden="true">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0
                 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
  },
]

// Maps status → step index (which step is currently active)
const STATUS_INDEX = {
  PENDING:   0,
  PRINTING:  1,
  READY:     2,
  COLLECTED: 3,
  CANCELLED: -1, // Special case
}

function StepDot({ state }) {
  // state: 'completed' | 'active' | 'upcoming'
  const base = 'h-10 w-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-300'
  if (state === 'completed') return (
    <div className={`${base} bg-green-500 text-white`}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="3"
        strokeLinecap="round" strokeLinejoin="round"
        className="w-4 h-4" aria-hidden="true">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </div>
  )
  if (state === 'active') return (
    <div className={`${base} bg-orange-500 text-white ring-4 ring-orange-100`}>
      <div className="h-3 w-3 rounded-full bg-white animate-pulse" />
    </div>
  )
  return (
    <div className={`${base} bg-stone-200 text-stone-400`}>
      <div className="h-3 w-3 rounded-full bg-stone-300" />
    </div>
  )
}

export default function StatusTimeline({ status }) {
  // Handle CANCELLED separately
  if (status === 'CANCELLED') {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest">
          Order Status
        </p>
        <div className="flex items-center gap-4 bg-red-50 border border-red-200 rounded-xl px-4 py-4">
          <div className="h-10 w-10 rounded-full bg-red-100 border border-red-300 flex items-center justify-center shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round"
              className="w-5 h-5 text-red-500" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </div>
          <div>
            <p className="font-bold text-red-700 text-sm">Order Cancelled</p>
            <p className="text-xs text-red-600 mt-0.5">
              This order was cancelled. Please re-submit or visit the shop.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const activeIndex = STATUS_INDEX[status] ?? 0

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest">
        Order Status
      </p>

      <div className="flex flex-col">
        {STEPS.map((step, i) => {
          const state =
            i < activeIndex  ? 'completed' :
            i === activeIndex ? 'active'   : 'upcoming'

          const isLast = i === STEPS.length - 1

          return (
            <div key={step.key}>
              {/* Step row */}
              <div className="flex items-center gap-4">
                <StepDot state={state} />
                <div className="flex-1 py-3">
                  <p className={`text-sm font-semibold leading-none ${
                    state === 'upcoming' ? 'text-stone-400' :
                    state === 'active'   ? 'text-orange-600' : 'text-green-700'
                  }`}>
                    {step.label}
                  </p>
                  {state !== 'upcoming' && (
                    <p className="text-xs text-stone-500 mt-1">{step.desc}</p>
                  )}
                </div>
                {/* Status pill on active step */}
                {state === 'active' && (
                  <span className="text-xs font-bold text-orange-500 uppercase tracking-wider shrink-0">
                    Now
                  </span>
                )}
                {state === 'completed' && (
                  <span className="text-xs font-semibold text-green-600 shrink-0">
                    Done
                  </span>
                )}
              </div>

              {/* Connector line between steps */}
              {!isLast && (
                <div className="ml-5 w-0.5 h-4 bg-stone-200" aria-hidden="true" />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}