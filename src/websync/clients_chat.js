import store from '@/store/index.js'
import { computed } from 'vue'
import * as CLIENTS_CHAT from '@/store/actions/clientfilesandmessages.js'

const selectedClient = computed(() => store.state.clients.selectedClient)
const messages = computed(() => store.state.clientfilesandmessages.messages)

export function createClientMessage (obj) {
  if (selectedClient.value) {
    // сейчас вебсокет держит более одного подключения, поэтому создан такой костыль
    for (let i = 0; i < messages.value.length; i++) {
      if (messages.value[i].uid === obj.obj.uid) {
        store.commit(CLIENTS_CHAT.CREATE_MESSAGE_REQUEST, obj.obj)
        return
      }
    }
    store.commit(CLIENTS_CHAT.CREATE_MESSAGE_REQUEST, obj.obj)
  }
}

export function createClientFile (obj) {
  if (selectedClient.value) {
    // сейчас вебсокет держит более одного подключения, поэтому создан такой костыль
    for (let i = 0; i < messages.value.length; i++) {
      if (messages.value[i].uid === obj.obj.uid) {
        store.commit(CLIENTS_CHAT.CREATE_FILES_REQUEST, obj.obj.success)
        return
      }
    }
    store.commit(CLIENTS_CHAT.CREATE_FILES_REQUEST, obj.obj.success)
  }
}

export function removeClientChatMessage (obj) {
  if (selectedClient.value) {
    for (let i = 0; i < messages.value.length; i++) {
      if (messages.value[i].uid === obj.obj.uid) {
        store.commit(CLIENTS_CHAT.DELETE_MESSAGE_REQUEST, obj.obj.uid)
        return
      }
    }
  }
}

export function removeClientFile (obj) {
  if (selectedClient.value) {
    // сейчас вебсокет держит более одного подключения, поэтому создан такой костыль
    for (let i = 0; i < messages.value.length; i++) {
      if (messages.value[i].uid === obj.obj.uid) {
        store.commit(CLIENTS_CHAT.REMOVE_MESSAGE_LOCALLY, { uid: obj.obj.uid })
        return
      }
    }
    store.commit(CLIENTS_CHAT.REMOVE_MESSAGE_LOCALLY, { uid: obj.obj.uid })
  }
}
