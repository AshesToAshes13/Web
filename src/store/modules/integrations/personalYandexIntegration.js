import * as PERSONAL_YANDEX from '@/store/actions/integrations/personalYandexInt.js'
import axios from 'axios'

const getDefaultState = () => {
  return {
    login: null,
    password: null,
    isIntegrated: false,
    isSentToUsLoading: false,
    isSentFromUsLoading: false
  }
}

const state = getDefaultState()

const getters = {
  isPersonalLoaded: state => {
    return state.isSentToUsLoading && state.isSentFromUsLoading
  }
}

const actions = {
  [PERSONAL_YANDEX.YANDEX_CREATE_PERSONAL_EMAIL_INTEGRATION]: (
    { commit, dispatch },
    data
  ) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_INSPECTOR_API + 'personalYandexInt/yandexIntegratePersonal'
      axios({ url: url, method: 'POST', data: data })
        .then((resp) => {
          commit(
            PERSONAL_YANDEX.YANDEX_CREATE_PERSONAL_EMAIL_INTEGRATION,
            resp.data
          )
          resolve(resp)
        })
        .catch((err) => {
          console.log('ошибка при запросе организации')
          reject(err)
        })
    })
  },
  [PERSONAL_YANDEX.YANDEX_GET_PERSONAL_LOGIN_AND_PASS]: (
    { commit, dispatch },
    userEmail
  ) => {
    return new Promise((resolve, reject) => {
      const url =
        process.env.VUE_APP_INSPECTOR_API +
        'personalYandexInt/getPersonalLoginPassword?user=' +
        userEmail
      axios({ url: url, method: 'GET', timeout: 1000 * 10 })
        .then((resp) => {
          commit(PERSONAL_YANDEX.YANDEX_GET_PERSONAL_LOGIN_AND_PASS, resp.data)
          resolve(resp)
        })
        .catch((err) => {
          console.log('ошибка при запросе организации')
          reject(err)
        })
    })
  },
  [PERSONAL_YANDEX.YANDEX_REMOVE_PERSONAL_EMAIL_INTEGRATION]: (
    { commit, dispatch },
    userEmail
  ) => {
    return new Promise((resolve, reject) => {
      const url =
        process.env.VUE_APP_INSPECTOR_API +
        'personalYandexInt/yandexRemovePersonal?user=' +
        userEmail
      axios({ url: url, method: 'DELETE' })
        .then((resp) => {
          commit(PERSONAL_YANDEX.YANDEX_REMOVE_PERSONAL_EMAIL_INTEGRATION)
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [PERSONAL_YANDEX.GET_PERSONAL_EXISTS_MSGS]: ({ commit, dispatch }, emails) => {
    return new Promise((resolve, reject) => {
      const data = {
        ya_login: state.login,
        ya_password: state.password,
        email: emails.clientEmail
      }
      const url =
        process.env.VUE_APP_INSPECTOR_API +
        'personalYandexInt/getExistPersMsgs'
      axios({ url: url, method: 'POST', data: data })
        .then((resp) => {
          console.log('get all pers msgs success')
          resolve(resp)
        })
        .catch((error) => {
          console.log('error while connecting', error)
          reject(error)
        })
    })
  },
  [PERSONAL_YANDEX.YANDEX_GET_PERSONAL_MESSAGES_SENT_FROM_US]: (
    { commit, dispatch },
    emails
  ) => {
    return new Promise((resolve, reject) => {
      const data = {
        ya_login: state.login,
        ya_password: state.password,
        email: emails.clientEmail
      }
      const url =
        process.env.VUE_APP_INSPECTOR_API +
        'personalYandexInt/yandexGetPersonalMessagesSentFromUs'
      commit(PERSONAL_YANDEX.YANDEX_SEND_FROM_US_START_LOADING)
      axios({ url: url, method: 'POST', data: data })
        .then((resp) => {
          console.log('personal sent from us success')
          resolve(resp)
        })
        .catch((err) => {
          console.log('ошибка при запросе imap')
          reject(err)
        })
        .finally(() => {
          commit(PERSONAL_YANDEX.YANDEX_SEND_FROM_US_END_LOADING)
        })
    })
  },
  [PERSONAL_YANDEX.YANDEX_GET_PERSONAL_MESSAGES_SENT_TO_US]: (
    { commit, dispatch },
    emails
  ) => {
    return new Promise((resolve, reject) => {
      const data = {
        ya_login: state.login,
        ya_password: state.password,
        email: emails.clientEmail
      }
      const url =
        process.env.VUE_APP_INSPECTOR_API + 'personalYandexInt/yandexGetPersonalMessagesSentToUs'
      commit(PERSONAL_YANDEX.YANDEX_SEND_TO_US_START_LOADING)
      axios({ url: url, method: 'POST', data: data })
        .then((resp) => {
          console.log('personal sent to us success')
          resolve(resp)
        })
        .catch((err) => {
          console.log('ошибка при запросе imap')
          reject(err)
        })
        .finally(() => {
          commit(PERSONAL_YANDEX.YANDEX_SEND_TO_US_END_LOADING)
        })
    })
  }
}

const mutations = {
  [PERSONAL_YANDEX.YANDEX_SEND_TO_US_START_LOADING]: (state) => {
    state.isSentToUsLoading = true
  },
  [PERSONAL_YANDEX.YANDEX_SEND_FROM_US_START_LOADING]: (state) => {
    state.isSentFromUsLoading = true
  },
  [PERSONAL_YANDEX.YANDEX_SEND_TO_US_END_LOADING]: (state) => {
    state.isSentToUsLoading = true
  },
  [PERSONAL_YANDEX.YANDEX_SEND_FROM_US_END_LOADING]: (state) => {
    state.isSentFromUsLoading = true
  },
  [PERSONAL_YANDEX.RESET_PERSONAL_YANDEX_STATE]: (state) => {
    Object.assign(state, getDefaultState())
  },
  [PERSONAL_YANDEX.YANDEX_CREATE_PERSONAL_EMAIL_INTEGRATION]: (state, data) => {
    state.login = data.ya_login
    state.password = data.ya_password
    state.isIntegrated = true
  },
  [PERSONAL_YANDEX.YANDEX_GET_PERSONAL_LOGIN_AND_PASS]: (state, data) => {
    if (Object.keys(data).length) {
      state.login = data.ya_login
      state.password = data.ya_password
      state.isIntegrated = true
    }
  },
  [PERSONAL_YANDEX.YANDEX_REMOVE_PERSONAL_EMAIL_INTEGRATION]: (state) => {
    state.isIntegrated = false
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
