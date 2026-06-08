import api from './api'

export async function submitOrder(payload) {
  const response = await api.post('/orders', payload)

  const data = response.data?.data
  if (!data || typeof data.token_number !== 'number') {
    throw {
      message: 'Order was submitted but we received an unexpected response. Please check with the shop.',
      code: 'SERVER',
      fieldErrors: {},
    }
  }

  return data
}

export async function fetchOrderByToken(token) {
  const response = await api.get(`/orders/token/${token}`)

  const data = response.data?.data
  if (!data) {
    throw {
      message: 'Order not found. Please check your token number.',
      code: 'NOT_FOUND',
      fieldErrors: {},
    }
  }

  return data
}