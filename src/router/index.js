import { shouldRedirectToLogin, ifAuthenticated, ifRouteNotExists } from './utils'
import boardRouter from './board'
import taskRouter from './task'
import settingsRouter from './settings'
import accountRouter from './account'
import reglamentRouter from './reglament'
import projectRouter from './project'
import clientRouter from './client'
import authRouter from './auth'

import Doitnow from '@/components/Doitnow.vue'
import CardFile from '@/views/CardFile'
import ClientFile from '@/views/ClientFile'
import Home from '@/views/Home'
import TaskFile from '@/views/TaskFile'

import Search from '@/components/Search/Search.vue'
import { createRouter, createWebHistory } from 'vue-router'
import CreatedBoardForm from '@/components/Board/CreatedBoardForm.vue'

const routes = [
  {
    meta: {
      // title: 'Application'
    },
    path: '/',
    name: 'home',
    component: Home,
    beforeEnter: ifAuthenticated
  },
  {
    meta: {
      title: 'Файл задачи'
    },
    path: '/taskfile/:id',
    name: 'taskfile',
    component: TaskFile,
    beforeEnter: ifAuthenticated
  },
  {
    meta: {
      title: 'Файл карточки'
    },
    path: '/cardfile/:id',
    name: 'cardfile',
    component: CardFile,
    beforeEnter: shouldRedirectToLogin
  },
  {
    meta: {
      title: 'Файл клиента'
    },
    path: '/clientfile/:id',
    name: 'clientfile',
    component: ClientFile,
    beforeEnter: shouldRedirectToLogin
  },
  {
    meta: {
      layout: Home,
      title: 'Очередь'
    },
    path: '/doitnow',
    name: 'doitnow',
    component: Doitnow,
    beforeEnter: shouldRedirectToLogin
  },
  {
    meta: {
      layout: Home,
      title: 'Поиск',
      breadcrumb: {
        name: 'Поиск: '
      }
    },
    path: '/search',
    name: 'search',
    component: Search,
    beforeEnter: shouldRedirectToLogin
  },
  {
    path: '/form/:board_id',
    name: 'createdBoardForm',
    component: CreatedBoardForm,
    meta: {
      title: 'Форма доски'
    }
  },
  ...authRouter,
  ...clientRouter,
  ...projectRouter,
  ...reglamentRouter,
  ...settingsRouter,
  ...accountRouter,
  ...taskRouter,
  ...boardRouter,
  {
    path: '/:pathMatch(.*)*',
    beforeEnter: ifRouteNotExists
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior (to, from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

export default router
