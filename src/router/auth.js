import { ifNotAuthenticated } from './utils'

export default [
  {
    meta: {
      title: 'Авторизация',
      fullScreen: true
    },
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login'),
    beforeEnter: ifNotAuthenticated
  }
]
