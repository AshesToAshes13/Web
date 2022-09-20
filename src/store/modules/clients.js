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
          commit(CLIENTS.ADD_NEW_CLIENT, client)
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [CLIENTS.REMOVE_CLIENT]: ({ commit, dispatch }, clientUid) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_INSPECTOR_API + 'clients?uid=' + clientUid
      axios({ url: url, method: 'DELETE' })
        .then((resp) => {
          commit(CLIENTS.REMOVE_CLIENT, clientUid)
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
          // commit(CLIENTS.UPDATE_CLIENT, resp.data)
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
    state.clients = state.clients.filter(cl => cl.uid !== clientUid)
  },
  [CLIENTS.UPDATE_CLIENT]: (state, data) => {
    console.log(data)
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
