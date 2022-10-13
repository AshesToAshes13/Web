import store from '@/store/index.js'
import * as CLIENTS from '@/store/actions/clients.js'
import router from '@/router'

function helperFuncUpdate () {
  if (router.currentRoute.value.path === '/clients') {
    const data = {
      organization: store.state.user.user?.owner_email,
      page: router.currentRoute.value.query.page
    }
    store.dispatch(CLIENTS.GET_CLIENTS_UPDATE, data)
  }
}

export function createClient (obj) {
  store.commit(CLIENTS.ADD_NEW_CLIENT, obj.obj)
  helperFuncUpdate()
}

export function removeClient (obj) {
  store.commit(CLIENTS.REMOVE_CLIENT, obj.obj)
  helperFuncUpdate()
}

export function updateClient (obj) {
  store.commit(CLIENTS.UPDATE_CLIENT, obj.obj)
}
