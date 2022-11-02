import { shouldRedirectToLogin } from './utils'
import Home from '@/views/Home'

export default [
  {
    path: '/board/:board_id/public',
    name: 'publicBoardWithChildren',
    component: () => import('@/components/Board/publicBoard/PublicBoardWithChildren.vue'),
    meta: {
      title: 'Доска'
    }
  },
  {
    meta: {
      layout: Home
    },
    path: '/board',
    beforeEnter: shouldRedirectToLogin,
    children: [
      {
        path: '',
        name: 'board',
        component: () => import('@/components/Board/Boards'),
        meta: {
          title: 'Доски'
        }
      },
      {
        path: ':board_id',
        children: [
          {
            path: '',
            name: 'boardWithChildren',
            component: () => import('@/components/Board/BoardWithChildren.vue'),
            meta: {
              title: 'Доска'
            }
          },
          {
            path: 'archive',
            name: 'boardArchive',
            component: () => import('@/components/Board/archive/BoardArchive.vue'),
            meta: {
              title: 'Архив доски'
            }
          },
          {
            path: 'stats',
            name: 'boardStats',
            component: () => import('@/components/Board/stats/BoardStats.vue'),
            meta: {
              title: 'Статистика доски'
            }
          },
          {
            path: 'form_settings',
            name: 'boardWithForm',
            component: () => import('@/components/Board/form/BoardWithForm.vue'),
            meta: {
              title: 'Форма доски'
            }
          }
        ]
      }
    ]
  }
]
