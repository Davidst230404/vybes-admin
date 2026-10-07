import api from './api'

/**
 * Authentication service communicating directly with verified Laravel Sanctum API endpoints:
 * - POST /api/auth/login
 * - POST /api/auth/logout
 * - GET  /api/auth/me
 */
export const authService = {
  /**
   * Log in user using email and password.
   *
   * @param {{ email: string, password: string }} credentials
   * @returns {Promise<{ message: string, data: { user: object, token: string, token_type: string } }>}
   */
  async login(credentials) {
    const response = await api.post('/auth/login', {
      email: credentials.email,
      password: credentials.password,
    })
    return response.data
  },

  /**
   * Retrieve current authenticated user along with role and permissions.
   *
   * @returns {Promise<{ data: { user: object } }>}
   */
  async me() {
    const response = await api.get('/auth/me')
    return response.data
  },

  /**
   * Revoke current Sanctum access token and log out.
   *
   * @returns {Promise<{ message: string }>}
   */
  async logout() {
    const response = await api.post('/auth/logout')
    return response.data
  },
}

export default authService
