import { createRouter, createWebHistory } from 'vue-router'
import { setupRouterGuards } from './guards'
import AdminLayout from '../layouts/AdminLayout.vue'

const routes = [
  {
    path: '/',
    redirect: '/admin/dashboard',
  },
  {
    path: '/dashboard',
    redirect: '/admin/dashboard',
  },
  {
    path: '/admin',
    component: AdminLayout,
    redirect: '/admin/dashboard',
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('../views/DashboardView.vue'),
        meta: { title: 'Dashboard Overview' },
      },
      {
        path: 'users',
        name: 'users',
        component: () => import('../views/users/UsersView.vue'),
        meta: { title: 'Users Management' },
      },
      {
        path: 'users/:id',
        name: 'user-detail',
        component: () => import('../views/users/UserDetailView.vue'),
        meta: { title: 'User Account Details' },
      },
      {
        path: 'approvals',
        name: 'approvals',
        component: () => import('../views/approvals/ApprovalsView.vue'),
        meta: { title: 'Merchant & Organizer Approvals' },
      },
      {
        path: 'categories',
        name: 'categories',
        component: () => import('../views/categories/CategoriesView.vue'),
        meta: { title: 'Categories Management' },
      },
      {
        path: 'moderation',
        name: 'moderation',
        component: () => import('../views/moderation/ModerationView.vue'),
        meta: { title: 'Content Moderation' },
      },
      {
        path: 'bookings',
        name: 'bookings',
        component: () => import('../views/bookings/BookingsView.vue'),
        meta: { title: 'Platform Bookings Supervision' },
      },
      {
        path: 'refunds',
        name: 'refunds',
        component: () => import('../views/refunds/RefundsView.vue'),
        meta: { title: 'Refunds Management' },
      },
      {
        path: 'reviews',
        name: 'reviews',
        component: () => import('../views/reviews/ReviewsView.vue'),
        meta: { title: 'User Reviews' },
      },
      {
        path: 'venues',
        name: 'venues',
        component: () => import('../views/venues/VenuesView.vue'),
        meta: { title: 'Venues Supervision' },
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('../views/settings/PlatformSettingsView.vue'),
        meta: { title: 'Platform Settings' },
      },
      {
        path: 'audit',
        name: 'audit',
        component: () => import('../views/audit/AuditLogView.vue'),
        meta: { title: 'Audit Log' },
      },
      {
        path: 'reports',
        name: 'reports',
        component: () => import('../views/reports/ReportsView.vue'),
        meta: { title: 'Analytics & Reports' },
      },
    ],
  },
  // Backward compatibility aliases
  { path: '/users', redirect: '/admin/users' },
  { path: '/approvals', redirect: '/admin/approvals' },
  { path: '/categories', redirect: '/admin/categories' },
  { path: '/moderation', redirect: '/admin/moderation' },
  { path: '/bookings', redirect: '/admin/bookings' },
  { path: '/refunds', redirect: '/admin/refunds' },
  { path: '/reviews', redirect: '/admin/reviews' },
  { path: '/venues', redirect: '/admin/venues' },
  { path: '/settings', redirect: '/admin/settings' },
  { path: '/audit', redirect: '/admin/audit' },
  { path: '/reports', redirect: '/admin/reports' },

  // Auth routes
  {
    path: '/auth/login',
    name: 'login',
    component: () => import('../views/auth/LoginView.vue'),
    meta: {
      guestOnly: true,
    },
  },
  {
    path: '/auth/session-expired',
    name: 'session-expired',
    component: () => import('../views/auth/SessionExpiredView.vue'),
    meta: {
      guestOnly: true,
    },
  },
  {
    path: '/auth/forgot-password',
    name: 'forgot-password',
    component: () => import('../views/auth/ForgotPasswordView.vue'),
    meta: {
      guestOnly: true,
    },
  },
  {
    path: '/auth/access-denied',
    name: 'access-denied',
    component: () => import('../views/auth/AccessDeniedView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

setupRouterGuards(router)

export default router