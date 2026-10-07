import api from './api'

export const approvalService = {
  /**
   * Fetch applications list (default status: pending).
   *
   * @param {object} params
   * @param {string} [params.status='pending']
   * @returns {Promise<{ merchants: array, organizers: array }>}
   */
  async list(params = {}) {
    const response = await api.get('/admin/approvals', { params })
    return response.data?.data
  },

  /**
   * Update approval status of a merchant.
   *
   * @param {number|string} merchantId
   * @param {'approved'|'rejected'|'pending'} status
   * @returns {Promise<object>}
   */
  async updateMerchant(merchantId, status) {
    const response = await api.post(`/admin/approvals/merchants/${merchantId}`, { status })
    return response.data
  },

  /**
   * Update approval status of an organizer.
   *
   * @param {number|string} organizerId
   * @param {'approved'|'rejected'|'pending'} status
   * @returns {Promise<object>}
   */
  async updateOrganizer(organizerId, status) {
    const response = await api.post(`/admin/approvals/organizers/${organizerId}`, { status })
    return response.data
  },
}

export default approvalService
