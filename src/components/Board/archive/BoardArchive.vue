<template>
  <div>
    <BoardModalBoxDelete
      v-if="showDeleteCard"
      title="Удалить карточку"
      text="Вы действительно хотите удалить карточку?"
      @cancel="showDeleteCard = false"
      @yes="onDeleteCard"
    />
    <BoardModalBoxCardMove
      v-if="showMoveCard"
      :show="showMoveCard"
      :stage-uid="currentCard.uid_stage"
      :board-uid="currentCard.uid_board"
      @cancel="showMoveCard = false"
      @changePosition="onChangeCardPosition"
    />
    <div class="h-screen flex flex-col">
      <BoardArchiveNavbar
        class="shrink-0"
        :board-uid="boardUid"
        :board-name="boardName"
      />
      <BoardSkeleton
        v-if="status === 'loading'"
      />
      <div
        v-else-if="status === 'success'"
        class="flex h-[calc(100%-72px)]"
      >
        <div
          v-for="column in filteredColumns"
          :key="column.UID"
          class="h-fit max-h-full flex flex-col flex-none bg-white rounded-[6px] overflow-x-hidden overflow-y-auto scroll-style pl-[13px] py-4 w-[280px] mr-[10px] stage-column"
          :data-column-uid="column.UID"
        >
          <!--заголовок -->
          <div
            class="pl-1 pr-[12px] flex justify-between items-start"
          >
            <div
              class="w-[calc(100%-18px)] "
            >
              <p
                class="text-[#424242] font-['Roboto'] font-bold text-[16px] leading-[19px] w-full break-words"
                :class="{ 'cursor-default': !column.CanEditStage }"
              >
                {{ column.Name }}
              </p>
            </div>
          </div>
          <!--под заголовок стат-колонки -->
          <div
            class="pl-1 pr-[16px] text-[#7e7e80] font-['Roboto'] mt-[6px]"
          >
            <div
              v-if="column.cards.length"
              class="flex items-center justify-between h-[16px]"
            >
              <p
                class="text-[12px] leading-[14px]"
              >
                Карточек: {{ column.cards.length }}
              </p>
              <div
                v-if="totalItem(column.cards)"
                class="flex items-center"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M3.25924 4.44448C3.10208 4.44448 2.95135 4.50691 2.84021 4.61805C2.72908 4.72918 2.66665 4.87991 2.66665 5.03707V10.963C2.66665 11.1202 2.72908 11.2709 2.84021 11.382C2.95135 11.4932 3.10208 11.5556 3.25924 11.5556H12.7407C12.8979 11.5556 13.0486 11.4932 13.1597 11.382C13.2709 11.2709 13.3333 11.1202 13.3333 10.963V5.03707C13.3333 4.87991 13.2709 4.72918 13.1597 4.61805C13.0486 4.50691 12.8979 4.44448 12.7407 4.44448H3.25924ZM2.00216 3.77999C2.33556 3.4466 2.78774 3.25929 3.25924 3.25929H12.7407C13.2122 3.25929 13.6644 3.4466 13.9978 3.77999C14.3312 4.11339 14.5185 4.56558 14.5185 5.03707V10.963C14.5185 11.4345 14.3312 11.8867 13.9978 12.2201C13.6644 12.5535 13.2122 12.7408 12.7407 12.7408H3.25924C2.78774 12.7408 2.33556 12.5535 2.00216 12.2201C1.66876 11.8867 1.48146 11.4345 1.48146 10.963V5.03707C1.48146 4.56558 1.66876 4.11339 2.00216 3.77999Z"
                    fill="currentColor"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M7.99998 6.81485C7.34542 6.81485 6.8148 7.34548 6.8148 8.00004C6.8148 8.6546 7.34542 9.18522 7.99998 9.18522C8.65454 9.18522 9.18517 8.6546 9.18517 8.00004C9.18517 7.34548 8.65454 6.81485 7.99998 6.81485ZM5.62961 8.00004C5.62961 6.69092 6.69086 5.62967 7.99998 5.62967C9.3091 5.62967 10.3704 6.69092 10.3704 8.00004C10.3704 9.30916 9.3091 10.3704 7.99998 10.3704C6.69086 10.3704 5.62961 9.30916 5.62961 8.00004Z"
                    fill="currentColor"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M4.6712 3.3044C4.89264 3.39613 5.03702 3.61221 5.03702 3.85189C5.03702 4.63771 4.72485 5.39136 4.16919 5.94702C3.61352 6.50268 2.85988 6.81485 2.07406 6.81485C1.83437 6.81485 1.61829 6.67047 1.52657 6.44903C1.43485 6.2276 1.48555 5.97271 1.65503 5.80323L4.0254 3.43286C4.19488 3.26338 4.44976 3.21268 4.6712 3.3044ZM13.9259 10.3704C13.4544 10.3704 13.0022 10.5577 12.6688 10.8911C12.3354 11.2245 12.1481 11.6767 12.1481 12.1482C12.1481 12.4755 11.8828 12.7408 11.5555 12.7408C11.2283 12.7408 10.9629 12.4755 10.9629 12.1482C10.9629 11.3624 11.2751 10.6087 11.8308 10.0531C12.3864 9.49739 13.1401 9.18522 13.9259 9.18522C14.2532 9.18522 14.5185 9.45053 14.5185 9.77781C14.5185 10.1051 14.2532 10.3704 13.9259 10.3704Z"
                    fill="currentColor"
                  />
                </svg>
                <p class="ml-1 text-[10px] leading-[12px]">
                  {{ totalItem(column.cards) }}
                </p>
              </div>
            </div>
            <div
              v-else
              class="h-[16px]"
            >
              <!--делаем неразрывный пробел - чтобы не скрыло и остался правильный отступ -->
              &nbsp;
            </div>
          </div>
          <!--карточки -->
          <div
            class="min-h-0 overflow-y-hidden scroll-style hover:overflow-y-auto"
            @scroll="handleCardsScroll($event, column.UID, column.cards.length)"
          >
            <template
              v-for="card in getPaginatedCards(column.cards, cardQuantityByColumns[column.UID])"
              :key="card.uid"
            >
              <BoardCard
                :id="card.uid"
                :data-card-id="card.uid"
                :card="card"
                :show-date="currentBoard?.show_date !== 0 ?? false"
                :selected="$store.state.cards.selectedCardUid === card.uid"
                :color="colorCard(column.Color)"
                :color-dots="colorCard(column.Color, 0.8)"
                class="mt-2"
                @select="selectCard(card)"
                @copyEmail="copyEmail(card)"
                @delete="deleteCard(card)"
                @moveColumn="onClickMoveCard(card)"
              />
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BoardArchiveNavbar from '@/components/Board/archive/BoardArchiveNavbar'
import * as CARD from '@/store/actions/cards'
import BoardCard from '@/components/Board/BoardCard'
import BoardModalBoxDelete from '@/components/Board/modalboxes/BoardModalBoxDelete.vue'
import BoardModalBoxCardMove from '@/components/Board/modalboxes/BoardModalBoxCardMove.vue'
import { notify } from 'notiwind'
import * as BOARD from '@/store/actions/boards'
import BoardSkeleton from '@/components/Board/skeletons/BoardSkeleton.vue'

