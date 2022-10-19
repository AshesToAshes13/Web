import {
  RESET_ONBOARDING_STATE,
  USER_JUST_REGISTERED_TOGGLE,
  USER_START_ONBOARDING,
  USER_VIEWED_MODAL
} from '../actions/onboarding.js'
import { setLocalStorageItem } from '@/store/helpers/functions'
import * as TASK from '@/store/actions/tasks'

const getDefaultState = () => {
  return {
    justRegistered: localStorage.getItem('justRegistered'),
    visitedModals: localStorage.getItem('visitedModals') ? JSON.parse(localStorage.getItem('visitedModals')) : null,
    hideNavBar: false,
    newUserTasks: false,
    showOnboarding: false,
    showModals: localStorage.getItem('visitedModals'),
    hintUid: {
      '2cf6b167-6506-4b05-bc34-70a8d88e3b25': 'doitnow',
      '901841d9-0016-491d-ad66-8ee42d2b496b': 'tasks',
      '169d728b-b88b-462d-bd8e-3ac76806605b': 'assignment',
      '7af232ff-0e29-4c27-a33b-866b5fd6eade': 'project',
      '92413f6c-2ef3-476e-9429-e76d7818685d': 'reglaments',
      '1b30b42c-b77e-40a4-9b43-a19991809add': 'boards',
      'd28e3872-9a23-4158-aea0-246e2874da73': 'employee'
    }
  }
}

const state = getDefaultState()

const actions = {
  [USER_START_ONBOARDING]: ({ commit, dispatch }, data) => {
    commit(USER_START_ONBOARDING)
    commit(USER_JUST_REGISTERED_TOGGLE, true)

    dispatch(TASK.TASKS_REQUEST)
  }
}

const mutations = {
  [USER_START_ONBOARDING]: (state) => {
    setLocalStorageItem('visitedModals', JSON.stringify([]))
    state.visitedModals = []
    state.showModals = true
    state.hideNavBar = true
    state.justRegistered = true
    state.showOnboarding = true
  },
  [USER_VIEWED_MODAL]: (state, data) => {
    const newData = state.visitedModals ? [...state.visitedModals, data] : [data]
    setLocalStorageItem('visitedModals', JSON.stringify(newData))
    state.visitedModals = newData
    console.log(state.visitedModals)
    state.hideNavBar = false
  },
  [USER_JUST_REGISTERED_TOGGLE]: (state, data) => {
    state.justRegistered = data
    setLocalStorageItem('justRegistered', data)
    if (data === false) {
      localStorage.removeItem('justRegistered')
    }
  },
  [RESET_ONBOARDING_STATE]: (state) => {
    Object.assign(state, getDefaultState())
  }
}

export default {
  state,
  actions,
  mutations
}
