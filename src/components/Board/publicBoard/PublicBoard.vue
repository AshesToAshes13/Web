<template>
  <BoardSkeleton
    v-if="status == 'loading'"
  />
  <div
    v-if="status == 'success'"
    id="Board"
    class="h-full"
  >
    <draggable
      v-dragscroll:nochilddrag
      class="h-full flex items-start overflow-y-hidden overflow-x-auto scroll-style"
      :list="filteredColumns"
      ghost-class="ghost-column"
      item-key="UID"
      group="columns"
      handle=".draggable-column"
      :fallback-tolerance="1"
      :force-fallback="true"
    >
      <template #item="{element: column}">
        <div
          v-if="isColumnVisible(column)"
          data-dragscroll
          class="max-h-full flex flex-col flex-none bg-white rounded-[6px] overflow-x-hidden overflow-y-auto scroll-style pl-[13px] py-4 w-[280px] mr-[10px] stage-column"
          :style="{ background: column.Color }"
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
                class="text-[#424242] cursor-default font-['Roboto'] font-bold text-[16px] leading-[19px] w-full break-words"
              >
                {{ column.Name }}
              </p>
            </div>
          </div>
          <!--под заголовок стат-колонки -->
          <div
            class="pl-1 pr-[16px] text-[#7e7e80] font-['Roboto'] mt-[6px]"
            :style="{ color: getContrastYIQ(column.Color) }"
          >
            <div
              v-if="column.cards.length"
              data-dragscroll
              class="flex items-center justify-between h-[16px]"
            >
              <PopMenu
                :disabled="isReadOnlyBoard"
              >
                <p
                  class="text-[12px] leading-[14px] cursor-default"
                  data-dragscroll
                >
                  Карточек: {{ column.cards.length }}
                </p>
              </PopMenu>

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
            <draggable
              :id="column.UID"
              :data-column-id="column.UID"
              :list="getPaginatedCards(column.cards, cardQuantityByColumns[column.UID])"
              ghost-class="ghost-card"
              item-key="uid"
              group="cards"
              :disabled="true"
            >
              <template #item="{ element }">
                <PublicBoardCard
                  :id="element.uid"
                  :data-card-id="element.uid"
                  :card="element"
                  :show-date="board?.show_date !== 0 ?? false"
                  :read-only="isReadOnlyBoard"
                  :selected="$store.state.cards.selectedCardUid === element.uid"
                  :color="colorCard(column.Color)"
                  :color-dots="colorCard(column.Color, 0.8)"
                  class="mt-2"
                />
              </template>
            </draggable>
          </div>
        </div>
      </template>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { dragscroll } from 'vue-dragscroll'
import PublicBoardCard from '@/components/Board/publicBoard/PublicBoardCard.vue'
import BoardSkeleton from '@/components/Board/skeletons/BoardSkeleton.vue'
import * as BOARD from '@/store/actions/boards'
import * as CARD from '@/store/actions/cards'

