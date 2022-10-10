import { shouldRedirectToLogin } from './utils'
import Home from '@/views/Home'

export default [
  {
    meta: {
      layout: Home,
      title: 'Регламенты'
    },
    path: '/reglaments',
    beforeEnter: shouldRedirectToLogin,
    children: [
      {
        path: '',
        name: 'reglaments',
        component: () => import('@/components/Reglaments/Reglaments.vue'),
        meta: {
          title: 'Регламенты'
        }
      },
      {
        path: ':id',
        children: [
          {
            path: '',
            name: 'currentReglament',
            component: () => import('@/components/Reglaments/ReglamentContent.vue'),
            meta: {
              title: 'Регламент'
            }
          },
          {
            path: 'history',
            name: 'reglamentHistory',
            component: () => import('@/components/Reglaments/ReglamentHistoryChanges.vue'),
            meta: {
              title: 'История регламента'
            }
          },
          {
            path: 'edit',
            name: 'reglamentEditing',
            component: () => import('@/components/Reglaments/ReglamentContentEditor.vue'),
            meta: {
              title: 'Редактирование регламента'
            }
          }
        ]
      }
    ]
  }
]
