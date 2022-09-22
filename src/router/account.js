import { shouldRedirectToLogin } from './utils'
import Home from '@/views/Home'

export default [
  {
    meta: {
      layout: Home
    },
    path: '/account',
    beforeEnter: shouldRedirectToLogin,
    children: [
      {
        path: 'myaccount',
        name: 'myaccount',
        component: () => import('@/components/Settings/Account.vue')
      },
      {
        path: 'karma',
        name: 'karma',
        component: () => import('@/components/Settings/AccKarma.vue')
      }
    ]
  }
]
