import { Routes, Route, Navigate } from 'react-router-dom'
import { OrderProvider } from './context/OrderContext'
import Home          from './pages/Home'
import OrderFormPage from './pages/OrderForm'
import Confirmation  from './pages/Confirmation'
import TrackOrder    from './pages/TrackOrder'

export default function App() {
  return (
    <OrderProvider>
      <Routes>
        <Route path="/"               element={<Home />} />
        <Route path="/order"          element={<OrderFormPage />} />
        <Route path="/confirm"        element={<Confirmation />} />
        <Route path="/track/:token"   element={<TrackOrder />} />
        <Route path="*"               element={<Navigate to="/" replace />} />
      </Routes>
    </OrderProvider>
  )
}