import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/auth/LoginView.vue'),
    meta: {
      title: 'Sign In — VYBES Admin',
      requiresAuth: false,
    },
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('../views/auth/ForgotPasswordView.vue'),
    meta: {
      title: 'Reset Password — VYBES Admin',
      requiresAuth: false,
    },
  },
  {
    path: '/auth/access-denied',
    name: 'access-denied',
    component: () => import('../views/auth/AccessDeniedView.vue'),
    meta: {
      title: 'Access Denied — VYBES Admin',
      requiresAuth: false,
    },
  },
  {
    path: '/auth/session-expired',
    name: 'session-expired',
    component: () => import('../views/auth/SessionExpiredView.vue'),
    meta: {
      title: 'Session Expired — VYBES Admin',
      requiresAuth: false,
    },
  },
  {
    path: '/',
    redirect: '/login',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.afterEach((to) => {
  if (to.meta?.title) {
    document.title = to.meta.title
  }
})

export default router