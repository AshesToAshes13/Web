import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'
import Home from '@/views/Home'
import TaskFile from '@/views/TaskFile'
import CardFile from '@/views/CardFile'

const ifNotAuthenticated = (to, from, next) => {
  if (!store.getters.isAuthenticated) {
    next()
  }
  next('/')
}

const ifAuthenticated = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    next()
  }
  next('/login')
}

const ifRouteNotExists = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    next('/')
  }
  next('/login')
}

const routes = [
  {
    meta: {
      title: 'Application'
    },
    path: '/',
    name: 'home',
    component: Home,
    beforeEnter: ifAuthenticated
  },
  {
    meta: {
      title: 'Application'
    },
    path: '/task/:id',
    name: 'task',
    component: Home,
    beforeEnter: ifAuthenticated
  },
  {
    meta: {
      title: 'Application'
    },
    path: '/project/:id',
    name: 'project',
    component: Home,
    beforeEnter: ifAuthenticated
  },
  {
    meta: {
      title: 'Application'
    },
    path: '/board/:id',
    name: 'board',
    component: Home,
    beforeEnter: ifAuthenticated
  },
  {
    meta: {
      title: 'Task file'
    },
    path: '/taskfile/:id',
    name: 'taskfile',
    component: TaskFile,
    beforeEnter: ifAuthenticated
  },
  {
    meta: {
      title: 'Task file'
    },
    path: '/cardfile/:id',
    name: 'cardfile',
    component: CardFile,
    beforeEnter: ifAuthenticated
  },
  {
    meta: {
      title: 'Login',
      fullScreen: true
    },
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue'),
    beforeEnter: ifNotAuthenticated
  },
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
