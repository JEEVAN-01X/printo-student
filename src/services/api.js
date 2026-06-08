import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, config.data ?? '')
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      return Promise.reject({
        message: 'Cannot reach the server. Please check your connection and try again.',
        code: 'NETWORK',
        fieldErrors: {},
      })
    }

    const { status, data } = error.response

    if (status === 429) {
      return Promise.reject({
        message:
          'You have submitted the maximum 3 orders for today. ' +
          'Please collect your existing orders first.',
        code: 'RATE_LIMITED',
        fieldErrors: {},
      })
    }

    if (status === 400) {
      const fieldErrors = {}
      if (Array.isArray(data?.details)) {
        data.details.forEach((d) => {
          const field = Array.isArray(d.path) ? d.path[0] : d.field
          if (field) fieldErrors[field] = d.message
        })
      }
      return Promise.reject({
        message: data?.error || 'Some fields are invalid. Please check and try again.',
        code: 'VALIDATION',
        fieldErrors,
      })
    }

    if (
      status === 503 ||
      (status === 400 &&
        typeof data?.error === 'string' &&
        data.error.toLowerCase().includes('closed'))
    ) {
      return Promise.reject({
        message: 'The shop is currently closed. New orders are not being accepted.',
        code: 'SHOP_CLOSED',
        fieldErrors: {},
      })
    }

    if (status >= 500) {
      return Promise.reject({
        message: 'Server error. Please try again in a moment.',
        code: 'SERVER',
        fieldErrors: {},
      })
    }

    return Promise.reject({
      message: data?.error || 'An unexpected error occurred.',
      code: 'UNKNOWN',
      fieldErrors: {},
    })
  }
)

export default api