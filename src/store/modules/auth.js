import router from '@/router'
import { RESET_CLIENT_STATE } from '@/store/actions/clients'
import { RESET_COLOR_STATE } from '@/store/actions/colors'
import { RESET_CORP_YANDEX_STATE } from '@/store/actions/integrations/corpoYandexInt'
import { RESET_PERSONAL_YANDEX_STATE } from '@/store/actions/integrations/personalYandexInt'
import { RESET_ONBOARDING_STATE } from '@/store/actions/onboarding'
import { setLocalStorageItem } from '@/store/helpers/functions'
import axios from 'axios'
import {
  AUTH_CHANGE_PASSWORD,
  AUTH_ERROR,
  AUTH_LOGOUT,
  AUTH_REFRESH_TOKEN,
  AUTH_REGISTER,
  AUTH_REQUEST,
  AUTH_SUCCESS,
  GOOGLE_AUTH_REQUEST
} from '../actions/auth'
import { RESET_STATE_BOARD } from '../actions/boards'
import { RESET_DEPARTMENTS_STATE } from '../actions/departments'
import { RESET_DOITNOW_STATE } from '../actions/doitnow'
import { RESET_EMPLOYEE_STATE } from '../actions/employees'
import { MEGAFON_RESET_CORP_INTEGRATION } from '../actions/integrations/corpoMegafonInt'
import { RESET_STATE_PROJECT } from '../actions/projects'
import { RESET_REGLAMENTS_STATE } from '../actions/reglaments'

const state = {
  token: localStorage.getItem('user-token') || '',
  status: '',
  hasLoadedOnce: false
}

const getters = {
  isAuthenticated: (state) => !!state.token,
  authStatus: (state) => state.status
}

