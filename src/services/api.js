import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 15000,
})

// Request interceptor — attach auth token when available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('vybes_admin_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor — handle common error shapes
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Normalize network errors
    if (!error.response) {
      return Promise.reject({
        type: 'network',
        message: 'Unable to connect to the server. Check your connection and try again.',
      })
    }
    return Promise.reject(error)
  },
)

export default apiClient
