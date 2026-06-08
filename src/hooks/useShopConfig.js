import { useState, useEffect } from 'react'

const MOCK_CONFIG = {
  shop_name:             'Printo',
  is_accepting_orders:   true,
  bw_price_per_page:     1.5,
  colour_price_per_page: 10,
}

const MOCK_QUEUE = {
  queue_length:        7,
  avg_minutes_per_job: 4,
}

export function useShopConfig() {
  const [config, setConfig]             = useState(null)
  const [queueSummary, setQueueSummary] = useState(null)
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setConfig(MOCK_CONFIG)
      setQueueSummary(MOCK_QUEUE)
      setLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  return { config, queueSummary, loading, error }
}