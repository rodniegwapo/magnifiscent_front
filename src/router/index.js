import Vue from 'vue'
import VueRouter from 'vue-router'
import { auth, admin, gate, guest, seller, user, userWithAccount } from './middleware.js'
Vue.use(VueRouter)

const routes = [
  {
    path: '*',
    name: 'page-not-found',
    component: () => import('@/pages/PageNotFound.vue')
  },
  {
    path: '/',
    name: 'gate',
    beforeEnter: gate
  },
  {
    path: '/login',
    component: () => import('@/pages/Login.vue'),
    meta: { title: 'Login' }, beforeEnter: guest
  },
  {
    path: '/profile',
    component: () => import('@/pages/Profile.vue'),
    meta: { title: 'Profile' }, beforeEnter: auth
  },
  {
    path: '/register/:referrer_code',
    component: () => import('@/pages/Register.vue'),
    meta: { title: 'Register' }, beforeEnter: guest
  },
  {
    path: '/reset-password',
    component: () => import('@/pages/ResetPassword.vue'),
    meta: { title: 'Reset Password' }, beforeEnter: guest
  },
  {
    path: '/terms-of-service',
    component: () => import('@/pages/TermsOfService.vue'),
    meta: { title: 'Terms of Service' }, beforeEnter: guest
  },
  {
    path: '/update-password/:token',
    component: () => import('@/pages/UpdatePassword.vue'),
    meta: { title: 'Update Password' }, beforeEnter: guest
  },
  {
    path: '/admin',
    component: { render: (c) => c('router-view') },
    children: [
      {
        path: 'announcements', component: () => import('@/pages/admin/Announcements.vue'),
        meta: { title: 'Announcements' }, beforeEnter: admin
      },
      {
        path: 'account-summary/:user_id/:year/:month', component: () => import('@/pages/admin/AccountSummary.vue'),
        meta: { title: 'Account Summary' }, beforeEnter: admin
      },
      {
        path: 'dashboard', component: () => import('@/pages/admin/Dashboard.vue'),
        meta: { title: 'Dashboard' }, beforeEnter: admin
      },
      {
        path: 'encashments', component: () => import('@/pages/admin/Encashments.vue'),
        meta: { title: 'Encashments' }, beforeEnter: admin
      },
      {
        path: 'fund-allocation', component: () => import('@/pages/admin/FundAllocation.vue'),
        meta: { title: 'Fund Allocation' }, beforeEnter: admin
      },
      {
        path: 'monthly-qualifiers', component: () => import('@/pages/admin/MonthlyQualifiers.vue'),
        meta: { title: 'Monthly Qualifiers' }, beforeEnter: admin
      },
      {
        path: 'monthly-reports', component: () => import('@/pages/admin/MonthlyReports.vue'),
        meta: { title: 'Monthly Reports' }, beforeEnter: admin
      },
      {
        path: 'top-distributors', component: () => import('@/pages/admin/TopDistributors.vue'),
        meta: { title: 'Top 50 Distributors' }, beforeEnter: admin
      },
      {
        path: 'package-codes', component: () => import('@/pages/admin/PackageCodes.vue'),
        meta: { title: 'Package Codes' }, beforeEnter: admin
      },
      {
        path: 'tickets', component: () => import('@/pages/admin/Tickets.vue'),
        meta: { title: 'Tickets' }, beforeEnter: admin
      },
      {
        path: 'users', component: () => import('@/pages/admin/Users.vue'),
        meta: { title: 'Users' }, beforeEnter: admin
      }
    ]
  },
  {
    path: '/seller',
    component: { render: (c) => c('router-view') },
    children: [
      {
        path: 'dashboard', component: () => import('@/pages/seller/Dashboard.vue'),
        meta: { title: 'Dashboard' }, beforeEnter: seller
      },
      {
        path: 'package-codes', component: () => import('@/pages/seller/PackageCodes.vue'),
        meta: { title: 'Package Codes' }, beforeEnter: seller
      }
    ]
  },
  {
    path: '/settings',
    component: () => import('@/pages/Settings.vue'),
    beforeEnter: auth
  },
  {
    path: '/user',
    component: { render: (c) => c('router-view') },
    beforeEnter: user,
    children: [
      {
        path: 'account-summary', component: () => import('@/pages/user/AccountSummary.vue'),
        meta: { title: 'Account Summary' }, beforeEnter: userWithAccount
      },
      {
        path: 'dashboard', component: () => import('@/pages/user/Dashboard.vue'),
        meta: { title: 'Dashboard' }, beforeEnter: user
      },
      {
        path: 'direct-referral', component: () => import('@/pages/user/DirectReferral.vue'),
        meta: { title: 'Direct Referral' }, beforeEnter: userWithAccount
      },
      {
        path: 'encashments', component: () => import('@/pages/user/Encashments.vue'),
        meta: { title: 'Encashments' }, beforeEnter: userWithAccount
      },
      {
        path: 'notification', component: () => import('@/pages/user/Notification.vue'),
        meta: { title: 'Notification' }, beforeEnter: user
      },
      {
        path: 'table-of-exit', component: () => import('@/pages/user/TableOfExit.vue'),
        meta: { title: 'Table Of Exit' }, beforeEnter: userWithAccount
      },
      {
        path: 'tickets', component: () => import('@/pages/user/Ticket.vue'),
        meta: { title: 'Tickets' }, beforeEnter: user
      },
      {
        path: 'transaction', component: () => import('@/pages/user/Transactions.vue'),
        meta: { title: 'Transaction' }, beforeEnter: userWithAccount
      }
    ]
  }
]

export default new  VueRouter({
  mode: 'history',
  routes
})