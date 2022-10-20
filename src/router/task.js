import { prefixRoutes, shouldRedirectToLogin } from './utils'
import Home from '@/views/Home'

export default [
  {
    meta: {
      layout: Home,
      title: 'Задача'
    },
    path: '/task/:id',
    name: 'task',
    component: () => import('@/components/TasksList/TaskByUid.vue'),
    beforeEnter: shouldRedirectToLogin
  },
  ...prefixRoutes('/tasks', Home, [
    {
      path: ':date',
      name: 'tasksByDate',
      component: () => import('@/components/TasksList/TasksByDate.vue'),
      meta: {
        title: 'Задача по дате'
      }
    },
    {
      path: 'today',
      name: 'tasksToday',
      component: () => import('@/components/TasksList/TasksToday.vue'),
      meta: {
        title: 'Сегодня'
      }
    },
    {
      path: 'unread',
      name: 'tasksUnread',
      component: () => import('@/components/TasksList/TasksUnread.vue'),
      meta: {
        title: 'Непрочитанные'
      }
    },
    {
      path: 'delegate-to-me/:employee_uid',
      name: 'tasksDelegateToMe',
      component: () => import('@/components/TasksList/TasksDelegateToMe.vue'),
      meta: {
        title: 'Поручено мне'
      }
    },
    {
      path: 'delegate-by-me/:employee_uid',
      name: 'tasksDelegateByMe',
      component: () => import('@/components/TasksList/TasksDelegateByMe.vue'),
      meta: {
        title: 'Поручено мной'
      }
    },
    {
      path: 'in-work',
      name: 'tasksInWork',
      component: () => import('@/components/TasksList/TasksInWork'),
      meta: {
        title: 'В работе'
      }
    },
    {
      path: 'in-focus',
      name: 'tasksInFocus',
      component: () => import('@/components/TasksList/TasksInFocus'),
      meta: {
        title: 'В фокусе'
      }
    },
    {
      path: 'ready',
      name: 'tasksReady',
      component: () => import('@/components/TasksList/TasksReady.vue'),
      meta: {
        title: 'Готово к сдаче'
      }
    },
    {
      path: 'unsorted',
      name: 'taskUnsorted',
      component: () => import('@/components/TasksList/TaskUnsorted.vue'),
      meta: {
        title: 'Неразобранные'
      }
    },
    {
      path: 'overdue',
      name: 'tasksOverdue',
      component: () => import('@/components/TasksList/TasksOverdue.vue'),
      meta: {
        title: 'Просроченные'
      }
    }
  ])
]
