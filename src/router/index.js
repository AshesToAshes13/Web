import accountRouter from './account'
import authRouter from './auth'
import boardRouter from './board'
import clientRouter from './client'
import projectRouter from './project'
import reglamentRouter from './reglament'
import settingsRouter from './settings'
import taskRouter from './task'
import {
  ifAuthenticated,
  ifRouteNotExists, shouldRedirectToLogin
} from './utils'

import Doitnow from '@/components/Doitnow.vue'
import CardFile from '@/views/CardFile'
import ClientFile from '@/views/ClientFile'
import Home from '@/views/Home'
import TaskFile from '@/views/TaskFile'

import CreatedBoardForm from '@/components/Board/form/CreatedBoardForm.vue'
import Search from '@/components/Search/Search.vue'
import { createRouter, createWebHistory } from 'vue-router'

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
      title: 'Файл контакта'
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
