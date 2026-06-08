import { useNavigate } from 'react-router-dom'
import { useOrderContext } from '../../context/OrderContext'
import TokenDisplay from './TokenDisplay'
import QueueStats from './QueueStats'
import TrackingLink from './TrackingLink'

export default function Confirmation() {
  const navigate = useNavigate()
  const { confirmedOrder, clearOrder } = useOrderContext()

  const orderData = confirmedOrder ?? (() => {
    try { return JSON.parse(sessionStorage.getItem('printo_order')) } catch { return null }
  })()

  if (!orderData) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center flex flex-col gap-4">
          <p className="text-stone-600">No order found.</p>
          <button
            onClick={() => navigate('/')}
            className="px-5 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-semibold"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  const { token_number, queue_position, wait_minutes, student_name, student_phone } = orderData

  function handleSubmitAnother() {
  clearOrder()
  sessionStorage.removeItem('printo_order')
  window.location.href = '/'
}

  return (
    <div className="min-h-screen bg-amber-50">
      <header className="fixed top-0 left-0 right-0 z-50 bg-amber-50 border-b border-stone-200">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-center">
          <span className="text-xl font-bold text-stone-900">
            Printo<span className="text-orange-500">.</span>
          </span>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-20 pb-12">
        <div className="bg-stone-50 rounded-2xl border border-stone-200 shadow-sm p-6 flex flex-col gap-6">

          <TokenDisplay tokenNumber={token_number} studentName={student_name} />

          <hr className="border-stone-100" />

          <QueueStats queuePosition={queue_position} waitMinutes={wait_minutes} />

          <div role="alert" className="flex items-start gap-3 bg-orange-50 border-2 border-orange-300 rounded-xl px-4 py-4">
            <div className="shrink-0 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className="w-5 h-5 text-orange-500" aria-hidden="true">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-orange-900 text-sm">
                Do not come to the shop until you receive the SMS.
              </p>
              <p className="text-xs text-orange-700 mt-1 leading-relaxed">
                An SMS will be sent to{' '}
                <span className="font-semibold">
                  {student_phone.replace(/(\d{2})(\d{4})(\d{4})/, '$1XXXX$3')}
                </span>{' '}
                the moment your order is ready.
              </p>
            </div>
          </div>

          <TrackingLink tokenNumber={token_number} />

          <hr className="border-stone-100" />

          <button
            onClick={handleSubmitAnother}
            className="w-full py-3.5 rounded-xl border border-stone-200 bg-white
                       text-sm font-semibold text-stone-600
                       hover:border-orange-300 hover:text-orange-600
                       active:scale-95 transition-all duration-150"
          >
            Submit Another Order
          </button>

          <p className="text-xs text-stone-400 text-center -mt-3">
            Pay at the counter ·
          </p>
        </div>
      </main>
    </div>
  )
}