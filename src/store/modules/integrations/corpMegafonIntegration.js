import axios from 'axios'
import * as CORP_MEGAFON from '@/store/actions/integrations/corpoMegafonInt'

const state = {
  // Ключ, указанный в ЛК Мегафон
  atsKey: '',
  // Ключ, который придумывает сам пользователь
  crmKey: '',
  // Ссылка на ЛК Мегафон
  atsLink: '',
  isIntegrated: false,
  // Сотрудники, указанные в ЛК Мегафон
  megafonUsers: []
}

const actions = {
  [CORP_MEGAFON.MEGAFON_CREATE_INTEGRATION]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_INSPECTOR_API + 'megafon/integrations'
      const body = {
        crmKey: data.crmKey,
        atsKey: data.atsKey,
        atsLink: data.atsLink,
        megafonUsers: JSON.stringify(data.megafonUsers),
        organizationEmail: data.organizationEmail
      }
      axios({ url: url, method: 'POST', data: body })
        .then((resp) => {
          if (!resp.data.integration) {
            return
          }
          commit(CORP_MEGAFON.SET_MEGAFON_INTEGRATION, {
            atsKey: resp.data.integration.atsKey,
            crmKey: resp.data.integration.crmKey,
            atsLink: resp.data.integration.atsLink,
            megafonUsers: resp.data.users
          })
          resolve(resp)
        })
        .catch((err) => {
          console.log('ошибка при запросе организации')
          reject(err)
        })
    })
  },
  [CORP_MEGAFON.MEGAFON_CHECK_INTEGRATION]: ({ commit, dispatch }, organizationEmail) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_INSPECTOR_API + 'megafon/integrations/' + organizationEmail
      axios({ url: url, method: 'GET' })
        .then((resp) => {
          commit(CORP_MEGAFON.SET_MEGAFON_INTEGRATION, {
            atsKey: resp.data.integration.atsKey,
            crmKey: resp.data.integration.crmKey,
            atsLink: resp.data.integration.atsLink,
            megafonUsers: resp.data.users
          })
          resolve(resp)
        })
        .catch((err) => {
          console.log('ошибка при запросе организации')
          reject(err)
        })
    })
  },
  [CORP_MEGAFON.MEGAFON_REMOVE_CORP_INTEGRATION]: ({ commit, dispatch }, organization) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_INSPECTOR_API + 'megafon/integrations/' + organization
      axios({ url: url, method: 'DELETE' })
        .then((resp) => {
          commit(CORP_MEGAFON.MEGAFON_REMOVE_CORP_INTEGRATION)
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
}

const mutations = {
  [CORP_MEGAFON.SET_MEGAFON_INTEGRATION]: (state, data) => {
    state.atsKey = data.atsKey
    state.crmKey = data.crmKey
    state.atsLink = data.atsLink
    state.megafonUsers = data.megafonUsers
    state.isIntegrated = true
  },
  [CORP_MEGAFON.MEGAFON_REMOVE_CORP_INTEGRATION]: (state) => {
    state.atsKey = ''
    state.crmKey = ''
    state.atsLink = ''
    state.megafonUsers = []
    state.isIntegrated = false
  }
}

export default {
  state,
  actions,
  mutations
}