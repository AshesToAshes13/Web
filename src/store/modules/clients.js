import * as CLIENTS from '@/store/actions/clients.js'
import axios from 'axios'

const state = {
  selectedClient: null,
  paging: {},
  clients: [],
  status: 'loading'
}

const actions = {
  [CLIENTS.GET_CLIENTS]: ({ commit, dispatch, state }, data) => {
    return new Promise((resolve, reject) => {
      let url = process.env.VUE_APP_INSPECTOR_API + 'clients?organization=' + data.organization + '&page=' + (data.page - 1)
      if (data.search) {
        url += '&search=' + data.search
      }
      commit(CLIENTS.GET_CLIENTS)
      axios({ url: url, method: 'GET' })
        .then((resp) => {
          commit(CLIENTS.SET_CLIENTS, resp.data.clients)
          commit('UPDATE_PAGING', resp.data.paging)
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [CLIENTS.ADD_NEW_CLIENT]: ({ commit, dispatch }, client) => {
    return new Promise((resolve, reject) => {
      const url =
        process.env.VUE_APP_INSPECTOR_API + 'clients'
      axios({ url: url, method: 'POST', data: client })
        .then((resp) => {
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [CLIENTS.REMOVE_CLIENT]: ({ commit, dispatch }, client) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_INSPECTOR_API + 'clients?uid=' + client.uid
      axios({ url: url, method: 'DELETE', data: { organization: client.organization } })
        .then((resp) => {
          commit(CLIENTS.REMOVE_CLIENT, client.uid)
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [CLIENTS.UPDATE_CLIENT]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_INSPECTOR_API + 'clients'
      axios({ url: url, method: 'PATCH', data: data })
        .then((resp) => {
          commit(CLIENTS.UPDATE_CLIENT, data)
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
}

const mutations = {
  [CLIENTS.GET_CLIENTS]: (state) => {
    state.status = 'loading'
  },
  [CLIENTS.SET_CLIENTS]: (state, clients) => {
    state.clients = clients
    state.status = 'success'
  },
  [CLIENTS.ADD_NEW_CLIENT]: (state, client) => {
    state.clients.push(client)
  },
  [CLIENTS.REMOVE_CLIENT]: (state, clientUid) => {
    state.clients.splice(state.clients.findIndex(client => client.uid === clientUid), 1)
  },
  [CLIENTS.UPDATE_CLIENT]: (state, data) => {
    state.selectedClient = { ...data }
    state.clients[state.clients.findIndex(client => client.uid === data.uid)] = { ...data }
  },
  [CLIENTS.SELECT_CLIENT]: (state, client) => {
    state.selectedClient = client
  },
  [CLIENTS.CHANGE_CLIENT_NAME]: (state, client) => {
    state.clients.find(cl => cl.uid === client.uid).name = client.name
  },
  UPDATE_PAGING: (state, paging) => {
    state.paging = paging
  }
}

export default {
  state,
  actions,
  mutations
}
