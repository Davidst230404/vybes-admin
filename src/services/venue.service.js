import api from './api'

export const venueService = {
  /**
   * Fetch paginated global list of venues.
   *
   * @param {object} params
   * @param {number} [params.page]
   * @param {number} [params.per_page]
   * @param {string} [params.search]
   * @param {string} [params.status]
   * @param {number} [params.category_id]
   * @returns {Promise<{ data: array, meta: object, links: object }>}
   */
  async list(params = {}) {
    const response = await api.get('/admin/venues', { params })
    return response.data
  },

  /**
   * Fetch venue detail with merchant, category, and resources.
   *
   * @param {number|string} id
   * @returns {Promise<object>}
   */
  async get(id) {
    const response = await api.get(`/admin/venues/${id}`)
    return response.data?.data
  },
}

export default venueService
