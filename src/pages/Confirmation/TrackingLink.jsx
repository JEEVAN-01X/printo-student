import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * TrackingLink
 *
 * Displays the /track/:token URL with a copy-to-clipboard button.
 * Also renders a "Track My Order" button to navigate directly.
 *
 * Props:
 *   tokenNumber — number
 */
export default function TrackingLink({ tokenNumber }) {
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)

  const trackingPath = `/track/${tokenNumber}`
  const trackingUrl  = `${window.location.origin}${trackingPath}`

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(trackingUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // Fallback for browsers that block clipboard API
      const input = document.createElement('input')
      input.value = trackingUrl
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest text-center">
        Track Your Order
      </p>

      {/* URL display + copy button */}
      <div className="flex items-center gap-2 bg-white border border-stone-200 rounded-xl px-3 py-2.5">
        <span className="flex-1 text-xs font-mono text-stone-500 truncate">
          {trackingUrl}
        </span>
        <button
          onClick={handleCopy}
          aria-label={copied ? 'Link copied' : 'Copy tracking link'}
          className={`
            shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold
            transition-all duration-200
            ${copied
              ? 'bg-green-100 text-green-700 border border-green-200'
              : 'bg-stone-100 text-stone-600 border border-stone-200 hover:bg-stone-200'
            }
          `}
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>

      {/* Navigate button */}
      <button
        onClick={() => navigate(trackingPath)}
        className="w-full py-3 rounded-xl border border-stone-200 bg-white
                   text-sm font-semibold text-stone-700
                   hover:border-orange-300 hover:text-orange-600
                   active:scale-95 transition-all duration-150"
      >
        View Live Status →
      </button>
    </div>
  )
}