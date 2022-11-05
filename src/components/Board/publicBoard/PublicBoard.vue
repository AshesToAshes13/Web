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
              <p
                class="text-[12px] leading-[14px] cursor-default"
                data-dragscroll
              >
                Карточек: {{ column.cards.length }}
              </p>
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
    }
  },
  data () {
    return {
      dragCardParam: null,
      cardQuantityByColumns: {}
    }
  },
  computed: {
    visibleColumns () {
      return this.storeCards.filter((column) => this.isColumnVisible(column))
    },
    usersColumns () {
      return this.storeCards.filter((stage) => stage.UserStage === true)
    },
    usersColumnsCount () {
      return this.usersColumns.length
    },
    status () {
      return this.$store.state.cards.status
    },
    employeesByEmail () {
      return this.$store.state.employees.employeesByEmail
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
    }
  },
  watch: {
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
    }
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
      // скрываем архив
      if (column.Archive) return false
      // скрываем пустое неразобранное
      const isDragCardFromUnsortedNow = this.dragCardParam?.move?.column?.Unsorted ?? false
      if (column.Unsorted && column.cards.length === 0 && !isDragCardFromUnsortedNow) return false
      return true
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
</style>
