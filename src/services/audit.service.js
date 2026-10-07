import api from './api'

export const auditService = {
  /**
   * Fetch paginated list of audit logs.
   *
   * @param {object} params
   * @param {number} [params.page]
   * @param {number} [params.per_page]
   * @param {number} [params.actor_id]
   * @param {string} [params.action]
   * @param {string} [params.entity_type]
   * @param {string} [params.from_date]
   * @param {string} [params.to_date]
   * @returns {Promise<{ data: array, meta: object, links: object }>}
   */
  async list(params = {}) {
    const response = await api.get('/admin/audit', { params })
    return response.data
  },
}

export default auditService
