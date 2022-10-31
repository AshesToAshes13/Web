import router from '@/router/index.js'
import * as CARD from '@/store/actions/cards'
import {
  CHANGE_CARD,
  DELETE_CARD
} from '@/store/actions/cards'
import store from '@/store/index.js'
import { computed } from 'vue'
import * as CLIENT_FILES_AND_MESSAGES from '@/store/actions/clientfilesandmessages'

const selectedCardUid = computed(() => store.state.cards.selectedCardUid)
const selectedCard = computed(() => store.getters.selectedCard)

function updateClientCard (obj) {
  const isNeedUpdateClientCard = !store.state.clientfilesandmessages.cards.cards.find(property => property.uid === obj.obj.uid)

  const shouldAddMsgToClient = router.currentRoute.value?.params?.client_id === obj.obj?.uid_client

  if (isNeedUpdateClientCard || shouldAddMsgToClient) {
    store.commit(CLIENT_FILES_AND_MESSAGES.ADD_UPDATE_CLIENT_CARD, obj.obj)
    store.dispatch(CLIENT_FILES_AND_MESSAGES.GET_CLIENT_CARDS, obj.obj.uid_client)
  }
}

function deleteClientCard (obj) {
  store.commit(CLIENT_FILES_AND_MESSAGES.DELETE_UPDATE_CLIENT_CARD, obj.obj)
  store.dispatch(CLIENT_FILES_AND_MESSAGES.GET_CLIENT_CARDS, store.state.clients.selectedClient.uid)
}

export function createCard (obj) {
  obj.obj.uid_client = ''
  obj.obj.client_name = ''
  obj.obj.date_reminder = ''

  store.commit(CHANGE_CARD, obj.obj)
}

export function removeCard (uid) {
  if (uid === selectedCardUid.value) {
    store.dispatch('asidePropertiesToggle', false)
    store.commit(CARD.SELECT_CARD, '')
  }
  store.commit(DELETE_CARD, uid)
}

export function updateCard (obj) {
  const isUpdateCard = router.currentRoute.value.name === 'clientPage' && obj.obj.uid_client === store.state.clients.selectedClient.uid

  const isDeleteUpdateClientCard = router.currentRoute.value.name === 'clientPage' && !obj.obj.uid_client && store.state.clientfilesandmessages.cards.cards.find(property => property.uid === obj.obj.uid)

  console.log('update card is', isUpdateCard)
  if (isUpdateCard) {
    updateClientCard(obj)
  } else if (isDeleteUpdateClientCard) {
    deleteClientCard(obj)
  }

  if (router.currentRoute.value.name !== 'boardWithChildren') return
  if (
    !store.getters.cardsMap[obj.obj.uid] &&
    router.currentRoute.value.params.board_id !== obj.obj.uid_board
  ) {
    return
  }

  // закрываем свойства карточки
  // если переменстили в другую доску или колонку
  if (obj.obj.uid === selectedCardUid.value) {
    if (
      selectedCard.value.uid_board !== obj.obj.uid_board ||
        selectedCard.value.uid_stage !== obj.obj.uid_stage
    ) {
      store.dispatch('asidePropertiesToggle', false)
      store.commit(CARD.SELECT_CARD, '')
    }
  }
  store.commit(CHANGE_CARD, obj.obj)
}
