import axios from 'axios'
import * as PERSONAL_YANDEX from '@/store/actions/integrations/personalYandexInt.js'

const state = {
  login: null,
  password: null,
  isIntegrated: false
}

const actions = {
  [PERSONAL_YANDEX.YANDEX_CREATE_PERSONAL_EMAIL_INTEGRATION]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_INSPECTOR_API + 'yandexIntegratePersonal'
      axios({ url: url, method: 'POST', data: data })
        .then((resp) => {
          commit(PERSONAL_YANDEX.YANDEX_CREATE_PERSONAL_EMAIL_INTEGRATION, resp.data)
          resolve(resp)
        })
        .catch((err) => {
          console.log('ошибка при запросе организации')
          reject(err)
        })
    })
  },
  [PERSONAL_YANDEX.YANDEX_GET_PERSONAL_LOGIN_AND_PASS]: ({ commit, dispatch }, userEmail) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_INSPECTOR_API + 'yandexGetPersonalLoginPassword?user=' + userEmail
      axios({ url: url, method: 'GET' })
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
  [PERSONAL_YANDEX.YANDEX_REMOVE_PERSONAL_EMAIL_INTEGRATION]: ({ commit, dispatch }, userEmail) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_INSPECTOR_API + 'yandexRemovePersonalIntegration?organization=' + userEmail
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
  [PERSONAL_YANDEX.YANDEX_GET_PERSONAL_MESSAGES_SENT_FROM_US]: ({ commit, dispatch }, emails) => {
    return new Promise((resolve, reject) => {
      const data = {
        ya_login: state.login,
        ya_password: state.password,
        email: emails.clientEmail
      }
      const url = process.env.VUE_APP_INSPECTOR_API + 'yandexGetPersonalMessagesSentFromUs'
      axios({ url: url, method: 'POST', data: data })
        .then((resp) => {
          console.log('personal sent from us success')
          resolve(resp)
        })
        .catch((err) => {
          console.log('ошибка при запросе imap')
          reject(err)
        })
    })
  },
  [PERSONAL_YANDEX.YANDEX_GET_PERSONAL_MESSAGES_SENT_TO_US]: ({ commit, dispatch }, emails) => {
    return new Promise((resolve, reject) => {
      const data = {
        ya_login: state.login,
        ya_password: state.password,
        email: emails.clientEmail
      }
      const url = process.env.VUE_APP_INSPECTOR_API + 'yandexGetPersonalMessagesSentToUs'
      axios({ url: url, method: 'POST', data: data })
        .then((resp) => {
          console.log('personal sent to us success')
          resolve(resp)
        })
        .catch((err) => {
          console.log('ошибка при запросе imap')
          reject(err)
        })
    })
  }
}

const mutations = {
  [PERSONAL_YANDEX.YANDEX_CREATE_PERSONAL_EMAIL_INTEGRATION]: (state, data) => {
    state.isIntegrated = data
  },
  [PERSONAL_YANDEX.YANDEX_GET_PERSONAL_LOGIN_AND_PASS]: (state, data) => {
    if (data.length) {
      state.login = data[0].ya_login
      state.password = data[0].ya_password
      state.isIntegrated = true
    }
  },
  [PERSONAL_YANDEX.YANDEX_REMOVE_PERSONAL_EMAIL_INTEGRATION]: (state) => {
    state.isIntegrated = false
  }
}

export default {
  state,
  actions,
  mutations
}
