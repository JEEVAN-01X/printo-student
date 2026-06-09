import { useState, useEffect, useCallback } from 'react'

export function useShopConfig() {
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchConfig = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/v1/config')
      const data = await res.json()
      if (data?.success) {
        setConfig(data.data.config)
      } else {
        setError({ message: 'Failed to load shop status', code: 'API' })
      }
    } catch {
      setError({ message: 'Cannot reach server', code: 'NETWORK' })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchConfig()
  }, [fetchConfig])

  return { config, loading, error, retry: fetchConfig }
}