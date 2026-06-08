/**
 * CountdownRefresh
 *
 * Displays "Refreshing in Xs..." with a shrinking progress bar.
 * countdown = null means terminal state — don't render at all.
 * countdown = 0 means fetch is in progress — show "Refreshing..."
 *
 * Props:
 *   countdown    — number | null
 *   lastUpdated  — Date | null
 */
export default function CountdownRefresh({ countdown, lastUpdated }) {
  // Terminal state — order is COLLECTED or CANCELLED
  if (countdown === null) return null

  const isFetching = countdown === 0

  // Format last updated time as HH:MM:SS
  const updatedTime = lastUpdated
    ? lastUpdated.toLocaleTimeString('en-IN', {
        hour:   '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })
    : null

  return (
    <div className="flex flex-col gap-1.5" aria-live="polite" aria-atomic="true">

      {/* Status row */}
      <div className="flex items-center justify-between text-xs text-stone-500">
        <span className="flex items-center gap-1.5">
          {isFetching ? (
            <>
              <span
                className="h-2 w-2 rounded-full bg-orange-400 animate-pulse"
                aria-hidden="true"
              />
              Refreshing...
            </>
          ) : (
            <>
              <span
                className="h-2 w-2 rounded-full bg-stone-300"
                aria-hidden="true"
              />
              {`Refreshing in ${countdown}s`}
            </>
          )}
        </span>
        {updatedTime && (
          <span className="font-mono text-stone-400">
            Updated {updatedTime}
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div
        className="h-0.5 w-full bg-stone-200 rounded-full overflow-hidden"
        role="progressbar"
        aria-label={isFetching ? 'Fetching' : `${countdown} seconds until refresh`}
      >
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-linear ${
            isFetching ? 'bg-orange-400 w-full animate-pulse' : 'bg-orange-300'
          }`}
          style={{
            width: isFetching ? '100%' : `${(countdown / 10) * 100}%`,
          }}
        />
      </div>

    </div>
  )
}