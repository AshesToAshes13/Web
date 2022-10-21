import { prefixRoutes } from './utils'
import Home from '@/views/Home'

export default [
  ...prefixRoutes('/account', Home, [
    {
      path: 'myaccount',
      name: 'myaccount',
      component: () => import('@/components/Settings/Account.vue'),
      meta: {
        title: 'Аккаунт'
      }
    },
    {
      path: 'karma',
      name: 'karma',
      component: () => import('@/components/Settings/AccKarma.vue'),
      meta: {
        title: 'Карма'
      }
    }
  ])
]
