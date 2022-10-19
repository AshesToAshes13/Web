import * as PERSONAL_TELEGERAM from '@/store/actions/integrations/personalTelegramIntegration.js'
import axios from 'axios'

const getDefaultState = () => {
  return {
    integration: {}
  }
}

const state = getDefaultState()

const actions = {
  [PERSONAL_TELEGERAM.TELEGRAM_GET_PERSONAL_INTEGRATION]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_INSPECTOR_API + 'telegram/'
      axios({ url: url, method: 'POST', data: data })
        .then((resp) => {
          commit(
            PERSONAL_TELEGERAM.TELEGRAM_GET_PERSONAL_INTEGRATION,
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
  [PERSONAL_TELEGERAM.TELEGRAM_DELETE_PERSONAL_INTEGRATION]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_INSPECTOR_API + 'telegram/'
      axios({ url: url, method: 'DELETE', data: data })
        .then((resp) => {
          commit(PERSONAL_TELEGERAM.TELEGRAM_DELETE_PERSONAL_INTEGRATION)
          resolve(resp)
        })
        .catch((err) => {
          console.log('ошибка при запросе организации')
          reject(err)
        })
    })
  }
}

const mutations = {
  [PERSONAL_TELEGERAM.TELEGRAM_GET_PERSONAL_INTEGRATION]: (state, data) => {
    state.integration = data
  },
  [PERSONAL_TELEGERAM.TELEGRAM_DELETE_PERSONAL_INTEGRATION]: (state) => {
    Object.assign(state, getDefaultState())
  }
}

export default {
  state,
  actions,
  mutations
}
