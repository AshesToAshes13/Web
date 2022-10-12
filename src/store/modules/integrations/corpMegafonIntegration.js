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
      const atsLink = data.atsLink.replace('https://', '').replaceAll('/', '')
      const body = {
        crmKey: data.crmKey,
        atsKey: data.atsKey,
        atsLink: atsLink,
        organizationEmail: data.organizationEmail,
        megafonUsers: JSON.stringify([])
      }
      axios({ url: url, method: 'POST', data: body })
        .then((resp) => {
          if (!resp.data.integration) {
            return
          }
          commit(CORP_MEGAFON.SET_MEGAFON_INTEGRATION, {
            atsKey: data.atsKey,
            crmKey: data.crmKey,
            atsLink: atsLink,
            megafonUsers: JSON.stringify([])
          })
          resolve(resp)
        })
        .catch((err) => {
          console.log('ошибка при запросе организации')
          reject(err)
        })
    })
  },
  [CORP_MEGAFON.MEGAFON_UPDATE_INTEGRATION]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_INSPECTOR_API + 'megafon/integrations/' + data.organizationEmail
      const atsLink = data.atsLink.replace('https://', '').replaceAll('/', '')
      const body = {
        crmKey: data.crmKey,
        atsKey: data.atsKey,
        atsLink: atsLink,
        organizationEmail: data.organizationEmail,
        megafonUsers: JSON.stringify(data.megafonUsers)
      }
      axios({ url: url, method: 'PATCH', data: body })
        .then((resp) => {
          if (!resp.data.integration) {
            return
          }
          commit(CORP_MEGAFON.SET_MEGAFON_INTEGRATION, {
            atsKey: data.atsKey,
            crmKey: data.crmKey,
            atsLink: atsLink,
            megafonUsers: data.megafonUsers
          })
          resolve(resp)
        })
        .catch((err) => {
          console.log('ошибка при запросе организации')
          reject(err)
        })
    })
  },
  [CORP_MEGAFON.GET_CALL_HISTORY]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_INSPECTOR_API + `megafon/${data.phone}/history`
      const params = {
        crmKey: data.crmKey
      }

      axios({ url: url, method: 'GET', params: params })
        .then((resp) => {
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
          if (!Object.keys(resp.data.integration).length) {
            return
          }
          commit(CORP_MEGAFON.SET_MEGAFON_INTEGRATION, {
            atsKey: resp.data.integration.ats_key,
            crmKey: resp.data.integration.crm_key,
            atsLink: resp.data.integration.ats_link,
            megafonUsers: resp.data.users.map((user) => ({
              id: user.id,
              organizationEmail: user.organizationEmail,
              uidUser: user.uid_user,
              megafonUserLogin: user.megafon_user_login
            }))
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
  },
  [CORP_MEGAFON.GET_ATS_LOGINS]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_INSPECTOR_API + 'megafon/integrations/' + data.organizationEmail + '/users'
      const params = {
        megafonATSKey: data.atsKey
      }
      axios({ url: url, method: 'GET', params: params })
        .then((resp) => {
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
