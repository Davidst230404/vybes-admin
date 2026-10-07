import { useAuthStore } from '../stores/auth'
import { AUTH_TOKEN_KEY } from '../utils/constants'

/**
 * Configure global navigation guards for authentication and admin authorization flow.
 * Uses modern return-value pattern (Vue Router 4+).
 *
 * @param {import('vue-router').Router} router
 */
export function setupRouterGuards(router) {
  router.beforeEach(async (to) => {
    const authStore = useAuthStore()
    const token = localStorage.getItem(AUTH_TOKEN_KEY)

    // Hydrate user profile if token is present but user state is empty
    if (token && !authStore.user) {
      try {
        await authStore.fetchCurrentUser()
      } catch {
        // Token was invalid or expired, authStore has already cleared token & user
      }
    }

    const isAuthenticated = authStore.isAuthenticated
    const requiresAuth = to.matched.some((record) => record.meta?.requiresAuth)
    const isGuestOnly = to.matched.some((record) => record.meta?.guestOnly)

    // Protected route: require authentication and admin role
    if (requiresAuth) {
      if (!isAuthenticated) {
        return {
          name: 'login',
          query: to.fullPath !== '/' && to.name !== 'dashboard' ? { redirect: to.fullPath } : undefined,
        }
      }

      // Authenticated but not an authorized admin
      if (!authStore.isAdmin) {
        return { name: 'access-denied' }
      }
    }

    // If an authenticated non-admin is on access-denied page, allow them
    if (to.name === 'access-denied') {
      if (!isAuthenticated) {
        return { name: 'login' }
      }
      if (authStore.isAdmin) {
        return { name: 'dashboard' }
      }
      return true
    }

    // Guest-only route (e.g. login): redirect authorized admin to dashboard
    if (isGuestOnly && isAuthenticated && authStore.isAdmin) {
      return { name: 'dashboard' }
    }

    return true
  })
}
