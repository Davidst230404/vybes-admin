import axios from 'axios'
import router from '../router'
import { AUTH_TOKEN_KEY } from '../utils/constants'

const baseURL = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api').replace(/\/+$/, '')

/**
 * Normalize API errors based on real Laravel response structures.
 *
 * @param {import('axios').AxiosError} error
 * @returns {object}
 */
export function normalizeApiError(error) {
  if (!error.response) {
    return {
      status: 0,
      type: 'network',
      message: error.message || 'Network error: could not connect to server',
      errors: {},
      isNetworkError: true,
      original: error,
    }
  }

  const { status, data } = error.response
  const message = data?.message || error.message || 'An unexpected error occurred'
  const errors = data?.errors || {}

  let type = 'unknown'
  if (status === 422) type = 'validation'
  else if (status === 401) type = 'unauthorized'
  else if (status === 403) type = 'forbidden'
  else if (status === 404) type = 'not_found'
  else if (status >= 500) type = 'server'

  return {
    status,
    type,
    message,
    errors,
    isValidationError: status === 422,
    isUnauthorized: status === 401,
    isForbidden: status === 403,
    isNotFound: status === 404,
    isServerError: status >= 500,
    original: error,
  }
}

const api = axios.create({
  baseURL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
})

// Request interceptor: attach Sanctum Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(normalizeApiError(error))
)

// Response interceptor: centralize 401 and error normalization
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalized = normalizeApiError(error)

    if (normalized.status === 401) {
      localStorage.removeItem(AUTH_TOKEN_KEY)

      const currentPath = router.currentRoute?.value?.path || ''
      const isAuthRoute = currentPath.startsWith('/auth/')
      const requestUrl = error.config?.url || ''
      const isLoginRequest = requestUrl.includes('/auth/login')

      // Avoid infinite redirects and keep login accessible
      if (!isAuthRoute && !isLoginRequest) {
        router.push({
          path: '/auth/session-expired',
          query: currentPath && currentPath !== '/' ? { redirect: currentPath } : undefined,
        })
      }
    }

    return Promise.reject(normalized)
  }
)

export default api
