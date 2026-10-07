import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '../services/auth.service'
import { AUTH_TOKEN_KEY } from '../utils/constants'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem(AUTH_TOKEN_KEY) || null)
  const user = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => Boolean(token.value && user.value))
  const userRole = computed(() => user.value?.role?.name || null)
  const userPermissions = computed(() => {
    return Array.isArray(user.value?.role?.permissions)
      ? user.value.role.permissions.map((p) => p.name)
      : []
  })
  const isAdmin = computed(() => userRole.value === 'admin' || userPermissions.value.includes('admin.manage'))

  /**
   * Save token to state and localStorage.
   */
  function setToken(newToken) {
    token.value = newToken
    if (newToken) {
      localStorage.setItem(AUTH_TOKEN_KEY, newToken)
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY)
    }
  }

  /**
   * Clear all local authentication credentials and state.
   */
  function clearAuth() {
    setToken(null)
    user.value = null
    error.value = null
  }

  /**
   * Authenticate with Laravel backend using email and password.
   *
   * @param {{ email: string, password: string }} credentials
   * @returns {Promise<{ user: object, token: string }>}
   */
  async function login(credentials) {
    isLoading.value = true
    error.value = null

    try {
      const response = await authService.login(credentials)
      const authToken = response.data?.token
      const authUser = response.data?.user

      setToken(authToken)
      user.value = authUser

      return { user: authUser, token: authToken }
    } catch (err) {
      error.value = err.message || 'Login failed'
      clearAuth()
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetch current authenticated user with role and permissions via GET /api/auth/me.
   *
   * @returns {Promise<object|null>}
   */
  async function fetchCurrentUser() {
    if (!token.value) {
      user.value = null
      return null
    }

    isLoading.value = true
    error.value = null

    try {
      const response = await authService.me()
      const currentUser = response.data?.user || null
      user.value = currentUser
      return currentUser
    } catch (err) {
      clearAuth()
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Log out from the backend and clear local session.
   */
  async function logout() {
    isLoading.value = true
    try {
      if (token.value) {
        await authService.logout()
      }
    } catch {
      // Even if network fails or token was already revoked, clear locally
    } finally {
      clearAuth()
      isLoading.value = false
    }
  }

  /**
   * Initialize authentication on app start.
   */
  async function initializeAuth() {
    if (token.value && !user.value) {
      try {
        await fetchCurrentUser()
        return true
      } catch {
        return false
      }
    }
    return Boolean(token.value && user.value)
  }

  return {
    token,
    user,
    isLoading,
    error,
    isAuthenticated,
    isAdmin,
    userRole,
    userPermissions,
    login,
    fetchCurrentUser,
    logout,
    clearAuth,
    initializeAuth,
  }
})
