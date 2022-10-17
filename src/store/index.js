import { darkModeKey } from '@/config.js'
import { setLocalStorageItem } from '@/store/helpers/functions'
import onboarding from '@/store/modules/onboarding.js'
import slides from '@/store/modules/slides.js'
import axios from 'axios'
import { createStore } from 'vuex'
import auth from './modules/auth'
import boardforms from './modules/boardforms'
import boards from './modules/boards'
import calendar from './modules/calendar'
import cardfilesandmessages from './modules/cardfilesandmessages'
import cards from './modules/cards'
import clientfilesandmessages from './modules/clientfilesandmessages'
import clients from './modules/clients'
import colors from './modules/colors'
import departments from './modules/departments'
import employees from './modules/employees'
import inspector from './modules/inspector'
import corpMegafonIntegration from './modules/integrations/corpMegafonIntegration'
import corpYandexIntegration from './modules/integrations/corpYandexIntegration'
import personalYandexIntegration from './modules/integrations/personalYandexIntegration'
import localization from './modules/localization'
import navigator from './modules/navigator'
import notificationtasks from './modules/notification_tasks'
import projects from './modules/projects'
import reglaments from './modules/reglaments'
import reglamentAnswers from './modules/reglament_answers'
import reglamentQuestions from './modules/reglament_questions'
import tabs from './modules/tabs'
import taskfilesandmessages from './modules/taskfilesandmessages'
import tasks from './modules/tasks'
import user from './modules/user'

export default createStore({
  state: {
    /* Main section state. Possible values: 'tasks', 'greed' */
    mainSectionState: 'tasks',
    isGridView: true,

    /* Properties state: (project, task, color, tag, empmloyee) */
    propertiesState: null,

    // последний оффер по которому кликнули
    clickedOffer: '',

    /* User */
    userName: null,
    userEmail: null,
    userAvatar: null,

    /* fullScreen - fullscreen form layout (e.g. login page) */
    isFullScreen: false,

    /* Aside */
    isAsideMobileExpanded: false,
    isAsideLgActive: false,
    isPropertiesMobileExpanded: false,
    isPropertiesLgActive: false,

    /* Dark mode */
    darkMode: false,

    /* Field focus with ctrl+k (to register only once) */
    isFieldFocusRegistered: false,

    /* Sample data (commonly used) */
    history: []
  },
  mutations: {
    /* A fit-them-all commit */
    basic (state, payload) {
      state[payload.key] = payload.value
    },

    /* User */
    user (state, payload) {
      if (payload.name) {
        state.userName = payload.name
      }
      if (payload.email) {
        state.userEmail = payload.email
      }
      if (payload.avatar) {
        state.userAvatar = payload.avatar
      }
    },

    SET_CLICK_OFFER (state, value) {
      state.clickedOffer = value
    }
  },
  actions: {
    setClickOffer ({ commit }, value) {
      setLocalStorageItem('clicked-offer', value)
      commit('SET_CLICK_OFFER', value)
    },

    asideMobileToggle ({ commit, state }, payload = null) {
      const isShow = payload !== null ? payload : !state.isAsideMobileExpanded
      document
        .getElementById('app')
        .classList[isShow ? 'add' : 'remove']('ml-80', 'xl:ml-0')
      document.documentElement.classList[isShow ? 'add' : 'remove']('m-clipped')

      commit('basic', {
        key: 'isAsideMobileExpanded',
        value: isShow
      })
    },

    asidePropertiesToggle ({ commit, state }, payload = null) {
      const isShow =
        payload !== null ? payload : !state.isPropertiesMobileExpanded
      document
        .getElementById('app')
        .classList[isShow ? 'add' : 'remove']('mr-96')
      document.documentElement.classList[isShow ? 'add' : 'remove']('m-clipped')

      commit('basic', {
        key: 'isPropertiesMobileExpanded',
        value: isShow
      })
    },

    asideLgToggle ({ commit, state }, payload = null) {
      commit('basic', {
        key: 'isAsideLgActive',
        value: payload !== null ? payload : !state.isAsideLgActive
      })
    },

    fullScreenToggle ({ commit, state }, value) {
      commit('basic', { key: 'isFullScreen', value })

      document.documentElement.classList[value ? 'add' : 'remove'](
        'full-screen'
      )
    },

    darkMode ({ commit, state }) {
      const value = !state.darkMode
      document.documentElement.classList[value ? 'add' : 'remove']('dark')
      setLocalStorageItem(darkModeKey, value ? '1' : '0')

      commit('basic', {
        key: 'darkMode',
        value
      })
    },

    fetch ({ commit }, payload) {
      axios
        .get(`data-sources/${payload}.json`)
        .then((r) => {
          if (r.data && r.data.data) {
            commit('basic', {
              key: payload,
              value: r.data.data
            })
          }
        })
        .catch((error) => {
          console.log(error)
        })
    }
  },
  modules: {
    auth,
    navigator,
    calendar,
    user,
    tasks,
    slides,
    corpMegafonIntegration,
    personalYandexIntegration,
    corpYandexIntegration,
    taskfilesandmessages,
    cardfilesandmessages,
    employees,
    departments,
    projects,
    onboarding,
    reglaments,
    clients,
    reglamentQuestions,
    reglamentAnswers,
    boards,
    cards,
    colors,
    localization,
    inspector,
    notificationtasks,
    tabs,
    clientfilesandmessages,
    boardforms
  }
})
