import store from '@/store/index.js'
import router from '@/router'
import * as NAVIGATOR from '@/store/actions/navigator'
import * as PROJECT from '@/store/actions/projects'
import { visitChildren } from '@/store/helpers/functions'

export function createProject (obj) {
  const projects = store.state.navigator.navigator.new_private_projects[1].items
  for (let i = 0; i < projects.length; i++) {
    if (projects[i].uid === obj.obj.uid) return
  }
  store.commit(PROJECT.PUSH_PROJECT, [obj.obj])
  store.commit(NAVIGATOR.NAVIGATOR_PUSH_COMMON_PROJECT, [obj.obj])
}

export function removeProject (obj) {
  const commonProjects = store.state.navigator.navigator.new_private_projects[1]
  let atFirstLevel = false

  if (router.currentRoute.value.fullPath === `/project/${obj.uid}`) {
    router.push('/doitnow')
    if (store.state.navigator.submenu.status === true) {
      store.state.navigator.submenu.status = false
    }
  }
  // Определяем, вложенный ли это проект
  for (let i = 0; i < commonProjects.items.length; i++) {
    if (commonProjects.items[i].uid === obj.uid) {
      atFirstLevel = true
    }
  }

  store.commit(NAVIGATOR.NAVIGATOR_REMOVE_PROJECT, { uid_parent: '', uid: obj.uid })
  store.commit(PROJECT.REMOVE_PROJECT_REQUEST, obj.uid)

  if (!atFirstLevel) {
    visitChildren(commonProjects.items, (value) => {
      for (let i = 0; i < value.children.length; i++) {
        if (value.children[i].uid === obj.uid) {
          // remove element without mutation
          value.children.splice(i, 1)
          return
        }
      }
    })
  }
}

export function updateProject (obj) {
  store.commit('NAVIGATOR_UPDATE_PROJECT', obj.obj)
}
