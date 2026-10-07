import api from './api'

export const bookingService = {
  /**
   * Fetch paginated global list of bookings.
   *
   * @param {object} params
   * @param {number} [params.page]
   * @param {number} [params.per_page]
   * @param {string} [params.booking_code]
   * @param {string} [params.status]
   * @param {number} [params.venue_id]
   * @returns {Promise<{ data: array, meta: object, links: object }>}
   */
  async list(params = {}) {
    const response = await api.get('/admin/bookings', { params })
    return response.data
  },

  /**
   * Fetch booking detail with user, venue, items, and payment.
   *
   * @param {number|string} id
   * @returns {Promise<object>}
   */
  async get(id) {
    const response = await api.get(`/admin/bookings/${id}`)
    return response.data?.data
  },
}

export default bookingService
