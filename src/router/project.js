import { shouldRedirectToLogin } from './utils'
import Home from '@/views/Home'

export default [
  {
    meta: {
      layout: Home,
      breadcrumb: {
        name: 'Проекты',
        to: '/project'
      }
    },
    path: '/project',
    beforeEnter: shouldRedirectToLogin,
    children: [
      {
        path: '',
        name: 'allProjects',
        component: () => import('@/components/Projects.vue'),
        meta: {
          title: 'Все проекты'
        }
      },
      {
        path: ':project_id',
        name: 'project',
        component: () => import('@/components/Projects/ProjectWithChildren.vue'),
        meta: {
          title: 'Проект'
        }
      }
    ]
  }
]
