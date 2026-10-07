import api from './api'

export const settingsService = {
  /**
   * Fetch all platform settings.
   *
   * @returns {Promise<{ data: array }>}
   */
  async list() {
    const response = await api.get('/admin/settings')
    return response.data
  },

  /**
   * Update platform settings.
   *
   * @param {object} payload
   * @param {number} [payload.booking_hold_duration_minutes]
   * @returns {Promise<{ message: string, data: array }>}
   */
  async update(payload) {
    const response = await api.patch('/admin/settings', payload)
    return response.data
  },
}

export default settingsService
