import api from './api'

export const dashboardService = {
  /**
   * Fetch real aggregated platform statistics from the backend.
   *
   * @returns {Promise<{ metrics: object, pending_breakdown: object }>}
   */
  async getOverview() {
    const response = await api.get('/admin/dashboard')
    return response.data?.data
  },
}

export default dashboardService
