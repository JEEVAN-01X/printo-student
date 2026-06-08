import api from './api'

export async function fetchShopConfig() {
  const response = await api.get('/config')

  const data = response.data?.data
  if (!data || typeof data.is_accepting_orders !== 'boolean') {
    throw {
      message: 'Received unexpected data from the server. Please reload the page.',
      code: 'SERVER',
      fieldErrors: {},
    }
  }

  return data
}