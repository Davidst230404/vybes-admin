import api from './api'

export const categoryService = {
  /**
   * Fetch all categories with venue counts.
   *
   * @returns {Promise<array>}
   */
  async list() {
    const response = await api.get('/admin/categories')
    return response.data?.data
  },

  /**
   * Fetch single category by ID.
   *
   * @param {number|string} id
   * @returns {Promise<object>}
   */
  async get(id) {
    const response = await api.get(`/admin/categories/${id}`)
    return response.data?.data
  },

  /**
   * Create new category.
   *
   * @param {{ name: string, slug?: string, description?: string, icon?: string, is_active?: boolean, sort_order?: number }} payload
   * @returns {Promise<object>}
   */
  async create(payload) {
    const response = await api.post('/admin/categories', payload)
    return response.data
  },

  /**
   * Update existing category.
   *
   * @param {number|string} id
   * @param {{ name?: string, slug?: string, description?: string, icon?: string, is_active?: boolean, sort_order?: number }} payload
   * @returns {Promise<object>}
   */
  async update(id, payload) {
    const response = await api.put(`/admin/categories/${id}`, payload)
    return response.data
  },

  /**
   * Delete category if no venues are assigned.
   *
   * @param {number|string} id
   * @returns {Promise<object>}
   */
  async delete(id) {
    const response = await api.delete(`/admin/categories/${id}`)
    return response.data
  },
}

export default categoryService
