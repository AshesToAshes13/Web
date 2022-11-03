import store from '@/store/index.js'
import * as CLIENTS from '@/store/actions/clients.js'
import router from '@/router'

function helperFuncUpdate () {
  if (router.currentRoute.value.path === '/clients') {
    const currentPage = router.currentRoute.value.query.page
    const data = {
      organization: store.state.user.user?.owner_email,
      // проверяем, если у пользователя почему-то страница меньше чем 1, то page будет 1(если не выдавать 1 будет ошибка), в обычном случае просто выдаем страницу на которой пользователь
      page: currentPage < 1 ? 1 : currentPage
    }
    store.dispatch(CLIENTS.GET_CLIENTS_UPDATE, data)
  }
}

export function createClient (obj) {
  store.commit(CLIENTS.ADD_NEW_CLIENT, obj.obj)
  helperFuncUpdate()
}

export function removeClient (obj) {
  if (router.currentRoute.value.params.client_id === obj) {
    router.push('/clients')
  }
  store.commit(CLIENTS.REMOVE_CLIENT, obj)

  helperFuncUpdate()

  if (store.state.cards.cards.length) {
    // Удаляем клиента с карточек
    const cards = store.state.cards.cards
    for (let i = 1; i < cards.length - 2; i++) {
      cards[i].cards.forEach(card => {
        if (card.uid_client === obj) {
          card.uid_client = ''
          card.client_name = ''
        }
      })
    }
  }
}

export function updateClient (obj) {
  store.commit(CLIENTS.UPDATE_CLIENT, obj.obj)
}
