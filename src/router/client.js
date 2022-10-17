import Home from '@/views/Home'
import { shouldRedirectToLogin } from './utils'

export default [
  {
    meta: {
      layout: Home
    },
    path: '/clients',
    beforeEnter: shouldRedirectToLogin,
    children: [
      {
        path: '',
        name: 'clients',
        meta: {
          title: 'Контакты'
        },
        component: () => import('@/components/Clients/Clients')
      },
      {
        path: ':client_id',
        name: 'clientPage',
        component: () => import('@/components/Clients/ClientPage'),
        meta: {
          title: 'Клиент'
        }
      }
    ]
  }
]
