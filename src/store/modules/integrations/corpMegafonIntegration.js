import * as CORP_MEGAFON from '@/store/actions/integrations/corpoMegafonInt'
import axios from 'axios'

const getDefaultState = () => {
  return {
    atsKey: '',
    // Ключ, который придумывает сам пользователь
    crmKey: '',
    // Ссылка на ЛК Мегафон
    atsLink: '',
    isIntegrated: false,
    // Сотрудники, указанные в ЛК Мегафон
    megafonUsers: []
  }
}

const getters = {
  isMegafonCanCall (state, getters, rootState) {
    return (
      state.isIntegrated &&
      state.atsKey &&
      state.atsKey &&
      state.megafonUsers.findIndex(
        (megafonUser) =>
          megafonUser.uidUser === rootState.user.user?.current_user_uid
      ) !== -1
    )
  }
}

const state = getDefaultState()

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
            atsKey: resp.data.integration.atsKey,
            crmKey: resp.data.integration.crmKey,
            atsLink: resp.integration.atsLink,
            megafonUsers: []
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
      const url =
        process.env.VUE_APP_INSPECTOR_API +
        'megafon/integrations/' +
        data.organizationEmail
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
            atsKey: resp.data.integration.atsKey,
            crmKey: resp.data.integration.crmKey,
            atsLink: resp.integration.atsLink,
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
      const url =
        process.env.VUE_APP_INSPECTOR_API + `megafon/${data.phone}/history`
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
  [CORP_MEGAFON.MEGAFON_CHECK_INTEGRATION]: (
    { commit, dispatch },
    ownerUid
  ) => {
    return new Promise((resolve, reject) => {
      const url =
        process.env.VUE_APP_INSPECTOR_API +
        'megafon/integrations/' +
        ownerUid
      axios({ url: url, method: 'GET', timeout: 1000 * 10 })
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
              organizationEmail: user.organization_email,
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
  [CORP_MEGAFON.MEGAFON_REMOVE_CORP_INTEGRATION]: (
    { commit, dispatch },
    organization
  ) => {
    return new Promise((resolve, reject) => {
      const url =
        process.env.VUE_APP_INSPECTOR_API +
        'megafon/integrations/' +
        organization
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
      const url =
        process.env.VUE_APP_INSPECTOR_API +
        'megafon/integrations/' +
        data.organizationEmail +
        '/users'
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
  },
  [CORP_MEGAFON.CALL_CLIENT]: ({ state, rootState }, phone) => {
    return new Promise((resolve, reject) => {
      const currentUserUid = rootState.user.user?.current_user_uid
      const atsKey = state.atsKey
      const login = state.megafonUsers.find(
        (megafonUser) => megafonUser.uidUser === currentUserUid
      )?.megafonUserLogin
      const atsLink = state.atsLink
      if (!state.isIntegrated || !atsLink || !atsKey) {
        return reject(new Error('not find megafon integration data'))
      }
      if (!login) {
        return reject(new Error('not find megafon user'))
      }

      const url = process.env.VUE_APP_INSPECTOR_API + 'megafon/call/' + phone
      const body = {
        atsKey: atsKey,
        login: login,
        atsLink: atsLink
      }
      axios({ url: url, method: 'POST', data: body })
        .then((resp) => {
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
  },
  [CORP_MEGAFON.SET_MEGAFON_USERS]: (state, data) => {
    state.megafonUsers = data
  },
  [CORP_MEGAFON.MEGAFON_RESET_CORP_INTEGRATION]: (state) => {
    Object.assign(state, getDefaultState())
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
