import router from '@/router/index.js'
import * as CARD from '@/store/actions/cards'
import { CHANGE_CARD, DELETE_CARD } from '@/store/actions/cards'
import * as CLIENT_FILES_AND_MESSAGES from '@/store/actions/clientfilesandmessages'
import store from '@/store/index.js'
import { computed } from 'vue'

const selectedCardUid = computed(() => store.state.cards.selectedCardUid)
const selectedCard = computed(() => store.getters.selectedCard)

function updateClientCard (obj) {
  const isNeedUpdateClientCard =
    !store.state.clientfilesandmessages.cards.cards.find(
      (property) => property.uid === obj.obj.uid
    )

  const isNeedUpdateClientCardName =
    store.state.clientfilesandmessages.cards.cards.find(
      (property) =>
        property.uid === obj.obj.uid && property.name !== obj.obj.name
    )

  if (isNeedUpdateClientCard) {
    store.commit(CLIENT_FILES_AND_MESSAGES.ADD_UPDATE_CLIENT_CARD, obj.obj)
    store.dispatch(
      CLIENT_FILES_AND_MESSAGES.GET_CLIENT_CARDS,
      obj.obj.uid_client
    )
  } else if (isNeedUpdateClientCardName) {
    store.commit(CLIENT_FILES_AND_MESSAGES.UPDATE_CLIENT_CARD_NAME, obj.obj)
  }
}

function deleteClientCard (uid) {
  store.commit(CLIENT_FILES_AND_MESSAGES.DELETE_UPDATE_CLIENT_CARD, uid)
  store.dispatch(
    CLIENT_FILES_AND_MESSAGES.GET_CLIENT_CARDS,
    store.state.clients.selectedClient.uid
  )
}

export function createCard (obj) {
  obj.obj.uid_client = ''
  obj.obj.client_name = ''
  obj.obj.date_reminder = ''

  store.commit(CHANGE_CARD, obj.obj)
}

export function removeCard (uid) {
  console.log(uid)
  const isDeleteUpdateClientCard =
    router.currentRoute.value.name === 'clientPage' &&
    store.state.clientfilesandmessages.cards.cards.find(
      (property) => property.uid === uid
    )
  if (isDeleteUpdateClientCard) {
    deleteClientCard(uid)
  }
  if (uid === selectedCardUid.value) {
    store.dispatch('asidePropertiesToggle', false)
    store.commit(CARD.SELECT_CARD, '')
  }
  store.commit(DELETE_CARD, uid)
}

export function updateCard (obj) {
  const isUpdateCard =
    router.currentRoute.value.name === 'clientPage' &&
    obj.obj.uid_client === store.state.clients.selectedClient.uid

  const isDeleteUpdateClientCard =
    router.currentRoute.value.name === 'clientPage' &&
    !obj.obj.uid_client &&
    store.state.clientfilesandmessages.cards.cards.find(
      (property) => property.uid === obj.obj.uid
    )

  if (isUpdateCard) {
    updateClientCard(obj)
  } else if (isDeleteUpdateClientCard) {
    deleteClientCard(obj.obj.uid)
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
