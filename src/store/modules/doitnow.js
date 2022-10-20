import * as REGLAMENTS from '@/store/actions/reglaments.js'
import store from '@/store/index.js'
import * as DOITNOW from '../actions/doitnow'

function getCurrDateTimeString () {
  const date = new Date()
  const year = String(date.getFullYear()).padStart(4, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
}

const state = {
  status: '',
  reglaments: [],
  cards: [],
  unreadTasks: [],
  todayTasks: [],
  readyTasks: [],
  greetingSlides: [],
  slides: [
    {
      uid: 'doitnowstart',
      name: 'doitnowstart',
      mode: 'slide',
      visible:
        JSON.parse(localStorage.getItem('slides'))?.doitnowstart?.visible ??
        true,
      reminder:
        JSON.parse(localStorage.getItem('slides'))?.doitnowstart?.reminder ??
        getCurrDateTimeString()
    },
    {
      uid: 'addEmployees',
      name: 'addEmployees',
      mode: 'slide',
      visible:
        JSON.parse(localStorage.getItem('slides'))?.addEmployees?.visible ??
        true,
      reminder:
        JSON.parse(localStorage.getItem('slides'))?.addEmployees?.reminder ??
        getCurrDateTimeString()
    },
    {
      uid: 'delegateTasks',
      name: 'delegateTasks',
      mode: 'slide',
      visible:
        JSON.parse(localStorage.getItem('slides'))?.delegateTasks?.visible ??
        true,
      reminder:
        JSON.parse(localStorage.getItem('slides'))?.delegateTasks?.reminder ??
        getCurrDateTimeString()
    },
    {
      uid: 'addAvatar',
      name: 'addAvatar',
      mode: 'slide',
      visible:
        JSON.parse(localStorage.getItem('slides'))?.addAvatar?.visible ?? true,
      reminder:
        JSON.parse(localStorage.getItem('slides'))?.addAvatar?.reminder ??
        getCurrDateTimeString()
    }
  ]
}

const actions = {
  [DOITNOW.REGLAMENTS_GENERATE]: async ({
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
        const reglamentElem = {
          uid: reglament.uid,
          name: reglament.name,
          notify: true,
          lastDate: lastComment?.comment_date || '',
          lastComment: lastComment?.comment || ''
        }
        commit(DOITNOW.REGLAMENTS_PUSH, reglamentElem)
      } catch (error) {
        console.log('Error get reglament comment', error)
      }
    }
    commit(DOITNOW.REGLAMENTS_STATUS_SET, 'success')
  },
  [DOITNOW.REGLAMENTS_CLEAR]: ({ commit }) => {
    commit(DOITNOW.REGLAMENTS_CLEAR)
    commit(DOITNOW.REGLAMENTS_STATUS_SET, '')
  }
}

const mutations = {
  [DOITNOW.REGLAMENTS_PUSH]: (state, resp) => {
    state.reglaments.push(resp)
  },
  [DOITNOW.REGLAMENTS_STATUS_SET]: (state, resp) => {
    state.status = resp
  },
  [DOITNOW.REGLAMENTS_CLEAR]: (state) => {
    state.reglaments = []
  },
  [DOITNOW.SLIDES_CHANGE_VISIBLE]: (state, value) => {
    for (let i = 0; i < state.slides.length; i++) {
      if (state.slides[i].name === value.name) {
        const dateStr = getCurrDateTimeString()
        // сохраняем в стейт
        state.slides[i].visible = value.visible
        state.slides[i].reminder = value.reminder || dateStr
        // сохраняем в стору
        let data = {}
        try {
          data = JSON.parse(localStorage.getItem('slides'))
          data[value.name].visible = value.visible
          data[value.name].reminder = value.reminder || dateStr
        } catch (e) {
          data = {
            doitnowstart: {
              visible: true,
              reminder: dateStr
            },
            addEmployees: {
              visible: true,
              reminder: dateStr
            },
            delegateTasks: {
              visible: true,
              reminder: dateStr
            },
            addAvatar: {
              visible: true,
              reminder: dateStr
            }
          }
          data[value.name].visible = value.visible
          data[value.name].reminder = value.reminder || dateStr
        }
        localStorage.setItem('slides', JSON.stringify(data))
      }
    }
  }
}

export default {
  state,
  actions,
  mutations
}
