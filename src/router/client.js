import Home from '@/views/Home'
import { shouldRedirectToLogin } from './utils'

export default [
  {
    meta: {
      layout: Home,
      title: 'Контакты'
    },
    path: '/clients',
    name: 'clients',
    component: () => import('@/components/Clients/Clients'),
    beforeEnter: shouldRedirectToLogin
  }
]
