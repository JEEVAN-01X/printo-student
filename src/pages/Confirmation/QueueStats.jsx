/**
 * QueueStats
 *
 * Shows queue position and wait estimate.
 * Both values come directly from the POST /orders response.
 *
 * Props:
 *   queuePosition — number, e.g. 3
 *   waitMinutes   — number, e.g. 15
 */
export default function QueueStats({ queuePosition, waitMinutes }) {
  return (
    <div className="grid grid-cols-2 gap-3">

      {/* Queue position */}
      <div className="bg-white rounded-xl border border-stone-200 px-4 py-4 flex flex-col items-center text-center">
        <span
          className="font-black text-4xl text-stone-900 leading-none tabular-nums"
          aria-label={`You are number ${queuePosition} in the queue`}
        >
          #{queuePosition}
        </span>
        <span className="mt-1.5 text-xs text-stone-500 leading-tight">
          in the queue
        </span>
      </div>

      {/* Wait estimate */}
      <div className="bg-white rounded-xl border border-stone-200 px-4 py-4 flex flex-col items-center text-center">
        <span
          className="font-black text-4xl text-orange-500 leading-none tabular-nums"
          aria-label={`Estimated wait approximately ${waitMinutes} minutes`}
        >
          ~{waitMinutes}
          <span className="text-xl font-semibold text-stone-400 ml-0.5">m</span>
        </span>
        <span className="mt-1.5 text-xs text-stone-500 leading-tight">
          estimated wait
        </span>
      </div>

    </div>
  )
}