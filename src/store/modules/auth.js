import { disconnectInspectorSocket } from '@/inspector'
import router from '@/router'
import {
  getUserToken,
  removeUserToken,
  setUserToken
} from '@/services/axios/authorization.js'
import unautorizedApi from '@/services/unauthorizedApiService.js'
import { RESET_CLIENT_STATE } from '@/store/actions/clients'
import { RESET_COLOR_STATE } from '@/store/actions/colors'
import { RESET_CORP_YANDEX_STATE } from '@/store/actions/integrations/corpoYandexInt'
import { RESET_PERSONAL_YANDEX_STATE } from '@/store/actions/integrations/personalYandexInt'
import { RESET_ONBOARDING_STATE } from '@/store/actions/onboarding'
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
  token: getUserToken(),
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
      unautorizedApi
        .auth(data.email, data.password)
        .then((resp) => {
          setUserToken(axios, resp.access_token, resp.refresh_token)
          commit(AUTH_SUCCESS, resp.access_token)
          resolve(resp)
        })
        .catch((err) => {
          commit(AUTH_ERROR, err)
          removeUserToken(axios)
          reject(err)
        })
    })
  },
  [AUTH_REGISTER]: ({ commit }, data) => {
    return new Promise((resolve, reject) => {
      commit(AUTH_REGISTER)
      unautorizedApi
        .register(data.email, data.password, data.name, data.phone, data.cid)
        .then((resp) => {
          setUserToken(axios, resp.access_token, resp.refresh_token)
          commit(AUTH_SUCCESS, resp.access_token)
          resolve(resp)
        })
        .catch((err) => {
          commit(AUTH_ERROR, err)
          removeUserToken(axios)
          reject(err)
        })
    })
  },
  [GOOGLE_AUTH_REQUEST]: ({ commit }, data) => {
    return new Promise((resolve, reject) => {
      commit(GOOGLE_AUTH_REQUEST)
      unautorizedApi
        .authByGoogle(data.token, data.cid)
        .then((resp) => {
          setUserToken(axios, resp.access_token, resp.refresh_token)
          commit(AUTH_SUCCESS, resp.access_token)
          resolve(resp)
        })
        .catch((err) => {
          commit(AUTH_ERROR, err)
          removeUserToken(axios)
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
          setUserToken(axios, resp.data.access_token, resp.data.refresh_token)
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
      disconnectInspectorSocket()
      axios
        .get(url)
        .then((resp) => {
          removeUserToken(axios)
          resolve(resp)
        })
        .catch((err) => {
          commit(AUTH_ERROR, err)
          removeUserToken(axios)
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
          setUserToken(axios, resp.data.access_token, resp.data.refresh_token)
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
  [AUTH_SUCCESS]: (state, accessToken) => {
    state.status = 'success'
    state.token = accessToken
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
