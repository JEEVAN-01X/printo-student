import { createContext, useContext, useState, useCallback } from 'react'

const OrderContext = createContext(null)
const STORAGE_KEY = 'printo_order'

export function OrderProvider({ children }) {
  const [confirmedOrder, setConfirmedOrderState] = useState(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  const setConfirmedOrder = useCallback((order) => {
    setConfirmedOrderState(order)
    try {
      if (order) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(order))
      else sessionStorage.removeItem(STORAGE_KEY)
    } catch {}
  }, [])

  const clearOrder = useCallback(() => {
    setConfirmedOrderState(null)
    try { sessionStorage.removeItem(STORAGE_KEY) } catch {}
  }, [])

  return (
    <OrderContext.Provider value={{ confirmedOrder, setConfirmedOrder, clearOrder }}>
      {children}
    </OrderContext.Provider>
  )
}

export function useOrderContext() {
  const ctx = useContext(OrderContext)
  if (!ctx) throw new Error('useOrderContext must be used inside <OrderProvider>')
  return ctx
}