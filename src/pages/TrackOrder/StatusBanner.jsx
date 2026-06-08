/**
 * StatusBanner
 *
 * Prominent banner shown only for READY and CANCELLED.
 * For READY: green banner, "Come collect now"
 * For CANCELLED: red banner, "Please re-submit"
 * For all other statuses: renders nothing
 *
 * Props:
 *   status      — string
 *   tokenNumber — number
 */
export default function StatusBanner({ status, tokenNumber }) {
  if (status === 'READY') {
    return (
      <div
        role="alert"
        className="flex items-start gap-3 bg-green-50 border-2 border-green-400 rounded-xl px-4 py-4"
      >
        {/* Green checkmark circle */}
        <div className="shrink-0 h-8 w-8 rounded-full bg-green-400 flex items-center justify-center mt-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
            fill="none" stroke="white" strokeWidth="3"
            strokeLinecap="round" strokeLinejoin="round"
            className="w-4 h-4" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div>
          <p className="font-black text-green-800 text-base">
            Your order #{tokenNumber} is ready!
          </p>
          <p className="text-sm text-green-700 mt-1 leading-relaxed">
            Come to the shop now to collect and pay.
            Show this screen or just say your token number.
          </p>
        </div>
      </div>
    )
  }

  if (status === 'CANCELLED') {
    return (
      <div
        role="alert"
        className="flex items-start gap-3 bg-red-50 border-2 border-red-300 rounded-xl px-4 py-4"
      >
        <div className="shrink-0 h-8 w-8 rounded-full bg-red-400 flex items-center justify-center mt-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
            fill="none" stroke="white" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round"
            className="w-4 h-4" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </div>
        <div>
          <p className="font-black text-red-800 text-base">
            Order #{tokenNumber} was cancelled
          </p>
          <p className="text-sm text-red-700 mt-1 leading-relaxed">
            This usually happens if the file link was inaccessible.
            Please re-submit with a public sharing link.
          </p>
        </div>
      </div>
    )
  }

  return null
}