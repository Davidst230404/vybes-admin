import apiClient from './api'

/**
 * Authentication service.
 * Prepared for Laravel backend at POST /api/auth/login.
 * Do NOT implement fake auth logic here.
 */
const authService = {
  /**
   * @param {Object} credentials
   * @param {string} credentials.email
   * @param {string} credentials.password
   * @param {boolean} credentials.remember
   * @returns {Promise}
   */
  async login({ email, password, remember = false }) {
    const response = await apiClient.post('/api/auth/login', {
      email,
      password,
      remember,
    })
    return response.data
  },

  async logout() {
    const response = await apiClient.post('/api/auth/logout')
    localStorage.removeItem('vybes_admin_token')
    return response.data
  },

  /**
   * Prepared for Laravel Socialite Google OAuth
   * @returns {Promise}
   */
  async getGoogleAuthUrl() {
    const response = await apiClient.get('/api/auth/google/url')
    return response.data
  },
}

export default authService
