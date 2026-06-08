import ShopStatusCard from './ShopStatusCard'
import { useShopConfig } from '../../hooks/useShopConfig'

export default function Home() {
  const { config, loading, error, retry } = useShopConfig()

  const queueSummary = {
    queue_length: 0,
    avg_minutes_per_job: 4,
  }

  return (
    <div className="min-h-screen bg-amber-50">

      <header className="fixed top-0 left-0 right-0 z-50 bg-amber-50 border-b border-stone-200">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <a href="/" className="text-xl font-bold text-stone-900">
            Printo<span className="text-orange-500">.</span>
          </a>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-20 pb-8">

        <div className="mb-6">
          <p className="text-sm text-stone-500 mt-0.5">
            Check queue status before submitting your print job.
          </p>
        </div>

        {loading && (
          <div className="bg-stone-50 rounded-2xl border border-stone-200 p-10
                          flex flex-col items-center gap-4">
            <div className="h-8 w-8 rounded-full border-4 border-orange-500
                            border-t-transparent animate-spin" />
            <p className="text-sm text-stone-500">Checking shop status...</p>
          </div>
        )}

        {!loading && error && (
          <div className="bg-stone-50 rounded-2xl border border-stone-200 p-6
                          flex flex-col items-center gap-4 text-center">
            <div className="h-12 w-12 rounded-full bg-red-50 border border-red-200
                            flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                strokeLinejoin="round" className="w-5 h-5 text-red-500" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-stone-800 text-sm">{error.message}</p>
              {error.code === 'NETWORK' && (
                <p className="text-xs text-stone-500 mt-1">
                  The server may be starting up. Please wait 30 seconds and retry.
                </p>
              )}
            </div>
            <button
              onClick={retry}
              className="px-5 py-2.5 rounded-xl border border-stone-200 bg-white
                         text-sm font-medium text-stone-700
                         hover:border-orange-400 hover:text-orange-600
                         active:scale-95 transition-all duration-150"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && config && (
          <ShopStatusCard config={config} queueSummary={queueSummary} />
        )}

        {/*!loading && !error && (
          <p className="mt-6 text-center text-xs text-stone-400">
            You will receive one SMS when your order is ready.
            Do not come to the shop until then.
          </p>
        )*/}

      </main>
    </div>
  )
}