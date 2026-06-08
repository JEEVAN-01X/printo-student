import { useNavigate } from 'react-router-dom'

function StatusBadge({ isOpen }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest ${isOpen ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${isOpen ? 'bg-green-500' : 'bg-red-400'}`} />
      {isOpen ? 'Open' : 'Closed'}
    </span>
  )
}

function PriceTag({ label, price, accent }) {
  return (
    <div className={`flex flex-col items-center justify-center px-5 py-4 rounded-xl border ${accent ? 'border-orange-200 bg-orange-50' : 'border-stone-200 bg-stone-50'}`}>
      <span className="text-2xl font-semibold text-stone-900 leading-none">
        ₹{price}
      </span>
      <span className="mt-1 text-xs text-stone-500">{label}</span>
    </div>
  )
}

export default function ShopStatusCard({ config, queueSummary }) {
  const navigate = useNavigate()

  const { shop_name, is_accepting_orders, bw_price_per_page, colour_price_per_page } = config
  const { queue_length, avg_minutes_per_job } = queueSummary
  const waitMinutes = queue_length * avg_minutes_per_job

  return (
    <div className="bg-stone-50 rounded-2xl border border-stone-200 shadow-sm p-6 flex flex-col gap-6">

      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-stone-400 uppercase tracking-widest mb-1">Campus Print Shop</p>
          <h1 className="text-3xl font-bold text-stone-900">{shop_name}</h1>
        </div>
        <StatusBadge isOpen={is_accepting_orders} />
      </div>

      {!is_accepting_orders && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <p className="font-semibold text-red-700 text-sm">Shop is currently closed</p>
          <p className="text-red-600 text-xs mt-0.5">New orders are not being accepted right now.</p>
        </div>
      )}

      {is_accepting_orders && (
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl px-4 py-3 border border-stone-200">
            <span className="text-3xl font-semibold text-stone-900">{queue_length}</span>
            <p className="text-xs text-stone-500 mt-1">orders in queue</p>
          </div>
          <div className="bg-white rounded-xl px-4 py-3 border border-stone-200">
            <span className="text-3xl font-semibold text-orange-500">~{waitMinutes}<span className="text-base text-stone-400 ml-0.5">min</span></span>
            <p className="text-xs text-stone-500 mt-1">estimated wait</p>
          </div>
        </div>
      )}

      <hr className="border-stone-200" />

      <div>
        <p className="text-xs text-stone-400 uppercase tracking-widest mb-3">Price Reference</p>
        <div className="grid grid-cols-2 gap-3">
          <PriceTag label="Black and White" price={bw_price_per_page} />
          <PriceTag label="Colour" price={colour_price_per_page} accent />
        </div>
      </div>

      <button
        onClick={() => {
  sessionStorage.setItem('printo_shop_open', String(is_accepting_orders))
  navigate('/order')
}}
        disabled={!is_accepting_orders}
        className={`w-full py-4 rounded-xl font-semibold text-white text-base transition-all ${is_accepting_orders ? 'bg-orange-500 hover:bg-orange-600 active:scale-95' : 'bg-stone-300 cursor-not-allowed'}`}
      >
        Place Order
      </button>

      {is_accepting_orders && (
        <p className="text-xs text-stone-400 text-center -mt-3">
          Order from here. Collect after receiving the SMS.
        </p>
      )}

    </div>
  )
}