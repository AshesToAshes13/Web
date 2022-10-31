import store from '@/store/index.js'
import { computed } from 'vue'

const selectedCardUid = computed(() => store.state.cards.selectedCardUid)

export function createCardMessage (obj) {
  const shouldAddMsgToClient = store.state.clientfilesandmessages.cards.cards.filter((card) => card.uid === obj.uid_card)

  if ('uid_card' in obj && obj.uid_card === selectedCardUid.value) {
    store.commit('CARD_CREATE_MESSAGE_REQUEST', obj.obj)
  }

  if (shouldAddMsgToClient.length) {
    obj.obj.uid_client = shouldAddMsgToClient[0].uid_client
    // дата с вебсинка приходит без Z, из-за чего сообщение может появиться в любом месте чата
    if (!obj.obj.date_create.includes('Z')) {
      obj.obj.date_create += 'Z'
    }
    store.commit('CLIENT_CARDS_MESSAGES_SUCCESS', obj.obj)
  }
}

export function removeCardMessage (obj) {
  const shouldRemoveMsgInClient = store.state.clientfilesandmessages.cards.cards.filter((card) => card.uid === obj.uid_card)

  if ('uid_card' in obj && obj.uid_card === selectedCardUid.value) {
    const data = { uid: obj.obj.uid, key: 'deleted', value: 1 }
    store.commit('CARD_CHANGE_MESSAGE', data)
  }

  if (shouldRemoveMsgInClient.length) {
    store.commit('CLIENT_REMOVE_MESSAGE_FROM_CARD', obj.obj.uid)
  }
}

export function removeCardFileMessage (uid) {
  store.commit('CARD_REMOVE_MESSAGE_LOCALLY', { uid: uid })
}