export default {
  components: { BoardSkeleton, BoardModalBoxCardMove, BoardModalBoxDelete, BoardArchiveNavbar, BoardCard },
  data () {
    return {
      showDeleteCard: false,
      showMoveCard: false,
      currentCard: {},
      cardQuantityByColumns: {}
    }
  },
  computed: {
    status () {
      return this.$store.state.cards.status
    },
    boardUid () {
      return this.$route.params.board_id
    },
    currentBoard () {
      return this.$store.state.boards.boards[this.boardUid]
    },
    boardName () {
      return this.currentBoard.name
    },
    storeCards () {
      return this.$store.state.cards.cards.slice(-2)
    },
    filteredColumns () {
      return this.storeCards.map((column) => {
        const cards = this.getColumnCards(column)
        return {
          ...column,
          cards: cards
        }
      })
    },
    showOnlyCardsWhereIAmResponsible () {
      return this.$store.state.boards.showOnlyCardsWhereIAmResponsible
    },
    showOnlyCardsWithNoResponsible () {
      return this.$store.state.boards.showOnlyCardsWithNoResponsible
    },
    showOnlySearchText () {
      return !!this.$store.state.boards.searchText
    },
    showOnlyMyCreatedCards () {
      return this.$store.state.boards.showOnlyMyCreatedCards
    },
    employeesByEmail () {
      return this.$store.state.employees.employeesByEmail
    },
    searchText () {
      return this.$store.state.boards.searchText?.toLowerCase() || ''
    },
    isPropertiesMobileExpanded () {
      return this.$store.state.isPropertiesMobileExpanded
    }
  },
  watch: {
    storeCards: {
      immediate: true,
      handler: function (val) {
        val.forEach((column) => {
          this.cardQuantityByColumns[column.UID] = 50
        })
      }
    },
    isPropertiesMobileExpanded: {
      immediate: true,
      handler: function (val) {
        if (!val) {
          this.$store.commit(CARD.SELECT_CARD, '')
        }
      }
    }
  },
  unmounted () {
    this.$store.commit(BOARD.SHOW_SEARCH_CARDS, undefined)
    this.$store.state.tasks.selectedTask = null
  },
  mounted () {
    this.$store.dispatch(CARD.BOARD_ARCHIVE_CARDS_REQUEST, this.currentBoard.uid)
  },
  methods: {
    totalItem (cards) {
      const cost = cards.reduce((sum, card) => sum + card.cost, 0)
      if (cost > 0) {
        const fractional = cost % 100
        const value = Math.floor(cost / 100)
        let valString = ''
        let valueString = value.toString()
        while (valueString) {
          valString = valueString.slice(-3) + ' ' + valString
          valueString = valueString.slice(0, -3)
        }
        valString = valString.trim()
        if (fractional > 0) {
          const frString = (fractional < 10 ? '0' : '') + fractional
          return `${valString}.${frString}`
        }
        return valString
      }
      return ''
    },
    getPaginatedCards (cards, quantity) {
      if (quantity >= cards.length) {
        quantity = cards.length
      }
      return cards.slice(0, quantity)
    },
    searchFilteredCards (cards) {
      return cards.filter(
        card => {
          return (card.comment + card.name).toLowerCase().includes(this.searchText)
        }
      )
    },
    getColumnCards (column) {
      if (!column?.cards?.length) return []
      const currentUserEmail = this.$store.state.user.user.current_user_email.toLowerCase()

      if (this.showOnlyCardsWhereIAmResponsible && this.showOnlyMyCreatedCards) {
        const cards = column.cards.filter(card => card.user.toLowerCase() === currentUserEmail && card.email_creator.toLowerCase() === currentUserEmail)

        if (this.showOnlySearchText) {
          return this.searchFilteredCards(cards)
        }
        return cards
      } else if (this.showOnlyCardsWhereIAmResponsible) {
        const cards = column.cards.filter(card => card.user.toLowerCase() === currentUserEmail)

        if (this.showOnlySearchText) {
          return this.searchFilteredCards(cards)
        }
        return cards
      } else if (this.showOnlyCardsWithNoResponsible && this.showOnlyMyCreatedCards) {
        const cards = column.cards.filter(card => !card.user && card.email_creator.toLowerCase() === currentUserEmail)

        if (this.showOnlySearchText) {
          return this.searchFilteredCards(cards)
        }
        return cards
      } else if (this.showOnlyCardsWithNoResponsible) {
        const cards = column.cards.filter(card => !card.user)

        if (this.showOnlySearchText) {
          return this.searchFilteredCards(cards)
        }
        return cards
      } else if (this.showOnlyMyCreatedCards) {
        const cards = column.cards.filter(card => card.email_creator.toLowerCase() === currentUserEmail)

        if (this.showOnlySearchText) {
          return this.searchFilteredCards(cards)
        }
        return cards
      } else if (this.showOnlySearchText) {
        return column.cards.filter(
          card => (card.comment + card.name + this.employeesByEmail[card.user]?.name ?? card.user).toLowerCase().includes(this.searchText)
        )
      }

      return column.cards
    },
    hexToRgb (hex, shift = 0, opacity) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return `rgba(${parseInt(result[1], 16) - shift}, ${parseInt(result[2], 16) - shift}, ${parseInt(result[3], 16) - shift}, ${opacity})`
    },
    colorCard (color, opacity = 1) {
      if (color === '') {
        color = '#ffffff'
      }
      return this.hexToRgb(color, 20, opacity)
    },
    selectCard (card) {
      if (this.$store.state.cards.selectedCardUid === card.uid) {
        return
      }
      this.$store.commit(CARD.SELECT_CARD, card.uid)

      this.$store.commit('basic', { key: 'propertiesState', value: 'card' })
      this.$store.dispatch('asidePropertiesToggle', true)
    },
    copyEmail (card) {
      const email = this.checkIfEmailInString(card.name)
      navigator.clipboard.writeText(email)
      notify(
        {
          group: 'api',
          title: 'Email скопирован',
          action: '',
          text: email
        },
        15000
      )
    },
    checkIfEmailInString (text) {
      const regex = /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/
      return regex.exec(text) ? regex.exec(text)[0] : ''
    },
    deleteCard (card) {
      this.showDeleteCard = true
      this.currentCard = card
    },
    onClickMoveCard (card) {
      this.showMoveCard = true
      this.currentCard = card
    },
    onDeleteCard () {
      this.$store.dispatch('asidePropertiesToggle', false)
      this.showDeleteCard = false
      if (this.currentCard) {
        this.$store
          .dispatch(CARD.DELETE_CARD, { uid: this.currentCard.uid })
          .then((resp) => {
            console.log('Card is deleted')
          })
      }
    },
    onChangeCardPosition (position) {
      this.showMoveCard = false
      const data = {
        cards: [{ uid: this.currentCard.uid, order: this.getNewMaxCardsOrderAtColumn(position.stageUid) }],
        boardTo: position.boardUid,
        stageTo: position.stageUid
      }
      this.$store.dispatch(CARD.MOVE_ALL_CARDS, data).then(res => {
        this.closeProperties()
        this.$store.state.cards.selectedCardUid = null
        this.currentCard = {}
      })
    },
    getNewMaxCardsOrderAtColumn (columnUid) {
      const column = this.storeCards.find((stage) => stage.UID === columnUid)
      if (!column || !column.cards.length) return 1.0
      const maxOrder = column.cards.reduce(
        (maxOrder, card) => (card.order > maxOrder ? card.order : maxOrder),
        Number.MIN_VALUE
      )
      return Math.floor(maxOrder) + 1
    },
    closeProperties () {
      this.$store.dispatch('asidePropertiesToggle', false)
      this.$store.commit(CARD.SELECT_CARD, '')
      console.log('this.$store.state.cards.selectedCardUid -->', this.$store.state.cards.selectedCardUid)
    },
    handleCardsScroll (event, columnUid, cardsLength) {
      const { scrollTop, offsetHeight, scrollHeight } = event.target

      if ((scrollTop + offsetHeight) >= scrollHeight - 10 && this.cardQuantityByColumns[columnUid] < cardsLength) {
        this.cardQuantityByColumns[columnUid] += 50
      }
    }
  }
}
</script>