export default {
  directives: {
    dragscroll
  },
  components: {
    BoardSkeleton,
    PublicBoardCard,
    draggable
  },
  props: {
    storeCards: {
      type: Array,
      default: () => []
    },
    board: {
      type: Object,
      default: () => ({})
    },
    showArchive: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      showAddCard: false,
      showAddColumn: false,
      showRenameColumn: false,
      selectedColumn: null,
      showDeleteColumn: false,
      showColorColumn: false,
      showMoveColumn: false,
      showDeleteCard: false,
      currentCard: null,
      dragCardParam: null,
      showMoveCard: false,
      showMoveAllCards: false,
      columnUid: '',
      dragColumnParam: null,
      cardQuantityByColumns: {},
      isSavingMoveNow: false
    }
  },
  computed: {
    visibleColumns () {
      return this.storeCards.filter((column) => this.isColumnVisible(column))
    },
    usersColumns () {
      return this.storeCards.filter((stage) => stage.UserStage === true)
    },
    selectedColumnName () {
      return this.selectedColumn?.Name ?? ''
    },
    selectedColumnColor () {
      return this.selectedColumn?.Color ?? ''
    },
    selectedColumnOrder () {
      return this.selectedColumn?.Order ?? 0
    },
    usersColumnsCount () {
      return this.usersColumns.length
    },
    columnsNames () {
      return this.usersColumns.map((column) => column.Name)
    },
    status () {
      return this.$store.state.cards.status
    },
    employeesByEmail () {
      return this.$store.state.employees.employeesByEmail
    },
    showOnlyCardsWhereIAmResponsible () {
      return this.$store.state.boards.showOnlyCardsWhereIAmResponsible
    },
    showOnlyCardsWithNoResponsible () {
      return this.$store.state.boards.showOnlyCardsWithNoResponsible
    },
    showOnlyMyCreatedCards () {
      return this.$store.state.boards.showOnlyMyCreatedCards
    },
    showOnlySearchText () {
      return !!this.$store.state.boards.searchText
    },
    searchText () {
      return this.$store.state.boards.searchText?.toLowerCase() || ''
    },
    isPropertiesMobileExpanded () {
      return this.$store.state.isPropertiesMobileExpanded
    },
    isFiltered () {
      return this.showOnlyMyCreatedCards || this.showOnlyCardsWithNoResponsible || this.showOnlyCardsWhereIAmResponsible || this.showOnlySearchText
    },
    isReadOnlyBoard () {
      return !this.board || this.board.type_access === 0
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
    user () {
      return this.$store.state.user.user
    },
    boardUid () {
      return this.board?.uid || ''
    }
  },
  watch: {
    boardUid: {
      immediate: true,
      handler: function (val) {
        this.$store.commit(CARD.SELECT_PUBLIC_CARD, '')
        this.$store.commit(BOARD.BOARD_CLEAR_FILTER)
      }
    },
    board: {
      immediate: true,
      handler: function (val) {
        this.$store.commit(BOARD.SELECT_BOARD, val)
      }
    },
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
          this.$store.commit(CARD.SELECT_PUBLIC_CARD, '')
        }
      }
    }
  },
  unmounted () {
    this.$store.commit(BOARD.SHOW_SEARCH_CARDS, undefined)
    this.$store.state.tasks.selectedTask = null
  },
  methods: {
    handleCardsScroll (event, columnUid, cardsLength) {
      const { scrollTop, offsetHeight, scrollHeight } = event.target

      if ((scrollTop + offsetHeight) >= scrollHeight && this.cardQuantityByColumns[columnUid] < cardsLength) {
        this.cardQuantityByColumns[columnUid] += 50
      }
    },
    getContrastYIQ (hexcolor) {
      if (!hexcolor) return null
      hexcolor = hexcolor.replace('#', '')
      const r = parseInt(hexcolor.substr(0, 2), 16)
      const g = parseInt(hexcolor.substr(2, 2), 16)
      const b = parseInt(hexcolor.substr(4, 2), 16)
      const yiq = (r * 299 + g * 587 + b * 114) / 1000
      return yiq >= 128 ? 'black' : 'white'
    },
    hexToRgb (hex, shift = 0, opacity) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return `rgba(${parseInt(result[1], 16) - shift}, ${parseInt(result[2], 16) - shift}, ${parseInt(result[3], 16) - shift}, ${opacity})`
    },
    colorCard (color, opacity = 1) {
      const allColors = {
        '': '#ffffff',
        '#7fc870': '#7fc870',
        '#69c494': '#69c494',
        '#dff2e1': '#dff2e1',
        '#ffaf40': '#ffaf40',
        '#ffd7a0': '#ffd7a0',
        '#5ba4cf': '#5ba4cf',
        '#9eedff': '#9eedff',
        '#b381b3': '#b381b3',
        '#e5e5e5': '#e5e5e5',
        '#ddd1c2': '#ddd1c2',
        '#ef7665': '#ef7665',
        '#ffc6b5': '#ffc6b5',
        '#ff8ed4': '#ff8ed4',
        '#f5dbf5': '#f5dbf5',
        '#6a7077': '#6a7077',
        '#f6dd29': '#f6dd29',
        '#f5f547': '#f5f547'
      }
      return this.hexToRgb(allColors[color], 20, opacity)
    },
    isColumnVisible (column) {
      if (this.showArchive) {
        // показываем только архив
        return column.Archive
      }
      // скрываем архив
      if (column.Archive) return false
      // скрываем пустое неразобранное
      const isDragCardFromUnsortedNow = this.dragCardParam?.move?.column?.Unsorted ?? false
      if (column.Unsorted && column.cards.length === 0 && !isDragCardFromUnsortedNow) return false
      return true
    },
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
    getColumnCards (column) {
      if (!column?.cards?.length) return []
      return column.cards
    },
    lockVisibility (stageUid) {
      const icon = this.$refs[`stage-icon-${stageUid}`]
      icon.style.visibility = 'visible'
    },
    unlockVisibility (stageUid) {
      const icon = this.$refs[`stage-icon-${stageUid}`]
      if (icon) icon.style.visibility = null
    },
    searchFilteredCards (cards) {
      return cards.filter(
        card => {
          return (card.comment + card.name).toLowerCase().includes(this.searchText)
        }
      )
    },
    getNewMinCardsOrderAtColumn (columnUid) {
      const column = this.storeCards.find((stage) => stage.UID === columnUid)
      if (!column || !column.cards.length) return 1.0
      const minOrder = column.cards.reduce(
        (minOrder, card) => (card.order < minOrder ? card.order : minOrder),
        Number.MAX_VALUE
      )
      return Math.floor(minOrder) - 1
    },
    getNewMaxCardsOrderAtColumn (columnUid) {
      const column = this.storeCards.find((stage) => stage.UID === columnUid)
      if (!column || !column.cards.length) return 1.0
      const maxOrder = column.cards.reduce(
        (maxOrder, card) => (card.order > maxOrder ? card.order : maxOrder),
        Number.MIN_VALUE
      )
      return Math.floor(maxOrder) + 1
    }
  }
}
</script>

<style scoped>
.stage-column:hover .stage-column-hover\:visible {
  visibility: visible;
}
.ghost-card {
  opacity: 0.5;
  background: #f7fafc;
  border: 1px solid #4299e1;
}
.ghost-column {
  opacity: 0;
}
.light {
  --popper-theme-background-color: #ffffff;
  --popper-theme-background-color-hover: #ffffff;
  --popper-theme-text-color: #444444;
  --popper-theme-border-width: 1px;
  --popper-theme-border-style: solid;
  --popper-theme-border-color: rgba(0, 0, 0, 0.12);
  --popper-theme-border-radius: 10px;
  --popper-theme-padding: 17px 15px;
  --popper-theme-box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.25);
}
</style>
