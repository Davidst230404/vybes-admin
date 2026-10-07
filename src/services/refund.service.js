import api from './api'

export const refundService = {
  /**
   * Fetch paginated list of platform refunds.
   *
   * @param {object} params
   * @param {number} [params.page]
   * @param {number} [params.per_page]
   * @param {string} [params.status]
   * @returns {Promise<{ data: array, meta: object, links: object }>}
   */
  async list(params = {}) {
    const response = await api.get('/admin/refunds', { params })
    return response.data
  },

  /**
   * Fetch refund detail with payment.
   *
   * @param {number|string} id
   * @returns {Promise<object>}
   */
  async get(id) {
    const response = await api.get(`/admin/refunds/${id}`)
    return response.data?.data
  },

  /**
   * Process refund through PaymentRefundService.
   *
   * @param {{ payment_id: number, amount?: number, reason?: string }} payload
   * @returns {Promise<object>}
   */
  async create(payload) {
    const response = await api.post('/admin/refunds', payload)
    return response.data
  },
}

export default refundService
