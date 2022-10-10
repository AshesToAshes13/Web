import { shouldRedirectToLogin } from './utils'
import Home from '@/views/Home'

export default [
  {
    path: '/board/:board_id/public',
    name: 'publicBoardWithChildren',
    component: () => import('@/components/Board/PublicBoardWithChildren.vue')
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
        component: () => import('@/components/Boards'),
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
            component: () => import('@/components/Board/BoardWithChildren.vue'),
            props: { showArchive: true },
            meta: {
              title: 'Архив доски'
            }
          },
          {
            path: 'stats',
            name: 'boardStats',
            component: () => import('@/components/BoardStats.vue'),
            meta: {
              title: 'Статистика доски'
            }
          },
          {
            path: 'form_settings',
            name: 'boardWithForm',
            component: () => import('@/components/Board/BoardWithForm.vue'),
            meta: {
              title: 'Форма доски'
            }
          }
        ]
      }
    ]
  }
]
