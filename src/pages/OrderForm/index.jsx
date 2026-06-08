import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import OrderForm from './OrderForm'

/**
 * OrderForm Page — Screen 2
 *
 * Responsibilities:
 *   1. Guard: if shop is closed, redirect to /
 *   2. Render PageWrapper with header + scroll
 *   3. Render the OrderForm inside it
 *
 * Day 2: shop status check uses localStorage (set by Home screen).
 * Day 3: swap for real useShopConfig check.
 */
export default function OrderFormPage() {
  const navigate = useNavigate()

  // Guard: Home screen stores shop status in sessionStorage when it loads.
  // If a student navigates directly to /order without going through Home,
  // we cannot verify shop is open — redirect them to Home first.
  // On Day 3 this will be a real API check.
  useEffect(() => {
    const shopOpen = sessionStorage.getItem('printo_shop_open')
    if (shopOpen === 'false') {
      navigate('/', { replace: true })
    }
  }, [navigate])

  return (
    <div className="min-h-screen bg-amber-50">

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-amber-50 border-b border-stone-200">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            aria-label="Back to home"
            className="flex items-center gap-2 text-stone-600 hover:text-stone-900
                       transition-colors duration-150 text-sm font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
                clipRule="evenodd"
              />
            </svg>
            Back
          </button>

          <span className="text-xl font-bold text-stone-900">
            Printo<span className="text-orange-500">.</span>
          </span>

          {/* Spacer to center the wordmark */}
          <div className="w-14" aria-hidden="true" />
        </div>
      </header>

      {/* Page content */}
      <main className="max-w-lg mx-auto px-4 pt-20 pb-12">

        {/* Page heading */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-stone-900">Place Your Order</h1>
          <p className="text-sm text-stone-500 mt-1">
            Fill in the details below.
          </p>
        </div>

        {/* Form card */}
        <div className="bg-stone-50 rounded-2xl border border-stone-200 shadow-sm p-6">
          <OrderForm />
        </div>

      </main>
    </div>
  )
}