const actions = {
  [AUTH_REQUEST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      commit(AUTH_REQUEST)
      const uri =
        process.env.VUE_APP_LEADERTASK_API +
        'api/v1/users/auth?login=' +
        data.email +
        '&password=' +
        encodeURIComponent(data.password) +
        '&system=web&type_device=web'
      axios({ url: uri, method: 'POST' })
        .then((resp) => {
          setLocalStorageItem('user-token', resp.data.access_token)
          setLocalStorageItem('user-refresh-token', resp.data.refresh_token)
          axios.defaults.headers.common.Authorization = resp.data.access_token
          if (process.env.VUE_APP_EXTENDED_LOGS) {
            console.log(
              'set axios authorization',
              axios.defaults.headers.common.Authorization
            )
          }
          commit(AUTH_SUCCESS, resp)
          resolve(resp)
        })
        .catch((err) => {
          commit(AUTH_ERROR, err)
          localStorage.removeItem('user-token')
          delete axios.defaults.headers.common.Authorization
          if (process.env.VUE_APP_EXTENDED_LOGS) {
            console.log(
              'clear axios authorization',
              axios.defaults.headers.common.Authorization
            )
          }
          reject(err)
        })
    })
  },
  [AUTH_REGISTER]: ({ commit }, user) => {
    return new Promise((resolve, reject) => {
      commit(AUTH_REGISTER)
      const uri = process.env.VUE_APP_LEADERTASK_API + 'api/v1/users/new'
      axios({ url: uri, data: user, method: 'POST' })
        .then((resp) => {
          setLocalStorageItem('user-token', resp.data.access_token)
          setLocalStorageItem('user-refresh-token', resp.data.refresh_token)
          axios.defaults.headers.common.Authorization = resp.data.access_token
          if (process.env.VUE_APP_EXTENDED_LOGS) {
            console.log(
              'set axios authorization',
              axios.defaults.headers.common.Authorization
            )
          }
          commit(AUTH_SUCCESS, resp)
          resolve(resp)
        })
        .catch((err) => {
          commit(AUTH_ERROR, err)
          localStorage.removeItem('user-token')
          delete axios.defaults.headers.common.Authorization
          if (process.env.VUE_APP_EXTENDED_LOGS) {
            console.log(
              'clear axios authorization',
              axios.defaults.headers.common.Authorization
            )
          }
          reject(err)
        })
    })
  },
  [GOOGLE_AUTH_REQUEST]: ({ commit }, user) => {
    return new Promise((resolve, reject) => {
      commit(GOOGLE_AUTH_REQUEST)
      const uri = process.env.VUE_APP_LEADERTASK_API + 'api/v1/tokens/bygoogle'
      axios({ url: uri, data: user, method: 'POST' })
        .then((resp) => {
          setLocalStorageItem('user-token', resp.data.access_token)
          setLocalStorageItem('user-refresh-token', resp.data.refresh_token)
          axios.defaults.headers.common.Authorization = resp.data.access_token
          if (process.env.VUE_APP_EXTENDED_LOGS) {
            console.log(
              'set axios authorization',
              axios.defaults.headers.common.Authorization
            )
          }
          commit(AUTH_SUCCESS, resp)
          resolve(resp)
        })
        .catch((err) => {
          commit(AUTH_ERROR, err)
          localStorage.removeItem('user-token')
          delete axios.defaults.headers.common.Authorization
          if (process.env.VUE_APP_EXTENDED_LOGS) {
            console.log(
              'clear axios authorization',
              axios.defaults.headers.common.Authorization
            )
          }
          reject(err)
        })
    })
  },
  [AUTH_CHANGE_PASSWORD]: ({ commit }, data) => {
    return new Promise((resolve, reject) => {
      // commit(AUTH_CHANGE_PASSWORD) unknown
      const url = process.env.VUE_APP_LEADERTASK_API + 'api/v1/users/password'
      axios({ url: url, data: data, method: 'PATCH' })
        .then((resp) => {
          setLocalStorageItem('user-token', resp.data.access_token)
          setLocalStorageItem('user-refresh-token', resp.data.refresh_token)
          axios.defaults.headers.common.Authorization = resp.data.access_token
          if (process.env.VUE_APP_EXTENDED_LOGS) {
            console.log(
              'set axios authorization',
              axios.defaults.headers.common.Authorization
            )
          }
          resolve(resp)
        })
        .catch((err) => {
          commit(AUTH_ERROR, err)
          reject(err.response?.data)
        })
    })
  },
  [AUTH_LOGOUT]: ({ commit }) => {
    return new Promise((resolve, reject) => {
      commit(AUTH_LOGOUT)
      localStorage.removeItem('user-token')
      localStorage.removeItem('user-refresh-token')
      localStorage.removeItem('visitedModals')
      localStorage.removeItem('justRegistered')
      localStorage.removeItem('slides')
      const url = process.env.VUE_APP_LEADERTASK_API + 'api/v1/account/exit'
      commit(RESET_STATE_BOARD)
      commit(RESET_STATE_PROJECT)
      commit(RESET_REGLAMENTS_STATE)
      commit(RESET_DEPARTMENTS_STATE)
      commit(RESET_EMPLOYEE_STATE)
      commit(RESET_ONBOARDING_STATE)
      commit(RESET_CLIENT_STATE)
      commit(RESET_COLOR_STATE)
      commit(MEGAFON_RESET_CORP_INTEGRATION)
      commit(RESET_CORP_YANDEX_STATE)
      commit(RESET_PERSONAL_YANDEX_STATE)
      commit(RESET_DOITNOW_STATE)
      axios
        .get(url)
        .then((resp) => {
          delete axios.defaults.headers.common.Authorization
          if (process.env.VUE_APP_EXTENDED_LOGS) {
            console.log(
              'clear axios authorization',
              axios.defaults.headers.common.Authorization
            )
          }
          resolve(resp)
        })
        .catch((err) => {
          commit(AUTH_ERROR, err)
          delete axios.defaults.headers.common.Authorization
          if (process.env.VUE_APP_EXTENDED_LOGS) {
            console.log(
              'clear axios authorization',
              axios.defaults.headers.common.Authorization
            )
          }
          reject(err)
        })
    })
  },
  [AUTH_REFRESH_TOKEN]: ({ commit }) => {
    return new Promise((resolve, reject) => {
      axios.defaults.headers.common.RefreshToken =
        localStorage.getItem('user-refresh-token')
      const url = process.env.VUE_APP_LEADERTASK_API + 'api/v1/tokens/refresh'
      axios
        .post(url)
        .then((resp) => {
          setLocalStorageItem('user-token', resp.data.access_token)
          setLocalStorageItem('user-refresh-token', resp.data.refresh_token)
          axios.defaults.headers.common.Authorization = resp.data.access_token
          if (process.env.VUE_APP_EXTENDED_LOGS) {
            console.log(
              'set axios authorization',
              axios.defaults.headers.common.Authorization
            )
          }
          resolve(resp)
        })
        .catch((err) => {
          commit(AUTH_ERROR, err)
          reject(err)
        })
    })
  }
}

const mutations = {
  [AUTH_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [AUTH_REGISTER]: (state) => {
    state.status = 'loading'
  },
  [GOOGLE_AUTH_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [AUTH_SUCCESS]: (state, resp) => {
    state.status = 'success'
    state.token = resp.data.access_token
    state.hasLoadedOnce = true
  },
  [AUTH_ERROR]: (state) => {
    state.status = 'error'
    state.hasLoadedOnce = true
  },
  [AUTH_LOGOUT]: (state) => {
    state.token = ''
    router.push('/login')
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
