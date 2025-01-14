/* eslint-disable indent */
import router from '@/router/index.js'
import { NAVIGATOR_UPDATE_ASSIGNMENTS } from '@/store/actions/navigator'
import * as DOITNOW from '@/store/actions/doitnow.js'
import store from '@/store/index.js'
import { shouldAddTaskIntoList } from './utils'

export function createTask (obj) {
  store.dispatch(NAVIGATOR_UPDATE_ASSIGNMENTS)
  if (shouldAddTaskIntoList(obj.obj)) {
    store.commit('ADD_TASK', obj.obj)
  }

  // websync очереди
  const currentUserUid = store.state.user.user.current_user_uid

  if ((obj.obj.uid_customer === currentUserUid) || (obj.obj.uid_customer !== currentUserUid && obj.obj.uid_performer === currentUserUid)) {
    store.state.doitnow.unreadTasks.unshift(obj.obj)
  }
}

export function removeTask (uid) {
  if (uid === store.state.tasks.selectedTask?.uid) {
    store.dispatch('asidePropertiesToggle', false)
  }
  store.dispatch(NAVIGATOR_UPDATE_ASSIGNMENTS)

  store.commit(DOITNOW.DELETE_TASK, uid)
  store.commit('REMOVE_TASK', uid)
}

export function updateTask (obj) {
  store.dispatch(NAVIGATOR_UPDATE_ASSIGNMENTS)
  store.dispatch('UPDATE_TASK', obj) // updates task and extracts another tags & colors
  if (shouldAddTaskIntoList(obj.obj)) {
    store.commit('ADD_TASK', obj.obj)
  } else {
    // не убираем из списка прочитанные задачи в списке непрочитанных
    if (router?.currentRoute?.value?.name === 'tasksUnread') return
    //
    store.commit('REMOVE_TASK', obj.obj.uid)

    // websync для задач в очереди

    if (store.state.doitnow.unreadTasks.find((task) => task.uid === obj.obj.uid)) {
      const indexOfTask = store.state.doitnow.unreadTasks.findIndex((task) => task.uid === obj.obj.uid)
      store.state.doitnow.unreadTasks[indexOfTask] = obj.obj
    } else if (store.state.doitnow.todayTasks.find((task) => task.uid === obj.obj.uid)) {
      const indexOfTask = store.state.doitnow.todayTasks.findIndex((task) => task.uid === obj.obj.uid)
      store.state.doitnow.todayTasks[indexOfTask] = obj.obj
    } else if (store.state.doitnow.readyTasks.find((task) => task.uid === obj.obj.uid)) {
      const indexOfTask = store.state.doitnow.readyTasks.findIndex((task) => task.uid === obj.obj.uid)
      store.state.doitnow.readyTasks[indexOfTask] = obj.obj
    }
  }
}
