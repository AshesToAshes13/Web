import { sendInspectorMessage } from '@/inspector'
import store from '@/store/index.js'
import axios from 'axios'
import * as CARD from '../actions/cards'

const state = {
  cards: [],
  selectedCardUid: '',
  boardUid: '',
  currentBoard: {},
  status: '',
  cardsAbortController: null,
  blockSelectCard: false,
  clientInCard: {}
}

const getters = {
  cardsMap (state) {
    return state.cards.reduce((acc, stage) => {
      stage.cards.forEach((card) => {
        acc[card.uid] = card
      })
      return acc
    }, {})
  },
  selectedCard (state, getters) {
    return getters.cardsMap[state.selectedCardUid]
  }
}

const actions = {
  [CARD.DOITNOW_CARDS_REQUEST]: ({ commit, rootState }) => {
    const currentUserEmail =
      rootState.user.user.current_user_email.toLowerCase()
    const currDate = new Date()
    const url = process.env.VUE_APP_INSPECTOR_API + 'cards?user='
    return new Promise((resolve, reject) => {
      axios({
        url: url + currentUserEmail,
        method: 'GET'
      })
        .then((resp) => {
          const cards =
            resp?.data?.cards?.filter(
              (card) =>
                !card.date_reminder || new Date(card.date_reminder) <= currDate
            ) || []
          resolve(cards)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [CARD.BOARD_CARDS_REQUEST]: ({ commit, rootState }, boardUid) => {
    commit('abortCardsAbortController')
    const cardsAbortController = new AbortController()
    commit('InitCardsAbortController', cardsAbortController)
    return new Promise((resolve, reject) => {
      commit(CARD.BOARD_CARDS_REQUEST)
      const url =
        process.env.VUE_APP_INSPECTOR_API + 'cards?archive=0&uid=' + boardUid
      axios({ url: url, method: 'GET', signal: cardsAbortController.signal })
        .then((resp) => {
          if (resp) {
            resp.boardUid = boardUid
            resp.rootState = rootState
            commit(CARD.BOARD_CARDS_SUCCESS, resp)
            sendInspectorMessage({
              type: 'boardOnline',
              uid_user: store.state.user.user.current_user_uid,
              uid_board: boardUid
            })
          }
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [CARD.BOARD_ALL_CARDS_REQUEST]: ({ commit, rootState }, boardUid) => {
    commit('abortCardsAbortController')
    const cardsAbortController = new AbortController()
    commit('InitCardsAbortController', cardsAbortController)
    return new Promise((resolve, reject) => {
      commit(CARD.BOARD_CARDS_REQUEST)
      const url = process.env.VUE_APP_INSPECTOR_API + 'cards?uid=' + boardUid
      axios({ url: url, method: 'GET', signal: cardsAbortController.signal })
        .then((resp) => {
          if (resp) {
            resp.boardUid = boardUid
            resp.rootState = rootState
            commit(CARD.BOARD_CARDS_SUCCESS, resp)
          }
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [CARD.BOARD_ARCHIVE_CARDS_REQUEST]: ({ commit, rootState }, boardUid) => {
    commit('abortCardsAbortController')
    const cardsAbortController = new AbortController()
    commit('InitCardsAbortController', cardsAbortController)
    return new Promise((resolve, reject) => {
      commit(CARD.BOARD_CARDS_REQUEST)
      const url =
        process.env.VUE_APP_INSPECTOR_API + 'cards?archive=1&uid=' + boardUid
      axios({ url: url, method: 'GET', signal: cardsAbortController.signal })
        .then((resp) => {
          if (resp) {
            resp.boardUid = boardUid
            resp.rootState = rootState
            commit(CARD.BOARD_CARDS_SUCCESS, resp)
          }
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [CARD.PUBLIC_BOARD_CARDS_REQUEST]: ({ commit, rootState }, boardUid) => {
    commit('abortCardsAbortController')
    const cardsAbortController = new AbortController()
    commit('InitCardsAbortController', cardsAbortController)
    return new Promise((resolve, reject) => {
      commit(CARD.BOARD_CARDS_REQUEST)
      const url = process.env.VUE_APP_INSPECTOR_API + 'cards?uid=' + boardUid
      axios({ url: url, method: 'GET', signal: cardsAbortController.signal })
        .then((resp) => {
          if (resp) {
            resp.boardUid = boardUid
            resp.rootState = rootState
            commit(CARD.PUBLIC_BOARD_CARDS_SUCCESS, resp)
          }
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [CARD.INSPECTOR_CARD_REQUEST]: ({ commit }, cardUid) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_INSPECTOR_API + 'getcard?uid=' + cardUid
      axios({ url: url, method: 'GET' })
        .then((resp) => {
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [CARD.ADD_CARD]: ({ commit }, data) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_INSPECTOR_API + 'cards/card'
      axios({ url: url, method: 'POST', data })
        .then((resp) => {
          commit(CARD.CHANGE_CARD, resp.data)
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [CARD.DELETE_CARD]: ({ commit }, data) => {
    return new Promise((resolve, reject) => {
      const url =
        process.env.VUE_APP_LEADERTASK_API + 'api/v1/cards?uid=' + data.uid
      axios({ url: url, method: 'DELETE' })
        .then((resp) => {
          commit(CARD.DELETE_CARD, data.uid)
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [CARD.MOVE_CARD]: ({ commit }, data) => {
    return new Promise((resolve, reject) => {
      let url =
        process.env.VUE_APP_INSPECTOR_API + 'cards/stage?uid=' + data.uid
      url = url + '&stage=' + data.stageUid
      if (data.newOrder !== undefined) url = url + '&order=' + data.newOrder
      axios({ url: url, method: 'PATCH' })
        .then((resp) => {
          commit(CARD.CHANGE_CARD, resp.data)
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
    //
  },
  [CARD.CHANGE_CARD_RESPONSIBLE_USER]: ({ commit }, data) => {
    return new Promise((resolve, reject) => {
      const url =
        process.env.VUE_APP_INSPECTOR_API +
        'cards/responsible?uid=' +
        data.cardUid
      axios({ url: url, method: 'PATCH', data: { user: data.email } })
        .then((resp) => {
          commit(CARD.CHANGE_CARD, resp.data)
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [CARD.CHANGE_CARD_NAME]: ({ commit }, data) => {
    return new Promise((resolve, reject) => {
      const url =
        process.env.VUE_APP_INSPECTOR_API + 'cards/name?uid=' + data.cardUid
      axios({ url: url, method: 'PATCH', data: { name: data.name } })
        .then((resp) => {
          commit(CARD.CHANGE_CARD, resp.data)
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [CARD.CHANGE_CARD_COMMENT]: ({ commit }, data) => {
    return new Promise((resolve, reject) => {
      const url =
        process.env.VUE_APP_INSPECTOR_API + 'cards/comment?uid=' + data.cardUid
      axios({ url: url, method: 'PATCH', data: { comment: data.comment } })
        .then((resp) => {
          commit(CARD.CHANGE_CARD, resp.data)
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [CARD.CHANGE_CARD_BUDGET]: ({ commit }, data) => {
    return new Promise((resolve, reject) => {
      const url =
        process.env.VUE_APP_INSPECTOR_API + 'cards/cost?uid=' + data.cardUid
      axios({ url: url, method: 'PATCH', data: { cost: data.budget } })
        .then((resp) => {
          commit(CARD.CHANGE_CARD, resp.data)
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [CARD.CHANGE_CARD_COLOR]: ({ commit }, data) => {
    return new Promise((resolve, reject) => {
      const url =
        process.env.VUE_APP_INSPECTOR_API + 'cards/color?uid=' + data.cardUid
      axios({ url: url, method: 'PATCH', data: { color: data.color } })
        .then((resp) => {
          commit(CARD.CHANGE_CARD, resp.data.card)
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [CARD.CHANGE_CARD_COVER]: ({ commit }, data) => {
    return new Promise((resolve, reject) => {
      const url =
        process.env.VUE_APP_INSPECTOR_API +
        'cards/cover?uid_card=' +
        data.cardUid
      axios({ url: url, method: 'PATCH', data: data.file })
        .then((resp) => {
          commit(CARD.CHANGE_CARD, resp.data.card)
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [CARD.CHANGE_CARD_CLEAR_COVER]: ({ commit }, data) => {
    return new Promise((resolve, reject) => {
      const url =
        process.env.VUE_APP_INSPECTOR_API +
        'cards/clearcover?uid=' +
        data.cardUid
      axios({ url: url, method: 'PATCH' })
        .then((resp) => {
          commit(CARD.CHANGE_CARD, resp.data.card)
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [CARD.BOARD_CARDS_ADDSTAGE]: ({ commit, rootState }, newStage) => {
    const board = rootState.boards.boards[state.boardUid]
    const canChangeBoard = board.type_access === 1
    const canAddCardsToBoard =
      board.type_access === 1 || board.type_access === 2
    const stage = { ...newStage }
    stage.cards = []
    stage.Unsorted = false
    stage.Archive = false
    stage.UserStage = true
    stage.AddCard = canAddCardsToBoard
    stage.CanEditStage = canChangeBoard
    commit('AddStage', stage)
  },
  [CARD.BOARD_CARDS_RENAME_STAGE]: ({ commit }, newStage) => {
    commit('RenameStage', { stageUid: newStage.UID, stageName: newStage.Name })
  },
  [CARD.BOARD_CARDS_DELETE_STAGE]: ({ commit }, { stageUid }) => {
    commit('DeleteStage', stageUid)
  },
  [CARD.BOARD_CARDS_CHANGE_COLOR_STAGE]: ({ commit }, newStage) => {
    commit('ChangeColorStage', {
      stageUid: newStage.UID,
      stageColor: newStage.Color
    })
  },
  [CARD.BOARD_CARDS_CHANGE_ORDER_STAGE]: ({ commit }, board) => {
    commit('ChangeStagesOrder', board)
  },
  [CARD.MOVE_ALL_CARDS]: ({ commit }, data) => {
    return new Promise((resolve, reject) => {
      const url = `${process.env.VUE_APP_INSPECTOR_API}cards/move?uid_board=${data.boardTo}&uid_stage=${data.stageTo}&place=up`
      axios({ url, method: 'PATCH', data: { cards: data.cards } })
        .then((resp) => {
          resp.data.forEach((card) => {
            commit(CARD.CHANGE_CARD, card)
          })
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [CARD.CHANGE_CARD_DATE_REMINDER]: ({ commit }, data) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_INSPECTOR_API + 'cards'
      axios({ url: url, method: 'POST', data: data })
        .then((resp) => {
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [CARD.CHANGE_CARD_UID_CLIENT]: ({ commit }, data) => {
    if (data.date_reminder === '') {
      data.date_reminder = null
    }
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_INSPECTOR_API + 'cards'
      axios({ url: url, method: 'POST', data: data })
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
  [CARD.BOARD_CARDS_REQUEST]: (state) => {
    state.cards = []
    state.status = 'loading'
  },
  [CARD.UPDATE_CLIENT_IN_CARD]: (state, clientData) => {
    state.clientInCard = clientData
  },
  [CARD.SELECT_CARD]: (state, cardUid) => {
    if (state.selectedCardUid !== cardUid) {
      const cardsMap = state.cards.reduce((acc, stage) => {
        stage.cards.forEach((card) => {
          acc[card.uid] = card
        })
        return acc
      }, {})

      const card = cardsMap[cardUid]
      if (cardUid) console.log('select card', card, cardUid)

      if (card) {
        sendInspectorMessage({
          type: 'cardOnline',
          uid_user: store.state.user.user.current_user_uid,
          uid_board: card.uid_board,
          uid_card: card.uid
        })
      }
    }
    state.selectedCardUid = cardUid
  },
  [CARD.SELECT_PUBLIC_CARD]: (state, cardUid) => {
    if (state.selectedCardUid !== cardUid) {
      const cardsMap = state.cards.reduce((acc, stage) => {
        stage.cards.forEach((card) => {
          acc[card.uid] = card
        })
        return acc
      }, {})
      const card = cardsMap[cardUid]
      if (cardUid) console.log('select card', card, cardUid)
      //
    }
    state.selectedCardUid = cardUid
  },
  [CARD.BOARD_CARDS_SUCCESS]: (state, resp) => {
    console.log('cards ', resp)

    const stageUnsorted = {
      UID: '00000000-0000-0000-0000-000000000000',
      Name: 'Неразобранное',
      Order: -1,
      Color: '',
      Unsorted: true,
      Archive: false,
      UserStage: false,
      AddCard: false,
      CanEditStage: false,
      cards: []
    }
    const stageSuccess = {
      UID: 'f98d6979-70ad-4dd5-b3f8-8cd95cb46c67', // успех захардкорено у Лехи
      Name: 'Успех',
      Order: Number.MAX_SAFE_INTEGER - 1,
      Color: '',
      Unsorted: false,
      Archive: true,
      UserStage: false,
      AddCard: false,
      CanEditStage: false,
      cards: []
    }
    const stageReject = {
      UID: 'e70af5e2-6108-4c02-9a7d-f4efee78d28c', // отказ захардкорено у Лехи
      Name: 'Отказ',
      Order: Number.MAX_SAFE_INTEGER,
      Color: '',
      Unsorted: false,
      Archive: true,
      UserStage: false,
      AddCard: false,
      CanEditStage: false,
      cards: []
    }

    // заполняем все стейджи
    const stages = []
    stages.push(stageUnsorted)

    const board = resp.rootState.boards.boards[resp.boardUid]
    // могу менять доску если она моя или я есть в админах
    const canChangeBoard = board.type_access === 1
    // могу добавлять карточки если могу менять доску или я есть в писателях
    const canAddCardsToBoard =
      board.type_access === 1 || board.type_access === 2
    //
    board.stages.forEach((stage) => {
      const stageCopy = { ...stage }
      stageCopy.cards = []
      stageCopy.Unsorted = false
      stageCopy.Archive = false
      stageCopy.UserStage = true
      stageCopy.AddCard = canAddCardsToBoard
      stageCopy.CanEditStage = canChangeBoard
      stages.push(stageCopy)
    })

    stages.push(stageSuccess)
    stages.push(stageReject)

    // наполняем карточками из ответа
    const stageMap = stages.reduce((acc, stage) => {
      acc[stage.UID] = stage
      return acc
    }, {})
    for (const card of resp.data.cards) {
      const stage = stageMap[card.uid_stage]
      if (stage) {
        stage.cards.push(card)
      } else {
        stageUnsorted.cards.push(card)
      }
    }

    // сортируем
    stages.sort((stage1, stage2) => {
      // сначала по порядку
      if (stage1.Order > stage2.Order) return 1
      if (stage1.Order < stage2.Order) return -1
      // если одинаковый, то по имени
      if (stage1.Name > stage2.Name) return 1
      if (stage1.Name < stage2.Name) return -1
      return 0
    })
    stages.forEach((stage) => {
      stage.cards.sort((card1, card2) => {
        // сначала по порядку
        if (card1.order > card2.order) return 1
        if (card1.order < card2.order) return -1
        // если одинаковый, то по имени
        if (card1.name > card2.name) return 1
        if (card1.name < card2.name) return -1
        return 0
      })
    })

    state.status = 'success'
    state.boardUid = resp.boardUid
    state.cards = stages
  },
  [CARD.PUBLIC_BOARD_CARDS_SUCCESS]: (state, resp) => {
    console.log('cards ', resp)

    const stageUnsorted = {
      UID: '00000000-0000-0000-0000-000000000000',
      Name: 'Неразобранное',
      Order: -1,
      Color: '',
      Unsorted: true,
      Archive: false,
      UserStage: false,
      AddCard: false,
      CanEditStage: false,
      cards: []
    }
    const stageSuccess = {
      UID: 'f98d6979-70ad-4dd5-b3f8-8cd95cb46c67', // успех захардкорено у Лехи
      Name: 'Успех',
      Order: Number.MAX_SAFE_INTEGER - 1,
      Color: '',
      Unsorted: false,
      Archive: true,
      UserStage: false,
      AddCard: false,
      CanEditStage: false,
      cards: []
    }
    const stageReject = {
      UID: 'e70af5e2-6108-4c02-9a7d-f4efee78d28c', // отказ захардкорено у Лехи
      Name: 'Отказ',
      Order: Number.MAX_SAFE_INTEGER,
      Color: '',
      Unsorted: false,
      Archive: true,
      UserStage: false,
      AddCard: false,
      CanEditStage: false,
      cards: []
    }

    // заполняем все стейджи
    const stages = []
    stages.push(stageUnsorted)

    const board = state.currentBoard.data
    // могу менять доску если она моя или я есть в админах
    const canChangeBoard = board.type_access === 1
    // могу добавлять карточки если могу менять доску или я есть в писателях
    const canAddCardsToBoard =
      board.type_access === 1 || board.type_access === 2
    //
    console.log(board)
    board.stages.forEach((stage) => {
      const stageCopy = { ...stage }
      stageCopy.cards = []
      stageCopy.Unsorted = false
      stageCopy.Archive = false
      stageCopy.UserStage = true
      stageCopy.AddCard = canAddCardsToBoard
      stageCopy.CanEditStage = canChangeBoard
      stages.push(stageCopy)
    })

    stages.push(stageSuccess)
    stages.push(stageReject)

    // наполняем карточками из ответа
    const stageMap = stages.reduce((acc, stage) => {
      acc[stage.UID] = stage
      return acc
    }, {})
    for (const card of resp.data.cards) {
      const stage = stageMap[card.uid_stage]
      if (stage) {
        stage.cards.push(card)
      } else {
        stageUnsorted.cards.push(card)
      }
    }

    // сортируем
    stages.sort((stage1, stage2) => {
      // сначала по порядку
      if (stage1.Order > stage2.Order) return 1
      if (stage1.Order < stage2.Order) return -1
      // если одинаковый, то по имени
      if (stage1.Name > stage2.Name) return 1
      if (stage1.Name < stage2.Name) return -1
      return 0
    })
    stages.forEach((stage) => {
      stage.cards.sort((card1, card2) => {
        // сначала по порядку
        if (card1.order > card2.order) return 1
        if (card1.order < card2.order) return -1
        // если одинаковый, то по имени
        if (card1.name > card2.name) return 1
        if (card1.name < card2.name) return -1
        return 0
      })
    })

    state.status = 'success'
    state.boardUid = resp.boardUid
    state.cards = stages
  },
  [CARD.DELETE_CARD]: (state, uid) => {
    state.cards.forEach((stage) => {
      const index = stage.cards.findIndex((card) => card.uid === uid)
      if (index !== -1) {
        // удаляем
        stage.cards.splice(index, 1)
      }
    })
  },
  [CARD.CHANGE_CARD]: (state, card) => {
    // найти карточку - вырезать из того места где она сейчас
    state.cards.forEach((stage) => {
      const index = stage.cards.findIndex((crd) => crd.uid === card.uid)
      if (index !== -1) {
        // удаляем
        stage.cards.splice(index, 1)
      }
    })
    // если карточка в текущей доске
    if (state.boardUid === card.uid_board) {
      // добавить карточку в тот стейдж который должен быть или неразобранное
      let stage = state.cards.find((stage) => stage.UID === card.uid_stage)
      if (!stage) {
        stage = state.cards.find(
          (stage) => stage.UID === '00000000-0000-0000-0000-000000000000'
        )
      }
      if (stage) {
        // добавляем карточку
        stage.cards.push(card)
        // пересортировать карточки в стедже
        stage.cards.sort((card1, card2) => {
          // сначала по порядку
          if (card1.order > card2.order) return 1
          if (card1.order < card2.order) return -1
          // если одинаковый, то по имени
          if (card1.name > card2.name) return 1
          if (card1.name < card2.name) return -1
          return 0
        })
      }
    }
  },
  AddStage: (state, stage) => {
    state.cards.push(stage)
    state.cards.sort((stage1, stage2) => {
      // сначала по порядку
      if (stage1.Order > stage2.Order) return 1
      if (stage1.Order < stage2.Order) return -1
      // если одинаковый, то по имени
      if (stage1.Name > stage2.Name) return 1
      if (stage1.Name < stage2.Name) return -1
      return 0
    })
  },
  RenameStage: (state, { stageUid, stageName }) => {
    const stage = state.cards.find((stage) => stage.UID === stageUid)
    if (stage) stage.Name = stageName
  },
  DeleteStage: (state, stageUid) => {
    const index = state.cards.findIndex((stage) => stage.UID === stageUid)
    if (index !== -1) {
      // удаляем
      state.cards.splice(index, 1)
      // пересчитываем порядок у колонок пользователя
      const stages = state.cards.filter((stage) => stage.UserStage === true)
      stages.forEach((stage, index) => {
        stage.Order = index
      })
    }
  },
  ChangeColorStage: (state, { stageUid, stageColor }) => {
    const stage = state.cards.find((stage) => stage.UID === stageUid)
    if (stage) stage.Color = stageColor
  },
  ChangeStagesOrder: (state, board) => {
    const stages = state.cards.filter((stage) => stage.UserStage === true)
    stages.forEach((stage) => {
      stage.Order =
        board.stages.find((item) => item.UID === stage.UID)?.Order ??
        stage.Order
    })
    // сортируем
    state.cards.sort((stage1, stage2) => {
      // сначала по порядку
      if (stage1.Order > stage2.Order) return 1
      if (stage1.Order < stage2.Order) return -1
      // если одинаковый, то по имени
      if (stage1.Name > stage2.Name) return 1
      if (stage1.Name < stage2.Name) return -1
      return 0
    })
  },
  InitCardsAbortController: (state, controller) => {
    state.cardsAbortController = controller
  },
  abortCardsAbortController: (state) => {
    if (state.cardsAbortController) {
      state.cardsAbortController.abort()
    }
  },
  CardSaveReminder: (state, data) => {
    state.cards.forEach((stage) => {
      const index = stage.cards.findIndex((card) => card.uid === data.uid)
      console.log('Index: ', index)
      if (index !== -1) {
        stage.cards[index] = { ...stage.cards[index], ...data }
      }
    })
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
