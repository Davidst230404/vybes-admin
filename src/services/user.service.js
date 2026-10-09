import api from './api'

export const userService = {
  /**
   * Fetch paginated list of users with optional search and role filtering.
   *
   * @param {object} params
   * @param {number} [params.page]
   * @param {number} [params.per_page]
   * @param {string} [params.search]
   * @param {number} [params.role_id]
   * @param {string} [params.role]
   * @returns {Promise<{ data: array, meta: object, links: object }>}
   */
  async list(params = {}) {
    const response = await api.get('/admin/users', { params })
    return response.data
  },

  /**
   * Fetch single user detail by ID.
   *
   * @param {number|string} id
   * @returns {Promise<object>}
   */
  async get(id) {
    const response = await api.get(`/admin/users/${id}`)
    return response.data?.data
  },

  /**
   * Update user details and role.
   *
   * @param {number|string} id
   * @param {{ name?: string, email?: string, role_id?: number, phone?: string, status?: string }} payload
   * @returns {Promise<object>}
   */
  async update(id, payload) {
    const response = await api.patch(`/admin/users/${id}`, payload)
    return response.data
  },

  /**
   * Suspend a user account.
   *
   * @param {number|string} id
   * @param {string} [reason]
   * @returns {Promise<object>}
   */
  async suspend(id, reason = '') {
    const response = await api.post(`/admin/users/${id}/suspend`, { reason })
    return response.data
  },

  /**
   * Reactivate a suspended user account.
   *
   * @param {number|string} id
   * @param {string} [reason]
   * @returns {Promise<object>}
   */
  async reactivate(id, reason = '') {
    const response = await api.post(`/admin/users/${id}/reactivate`, { reason })
    return response.data
  },
}

export default userService
