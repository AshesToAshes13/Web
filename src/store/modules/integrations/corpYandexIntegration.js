import * as CORP_YANDEX from '@/store/actions/integrations/corpoYandexInt.js'
import axios from 'axios'

const getDefaultState = () => {
  return {
    login: null,
    password: null,
    isIntegrated: false,
    isSentToUsLoaded: false,
    isSentFromUsLoaded: false
  }
}

const state = getDefaultState()

const getters = {
  isCorpLoaded: state => {
    return state.isSentToUsLoaded && state.isSentFromUsLoaded
  }
}

const actions = {
  [CORP_YANDEX.YANDEX_CREATE_CORP_EMAIL_INTEGRATION]: (
    { commit, dispatch },
    data
  ) => {
    return new Promise((resolve, reject) => {
      const url =
        process.env.VUE_APP_INSPECTOR_API + 'corpYandexInt/integrateOrganization'
      axios({ url: url, method: 'POST', data: data })
        .then((resp) => {
          commit(CORP_YANDEX.YANDEX_CREATE_CORP_EMAIL_INTEGRATION, resp.data)
          resolve(resp)
        })
        .catch((err) => {
          console.log('ошибка при запросе организации')
          reject(err)
        })
    })
  },
  [CORP_YANDEX.YANDEX_GET_ORGANIZATION_LOGIN_AND_PASS]: (
    { commit, dispatch },
    organization
  ) => {
    return new Promise((resolve, reject) => {
      const url =
        process.env.VUE_APP_INSPECTOR_API +
        'corpYandexInt/getOrganizationLogPass?organization=' +
        organization
      axios({ url: url, method: 'GET', timeout: 1000 * 10 })
        .then((resp) => {
          commit(CORP_YANDEX.YANDEX_GET_ORGANIZATION_LOGIN_AND_PASS, resp.data)
          resolve(resp)
        })
        .catch((err) => {
          console.log('ошибка при запросе организации')
          reject(err)
        })
    })
  },
  [CORP_YANDEX.YANDEX_REMOVE_CORP_EMAIL_INTEGRATION]: (
    { commit, dispatch },
    organization
  ) => {
    return new Promise((resolve, reject) => {
      const url =
        process.env.VUE_APP_INSPECTOR_API +
        'corpYandexInt/deleteOrganization?organization=' +
        organization
      axios({ url: url, method: 'DELETE' })
        .then((resp) => {
          commit(CORP_YANDEX.YANDEX_REMOVE_CORP_EMAIL_INTEGRATION)
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [CORP_YANDEX.GET_CORP_EXISTS_MSGS]: ({ commit, dispatch }, emails) => {
    return new Promise((resolve, reject) => {
      const data = {
        ya_login: state.login,
        ya_password: state.password,
        email: emails.clientEmail
      }
      const url = process.env.VUE_APP_INSPECTOR_API + 'corpYandexInt/getExistCorpMsgs'
      axios({ url: url, method: 'POST', data: data })
        .then((resp) => {
          console.log('all corp exists msgs get success')
          resolve(resp)
        })
        .catch((error) => {
          console.log('error while get corp exists msgs', error)
          reject(error)
        })
    })
  },
  [CORP_YANDEX.YANDEX_GET_CORP_MESSAGES_SENT_FROM_US]: (
    { commit, dispatch },
    emails
  ) => {
    return new Promise((resolve, reject) => {
      const data = {
        ya_login: state.login,
        ya_password: state.password,
        email: emails.clientEmail
      }
      const url = process.env.VUE_APP_INSPECTOR_API + 'corpYandexInt/yandexCorpMsgsSentFromUs'
      axios({ url: url, method: 'POST', data: data })
        .then((resp) => {
          console.log('corp sent from us success')
          resolve(resp)
        })
        .catch((err) => {
          console.log('ошибка при запросе imap')
          reject(err)
        })
        .finally(() => {
          commit(CORP_YANDEX.YANDEX_SEND_FROM_US_LOADED)
        })
    })
  },
  [CORP_YANDEX.YANDEX_GET_CORP_MESSAGES_SENT_TO_US]: (
    { commit, dispatch },
    emails
  ) => {
    return new Promise((resolve, reject) => {
      const data = {
        ya_login: state.login,
        ya_password: state.password,
        email: emails.clientEmail
      }
      const url = process.env.VUE_APP_INSPECTOR_API + 'corpYandexInt/yandexCorpMsgsSentToUs'
      axios({ url: url, method: 'POST', data: data })
        .then((resp) => {
          console.log('corp sent to us success')
          resolve(resp)
        })
        .catch((err) => {
          console.log('ошибка при запросе imap')
          reject(err)
        })
        .finally(() => {
          commit(CORP_YANDEX.YANDEX_SEND_TO_US_LOADED)
        })
    })
  }
}

const mutations = {
  [CORP_YANDEX.RESET_CORP_YANDEX_STATE]: (state) => {
    Object.assign(state, getDefaultState())
  },
  [CORP_YANDEX.YANDEX_SEND_TO_US_LOADED]: (state) => {
    state.isSentToUsLoaded = true
  },
  [CORP_YANDEX.YANDEX_SEND_FROM_US_LOADED]: (state) => {
    state.isSentFromUsLoaded = true
  },
  [CORP_YANDEX.YANDEX_SEND_TO_US_REFRESH]: (state) => {
    state.isSentToUsLoaded = false
  },
  [CORP_YANDEX.YANDEX_SEND_FROM_US_END_REFRESH]: (state) => {
    state.isSentFromUsLoaded = false
  },
  [CORP_YANDEX.YANDEX_CREATE_CORP_EMAIL_INTEGRATION]: (state, data) => {
    state.isIntegrated = data
  },
  [CORP_YANDEX.YANDEX_GET_ORGANIZATION_LOGIN_AND_PASS]: (state, data) => {
    if (Object.keys(data).length) {
      state.login = data.ya_login
      state.password = data.ya_password
      state.isIntegrated = true
    }
  },
  [CORP_YANDEX.YANDEX_REMOVE_CORP_EMAIL_INTEGRATION]: (state) => {
    state.isIntegrated = false
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
