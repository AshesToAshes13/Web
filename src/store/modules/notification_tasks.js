import * as REGLAMENTS from '@/store/actions/reglaments.js'
import store from '@/store/index.js'
import * as NOTIFICATION_TASKS from '../actions/notification_tasks'

const state = {
  notificationtasks: [],
  status: ''
}

const actions = {
  [NOTIFICATION_TASKS.NOTIFICATION_TASKS_GENERATE]: async ({
    commit,
    dispatch
  }) => {
    const userUid = store.state.user.user.current_user_uid
    const userDep = store.state.employees.employees[userUid]?.uid_dep
    const dateNow = new Date()
    const reglaments = Object.values(store.state.reglaments.reglaments).filter(
      (reglament) => {
        const reglamentReminder = reglament.reminder
          ? new Date(reglament.reminder)
          : dateNow
        const reglamentReminderValud = isNaN(reglamentReminder)
          ? dateNow
          : reglamentReminder
        return (
          (reglament.department_uid === userDep ||
            reglament.department_uid === '') &&
          !reglament.is_passed &&
          reglament.has_questions &&
          reglamentReminderValud <= dateNow
        )
      }
    )
    for (const reglament of reglaments) {
      try {
        const res = await dispatch(
          REGLAMENTS.GET_REGLAMENT_COMMENTS,
          reglament.uid
        )
        const lastComment = res?.data ? res.data[res.data.length - 1] : null
        const notifyElem = {
          uid: reglament.uid,
          name: reglament.name,
          notify: true,
          lastDate: lastComment?.comment_date || '',
          lastComment: lastComment?.comment || ''
        }
        commit(NOTIFICATION_TASKS.NOTIFICATION_TASKS_PUSH, notifyElem)
      } catch (error) {
        console.log('Error get reglament comment', error)
      }
    }
    commit(NOTIFICATION_TASKS.NOTIFICATION_TASKS_STATUS_SET, 'success')
  },
  [NOTIFICATION_TASKS.NOTIFICATION_TASKS_CLEAR]: ({ commit }) => {
    commit(NOTIFICATION_TASKS.NOTIFICATION_TASKS_CLEAR)
    commit(NOTIFICATION_TASKS.NOTIFICATION_TASKS_STATUS_SET, '')
  }
}

const mutations = {
  [NOTIFICATION_TASKS.NOTIFICATION_TASKS_PUSH]: (state, resp) => {
    state.notificationtasks.push(resp)
  },
  [NOTIFICATION_TASKS.NOTIFICATION_TASKS_STATUS_SET]: (state, resp) => {
    state.status = resp
  },
  [NOTIFICATION_TASKS.NOTIFICATION_TASKS_CLEAR]: (state) => {
    state.notificationtasks = []
  }
}

export default {
  state,
  actions,
  mutations
}
