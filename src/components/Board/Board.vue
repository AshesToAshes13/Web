<template>
  <BoardSkeleton
    v-if="status == 'loading'"
  />
  <div
    v-else-if="status == 'success'"
    id="Board"
    class="h-full"
  >
    <BoardModalBoxDelete
      v-if="showDeleteCard"
      title="Удалить карточку"
      text="Вы действительно хотите удалить карточку?"
      @cancel="showDeleteCard = false"
      @yes="onDeleteCard"
    />
    <BoardModalBoxDelete
      v-if="showDeleteColumn"
      title="Удалить колонку"
      text="Вы действительно хотите удалить колонку?"
      @cancel="showDeleteColumn = false"
      @yes="onDeleteColumn"
    />
    <!-- Изменения названия колонка -->
    <BoardModalBoxColor
      v-if="showColorColumn"
      :color="selectedColumnColor"
      @cancel="showColorColumn = false"
      @changeColor="onChangeColumnColor"
    />
    <BoardModalBoxMove
      v-if="showMoveColumn"
      :show="showMoveColumn"
      :position="selectedColumnOrder"
      :names="columnsNames"
      :count-all="usersColumnsCount"
      @cancel="showMoveColumn = false"
      @changePosition="onChangeColumnPosition"
    />
    <BoardModalBoxCardMove
      v-if="showMoveCard"
      :show="showMoveCard"
      :stage-uid="currentCard.uid_stage"
      :board-uid="currentCard.uid_board"
      @cancel="showMoveCard = false"
      @changePosition="onChangeCardPosition"
    />
    <BoardModalBoxColumnBoardChange
      v-if="showChangeColumnBoard"
      :show="showChangeColumnBoard"
      :board-uid="boardUid"
      @cancel="showChangeColumnBoard = false"
      @changePosition="onChangeColumnBoard"
    />
    <BoardModalBoxCardMove
      v-if="showMoveAllCards"
      :show="showMoveAllCards"
      title="Переместить все карточки колонки"
      :stage-uid=" selectedColumn.UID"
      :board-uid="board.uid"
      @cancel="showMoveAllCards = false"
      @changePosition="onChangeAllCardsPosition"
    />
    <div class="h-full flex flex-col">
      <div
        v-if="boardComment"
        class="flex-none mb-[24px] whitespace-pre-line font-roboto text-[16px] leading-[25px] font-normal text-[#4c4c4d]"
      >
        {{ boardComment }}
      </div>
      <draggable
        v-dragscroll:nochilddrag
        class="flex h-full items-start overflow-y-hidden overflow-x-auto scroll-style"
        :list="filteredColumns"
        ghost-class="ghost-column"
        item-key="UID"
        group="columns"
        handle=".draggable-column"
        :fallback-tolerance="1"
        :force-fallback="true"
        :animation="180"
        :scroll-sensitivity="100"
        :move="checkMoveDragColumn"
        @start="startDragColumn"
        @end="endDragColumn"
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
              :class="{ 'draggable-column cursor-move': column.CanEditStage && !showRenameColumn }"
            >
              <div
                class="w-[calc(100%-18px)] "
              >
                <BoardInputValue
                  v-if="showRenameColumn && column.UID === selectedColumn.UID"
                  :show="showRenameColumn && column.UID === selectedColumn.UID"
                  :value="selectedColumnName"
                  maxlength="50"
                  @cancel="showRenameColumn = false"
                  @save="onRenameColumn"
                />
                <p
                  v-else
                  class="text-[#424242] font-['Roboto'] font-bold text-[16px] leading-[19px] w-full break-words"
                  :class="{ 'cursor-default': !column.CanEditStage }"
                >
                  {{ column.Name }}
                </p>
              </div>
              <!-- Три точки -->
              <div
                v-if="column.CanEditStage"
                :ref="`stage-icon-${column.UID}`"
                class="flex-none h-[18px] w-[18px] cursor-pointer invisible stage-column-hover:visible"
              >
                <PopMenu
                  @openMenu="lockVisibility(column.UID)"
                  @closeMenu="unlockVisibility(column.UID)"
                >
                  <div
                    class="hover:-m-px hover:border hover:rounded-sm"
                    :style="{
                      'border-color': getContrastYIQ(column.Color) ?? '#7e7e80'
                    }"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M9.35524 16.6055C8.37421 16.6055 7.57892 15.8102 7.57892 14.8291C7.57892 13.8481 8.37421 13.0528 9.35524 13.0528C10.3363 13.0528 11.1316 13.8481 11.1316 14.8291C11.1316 15.8102 10.3363 16.6055 9.35524 16.6055ZM9.35524 11.2765C8.37421 11.2765 7.57892 10.4812 7.57892 9.50016C7.57892 8.51912 8.37421 7.72383 9.35524 7.72383C10.3363 7.72383 11.1316 8.51912 11.1316 9.50016C11.1316 10.4812 10.3363 11.2765 9.35524 11.2765ZM7.57892 4.17118C7.57892 5.15222 8.37421 5.9475 9.35524 5.9475C10.3363 5.9475 11.1316 5.15222 11.1316 4.17118C11.1316 3.19015 10.3363 2.39486 9.35524 2.39486C8.37421 2.39486 7.57892 3.19015 7.57892 4.17118Z"
                        :fill="getContrastYIQ(column.Color) ?? '#7e7e80'"
                      />
                    </svg>
                  </div>
                  <template #menu>
                    <PopMenuItem
                      v-if="column.CanEditStage"
                      icon="edit"
                      @click="clickRenameColumn(column, $event)"
                    >
                      Переименовать
                    </PopMenuItem>
                    <PopMenuItem
                      v-if="column.CanEditStage"
                      icon="color"
                      @click="clickColorColumn(column, $event)"
                    >
                      Выбрать цвет
                    </PopMenuItem>
                    <PopMenuItem
                      v-if="column.CanEditStage"
                      icon="move"
                      @click="clickMoveColumn(column, $event)"
                    >
                      Изменить позицию
                    </PopMenuItem>
                    <PopMenuItem
                      v-if="column.CanEditStage"
                      icon="move"
                      @click="clickChangeColumnBoard(column, $event)"
                    >
                      Переместить в другую доску
                    </PopMenuItem>
                    <PopMenuItem
                      v-if="column.CanEditStage"
                      icon="delete"
                      type="delete"
                      @click="clickDeleteColumn(column, $event)"
                    >
                      Удалить
                    </PopMenuItem>
                  </template>
                </PopMenu>
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
                    class="text-[12px] leading-[14px]"
                    data-dragscroll
                    :class="{ 'hover:underline cursor-pointer': !isReadOnlyBoard}"
                  >
                    Карточек: {{ column.cards.length }}
                  </p>
                  <template #menu>
                    <PopMenuItem
                      icon="move"
                      @click="clickMoveAllColumnCards(column)"
                    >
                      Переместить
                    </PopMenuItem>
                  </template>
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
              class="min-h-0 overflow-y-hidden scroll-style hover:overflow-y-auto pt-[3px]"
              @scroll="handleCardsScroll($event, column.UID, column.cards.length)"
            >
              <draggable
                :id="column.UID"
                :data-column-id="column.UID"
                :list="column.paginatedCards"
                ghost-class="ghost-card"
                item-key="uid"
                group="cards"
                :disabled="isReadOnlyBoard || isFiltered || isSavingMoveNow"
                :move="checkMoveDragCard"
                :fallback-tolerance="1"
                :force-fallback="true"
                :animation="380"
                :scroll-sensitivity="150"
                @start="startDragCard"
                @end="endDragCard"
                @change="changeDragCard"
              >
                <template #item="{ element }">
                  <BoardCard
                    :id="element.uid"
                    :data-card-id="element.uid"
                    :card="element"
                    :show-date="board?.show_date !== 0 ?? false"
                    :read-only="isReadOnlyBoard"
                    :selected="$store.state.cards.selectedCardUid === element.uid"
                    :color="colorCard(column.Color)"
                    :color-dots="colorCard(column.Color, 0.8)"
                    class="mt-2"
                    @select="selectCard(element)"
                    @copyEmail="copyEmail(element)"
                    @delete="deleteCard(element)"
                    @moveSuccess="moveSuccessCard(element)"
                    @moveReject="moveRejectCard(element)"
                    @moveColumn="onClickMoveCard(element)"
                    @moveCardToTop="moveCardToTop(element)"
                    @moveCardToBottom="moveCardToBottom(element)"
                  />
                </template>
              </draggable>
            </div>
            <!--кнопка добавить карточку -->
            <div
              v-if="column.AddCard && !isFiltered"
              class="mt-2 min-h-[41px]"
              data-dragscroll
            >
              <BoardTextareaValue
                v-if="showAddCard && column.UID === selectedColumn.UID"
                :show="showAddCard && column.UID === selectedColumn.UID"
                class="w-[254px]"
                @save="onAddNewCard"
                @cancel="showAddCard = false"
              />
              <button
                v-else
                class="flex justify-center items-center h-[40px] w-full font-['Roboto'] text-[#7e7e80]"
                :style="{ color: getContrastYIQ(column.Color) }"
                @click="addCard(column)"
              >
                <p class="text-sm">
                  Добавить карточку
                </p>
                <svg
                  class="ml-[5px]"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.935 5.00389L10 5C10.1361 5.00002 10.2674 5.04998 10.3691 5.1404C10.4708 5.23082 10.5357 5.35542 10.5517 5.49056L10.5556 5.55556V9.44444H14.4444C14.5805 9.44446 14.7119 9.49442 14.8135 9.58484C14.9152 9.67526 14.9802 9.79986 14.9961 9.935L15 10C15 10.1361 14.95 10.2674 14.8596 10.3691C14.7692 10.4708 14.6446 10.5357 14.5094 10.5517L14.4444 10.5556H10.5556V14.4444C10.5555 14.5805 10.5056 14.7119 10.4152 14.8135C10.3247 14.9152 10.2001 14.9802 10.065 14.9961L10 15C9.86393 15 9.73259 14.95 9.6309 14.8596C9.52922 14.7692 9.46425 14.6446 9.44833 14.5094L9.44444 14.4444V10.5556H5.55556C5.41948 10.5555 5.28815 10.5056 5.18646 10.4152C5.08477 10.3247 5.01981 10.2001 5.00389 10.065L5 10C5.00002 9.86393 5.04998 9.73259 5.1404 9.6309C5.23082 9.52922 5.35542 9.46425 5.49056 9.44833L5.55556 9.44444H9.44444V5.55556C9.44446 5.41948 9.49442 5.28815 9.58484 5.18646C9.67526 5.08477 9.79986 5.01981 9.935 5.00389L10 5L9.935 5.00389Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>
          </div>
        </template>
        <template #footer>
          <!-- кнопка Добавить колонку -->
          <div
            v-if="board.type_access === 1"
            class="flex-none bg-white rounded-xl w-[280px] h-[48px] mr-[10px] px-[12px]"
          >
            <BoardInputValue
              v-if="showAddColumn"
              :show="showAddColumn"
              maxlength="50"
              class="mt-[4px] h-[40px]"
              @cancel="showAddColumn = false"
              @save="onAddNewColumn"
            />
            <div
              v-else
              class="flex justify-center items-center h-full w-full cursor-pointer font-['Roboto'] text-[#7e7e80]"
              @click="clickAddColumn"
            >
              <p class="text-sm">
                Добавить колонку
              </p>
              <svg
                class="ml-[5px]"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.935 5.00389L10 5C10.1361 5.00002 10.2674 5.04998 10.3691 5.1404C10.4708 5.23082 10.5357 5.35542 10.5517 5.49056L10.5556 5.55556V9.44444H14.4444C14.5805 9.44446 14.7119 9.49442 14.8135 9.58484C14.9152 9.67526 14.9802 9.79986 14.9961 9.935L15 10C15 10.1361 14.95 10.2674 14.8596 10.3691C14.7692 10.4708 14.6446 10.5357 14.5094 10.5517L14.4444 10.5556H10.5556V14.4444C10.5555 14.5805 10.5056 14.7119 10.4152 14.8135C10.3247 14.9152 10.2001 14.9802 10.065 14.9961L10 15C9.86393 15 9.73259 14.95 9.6309 14.8596C9.52922 14.7692 9.46425 14.6446 9.44833 14.5094L9.44444 14.4444V10.5556H5.55556C5.41948 10.5555 5.28815 10.5056 5.18646 10.4152C5.08477 10.3247 5.01981 10.2001 5.00389 10.065L5 10C5.00002 9.86393 5.04998 9.73259 5.1404 9.6309C5.23082 9.52922 5.35542 9.46425 5.49056 9.44833L5.55556 9.44444H9.44444V5.55556C9.44446 5.41948 9.49442 5.28815 9.58484 5.18646C9.67526 5.08477 9.79986 5.01981 9.935 5.00389L10 5L9.935 5.00389Z"
                  fill="currentColor"
                />
              </svg>
            </div>
          </div>
          <div class="flex-none w-[1px]">
            &nbsp;
          </div>
        </template>
      </draggable>
    </div>
  </div>
</template>

<script>
import PopMenu from '@/components/Common/PopMenu.vue'
import PopMenuItem from '@/components/Common/PopMenuItem.vue'
import draggable from 'vuedraggable'
import { dragscroll } from 'vue-dragscroll'
import BoardCard from '@/components/Board/BoardCard.vue'
import BoardModalBoxDelete from '@/components/Board/modalboxes/BoardModalBoxDelete.vue'
import BoardModalBoxColor from '@/components/Board/modalboxes/BoardModalBoxColor.vue'
import BoardModalBoxMove from '@/components/Board/modalboxes/BoardModalBoxMove.vue'

import BoardModalBoxCardMove from '@/components/Board/modalboxes/BoardModalBoxCardMove.vue'
import BoardSkeleton from '@/components/Board/skeletons/BoardSkeleton.vue'
import * as BOARD from '@/store/actions/boards'
import * as CARD from '@/store/actions/cards'
import BoardInputValue from './BoardInputValue.vue'
import BoardModalBoxColumnBoardChange from '@/components/Board/modalboxes/BoardModalBoxColumnBoardChange.vue'
import BoardTextareaValue from './BoardTextareaValue.vue'
import { notify } from 'notiwind'

const DEF_COUNT_CARDS_BY_PAGE = 50

export default {
  directives: {
    dragscroll
  },
  components: {
    PopMenu,
    PopMenuItem,
    BoardModalBoxDelete,
    BoardModalBoxColor,
    BoardModalBoxMove,
    BoardModalBoxCardMove,
    BoardSkeleton,
    BoardCard,
    draggable,
    BoardInputValue,
    BoardModalBoxColumnBoardChange,
    BoardTextareaValue
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
      showChangeColumnBoard: false,
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
    displayModal () {
      return !this.$store.state.onboarding?.visitedModals?.includes('boards') && this.$store.state?.onboarding?.showModals
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
        const paginatedCards = this.getPaginatedCards(cards, this.cardQuantityByColumns[column.UID] || DEF_COUNT_CARDS_BY_PAGE)
        return {
          ...column,
          cards: cards,
          paginatedCards
        }
      })
    },
    user () {
      return this.$store.state.user.user
    },
    boardUid () {
      return this.board?.uid || ''
    },
    boardComment () {
      return this.board?.comment || ''
    }
  },
  watch: {
    boardUid: {
      immediate: true,
      handler: function (val) {
        this.$store.commit(CARD.SELECT_CARD, '')
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
          this.cardQuantityByColumns[column.UID] = DEF_COUNT_CARDS_BY_PAGE
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
  methods: {
    print (msg, val) {
      console.log(msg, val)
    },
    handleCardsScroll (event, columnUid, cardsLength) {
      const { scrollTop, offsetHeight, scrollHeight } = event.target

      if ((scrollTop + offsetHeight) >= scrollHeight && this.cardQuantityByColumns[columnUid] < cardsLength) {
        this.cardQuantityByColumns[columnUid] += DEF_COUNT_CARDS_BY_PAGE
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
      if (color === '') {
        color = '#ffffff'
      }
      return this.hexToRgb(color, 20, opacity)
    },
    isColumnVisible (column) {
      // скрываем архив
      if (column.Archive) return false
      // скрываем пустое неразобранное
      const isDragCardFromUnsortedNow = this.dragCardParam?.move?.column?.Unsorted ?? false
      return !(column.Unsorted && column.cards.length === 0 && !isDragCardFromUnsortedNow)
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
    addCard (column) {
      this.showAddCard = true
      this.selectedColumn = column
    },
    clickAddColumn (e) {
      this.showAddColumn = true
    },
    onAddNewColumn (name) {
      this.showAddColumn = false
      const title = name.trim()
      if (title) {
        this.$store
          .dispatch(BOARD.ADD_STAGE_BOARD_REQUEST, {
            boardUid: this.boardUid,
            newStageTitle: title
          })
          .then((resp) => {
            this.$store.dispatch(CARD.BOARD_CARDS_ADDSTAGE, resp)
          })
      }
    },
    clickRenameColumn (column, e) {
      this.selectedColumn = column
      this.showRenameColumn = true
    },
    onRenameColumn (name) {
      this.$store.dispatch('asidePropertiesToggle', false)
      this.showRenameColumn = false
      if (this.selectedColumn.Name === name) return
      const title = name.trim()
      if (title) {
        this.$store
          .dispatch(BOARD.RENAME_STAGE_BOARD_REQUEST, {
            boardUid: this.boardUid,
            stageUid: this.selectedColumn.UID,
            newStageTitle: title
          })
          .then((resp) => {
            this.$store.dispatch(CARD.BOARD_CARDS_RENAME_STAGE, resp)
          })
      }
    },
    clickDeleteColumn (column, e) {
      this.selectedColumn = column
      this.showDeleteColumn = true
    },
    onDeleteColumn () {
      this.$store.dispatch('asidePropertiesToggle', false)
      this.showDeleteColumn = false
      if (this.selectedColumn) {
        const data = {
          boardUid: this.boardUid,
          stageUid: this.selectedColumn.UID
        }
        this.$store
          .dispatch(BOARD.DELETE_STAGE_BOARD_REQUEST, data)
          .then((resp) => {
            this.$store.dispatch(CARD.BOARD_CARDS_DELETE_STAGE, data)
          })
      }
    },
    clickColorColumn (column, e) {
      this.selectedColumn = column
      this.showColorColumn = true
    },
    onChangeColumnColor (color) {
      this.showColorColumn = false
      if (this.selectedColumn) {
        this.$store
          .dispatch(BOARD.CHANGE_COLOR_STAGE_BOARD_REQUEST, {
            boardUid: this.boardUid,
            stageUid: this.selectedColumn.UID,
            newColor: color
          })
          .then((resp) => {
            this.$store.dispatch(CARD.BOARD_CARDS_CHANGE_COLOR_STAGE, resp)
          })
      }
    },
    clickMoveColumn (column, e) {
      this.selectedColumn = column
      this.showMoveColumn = true
    },
    clickChangeColumnBoard (column, e) {
      this.selectedColumn = column
      this.showChangeColumnBoard = true
    },
    onChangeColumnPosition (order) {
      this.showMoveColumn = false
      if (this.selectedColumn) {
        this.changeColumnOrder(this.selectedColumn.UID, order)
      }
    },
    changeColumnOrder (columnUid, newOrder) {
      this.$store
        .dispatch(BOARD.CHANGE_ORDER_STAGE_BOARD_REQUEST, {
          boardUid: this.boardUid,
          stageUid: columnUid,
          newOrder: newOrder
        })
        .then((resp) => {
          this.$store.dispatch(CARD.BOARD_CARDS_CHANGE_ORDER_STAGE, resp.data)
        })
    },
    lockVisibility (stageUid) {
      const icon = this.$refs[`stage-icon-${stageUid}`]
      icon.style.visibility = 'visible'
    },
    unlockVisibility (stageUid) {
      const icon = this.$refs[`stage-icon-${stageUid}`]
      if (icon) icon.style.visibility = null
    },
    onAddNewCard (name) {
      this.showAddCard = false
      const title = name.trim()
      if (title) {
        this.$store
          .dispatch(CARD.ADD_CARD, {
            name: title,
            comment: '',
            uid_board: this.boardUid,
            uid_stage: this.selectedColumn.UID
          })
          .then((resp) => {
            resp.data.uid_client = ''
            if (this.$store.state.isPropertiesMobileExpanded) {
              this.selectCard(resp.data)
            }
            console.log('onAddNewCard ok', resp)
            const column = document.getElementById(this.selectedColumn.UID)

            column.scrollIntoView({ block: 'end', behavior: 'smooth' })
            this.selectCard(resp.data)
          })
      }
    },
    searchFilteredCards (cards) {
      return cards.filter(
        card => {
          return (card.comment + card.name).toLowerCase().includes(this.searchText)
        }
      )
    },
    selectCard (card) {
      if (this.$store.state.cards.blockSelectCard === true) {
        return
      }
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
    closeProperties () {
      this.$store.dispatch('asidePropertiesToggle', false)
      this.$store.commit(CARD.SELECT_CARD, '')
    },
    deleteCard (card) {
      this.showDeleteCard = true
      this.currentCard = card
    },
    moveCard (cardUid, stageUid, newOrder) {
      this.closeProperties()
      this.isSavingMoveNow = true
      this.$store
        .dispatch(CARD.MOVE_CARD, { uid: cardUid, stageUid, newOrder })
        .then((resp) => {
          console.log('Card is moved')
        }).finally(() => {
          this.isSavingMoveNow = false
        })
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
    },
    moveSuccessCard (card) {
      const successStage = 'f98d6979-70ad-4dd5-b3f8-8cd95cb46c67'
      this.moveCard(card.uid, successStage, this.getNewMinCardsOrderAtColumn(successStage))
    },
    moveRejectCard (card) {
      const rejectStage = 'e70af5e2-6108-4c02-9a7d-f4efee78d28c'
      this.moveCard(card.uid, rejectStage, this.getNewMinCardsOrderAtColumn(rejectStage))
    },
    onClickMoveCard (card) {
      this.showMoveCard = true
      this.currentCard = card
    },
    moveCardToTop (card) {
      const column = card.uid_stage
      this.moveCard(card.uid, column, this.getNewMinCardsOrderAtColumn(column))
    },
    moveCardToBottom (card) {
      const column = card.uid_stage
      this.moveCard(card.uid, column, this.getNewMaxCardsOrderAtColumn(column))
    },
    clickMoveAllColumnCards (column) {
      this.showMoveAllCards = true
      this.selectedColumn = column
    },
    onChangeCardPosition (position) {
      this.showMoveCard = false
      const data = {
        cards: [{ uid: this.currentCard.uid, order: this.getNewMaxCardsOrderAtColumn(position.stageUid) }],
        boardTo: position.boardUid,
        stageTo: position.stageUid
      }
      this.$store.dispatch(CARD.MOVE_ALL_CARDS, data).then(res => {
        if (this.boardUid !== position.boardUid) {
          this.closeProperties()
          this.$store.state.cards.selectedCardUid = null
        }
      })
    },
    onChangeColumnBoard (position) {
      this.showChangeColumnBoard = false
      const data = {
        stageUid: this.selectedColumn.UID,
        stage: this.selectedColumn,
        boardTo: position.boardUid,
        boardUid: this.boardUid
      }
      const cards = this.getColumnCards(this.selectedColumn).map(card => {
        return {
          uid: card.uid
        }
      })
      this.$store.dispatch(BOARD.CHANGE_STAGE_BOARD, data).then((resp) => {
        const lastStage = resp.data.stages[resp.data.stages.length - 1].UID
        this.$store.dispatch(CARD.MOVE_ALL_CARDS, {
          cards: cards,
          boardTo: position.boardUid,
          stageTo: lastStage
        })
        this.$store.dispatch(CARD.BOARD_CARDS_DELETE_STAGE, data)
        this.$store.dispatch('asidePropertiesToggle', false)
      })
    },
    onChangeAllCardsPosition (position) {
      this.showMoveAllCards = false
      // расчет порядка должен по идее происходить на сервере
      // а не на нашей стороне
      let newOrder = this.getNewMaxCardsOrderAtColumn(position.stageUid) - 1
      const cards = this.getColumnCards(this.selectedColumn).map(card => {
        newOrder += 1
        return {
          uid: card.uid,
          order: newOrder
        }
      })
      if (!cards.length) return
      //
      const data = {
        cards,
        boardTo: position.boardUid,
        stageTo: position.stageUid
      }
      this.$store.dispatch(CARD.MOVE_ALL_CARDS, data)
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
    startDragCard (start) {
      this.dragCardParam = {
        change: [],
        move: {
          card: null,
          column: null,
          targetCard: null,
          targetColumn: null,
          willInsertAfter: true
        }
      }

      const fromColumnId = start.from.dataset.columnId
      const fromColumn = this.storeCards.find(
        (column) => column.UID === fromColumnId
      )
      const card = fromColumn?.cards[start.oldIndex] || null

      this.dragCardParam.move.column = fromColumn
      this.dragCardParam.move.card = card
    },
    endDragCard (end) {
      if (this.dragCardParam?.change?.length) {
        const targetColumn = this.dragCardParam.move.targetColumn
        // рассчитываем новый порядок у карточки
        let newOrder = 1
        if (this.dragCardParam.move.targetCard) {
          const targetOrder = this.dragCardParam.move.targetCard.order
          if (this.dragCardParam.move.willInsertAfter) {
            const nextCard = targetColumn.cards[end.newIndex + 1] || null
            newOrder = nextCard
              ? (nextCard.order + targetOrder) / 2
              : targetOrder + 1
          } else {
            const prevCard = targetColumn.cards[end.newIndex - 1] || null
            newOrder = prevCard
              ? (prevCard.order + targetOrder) / 2
              : targetOrder - 1
          }
        }
        // сохраняем изменение
        this.moveCard(
          this.dragCardParam.move.card.uid,
          targetColumn.UID,
          newOrder
        )
      }
      if (this.dragCardParam?.change?.length === 0 && this.dragCardParam?.move?.card) {
        this.selectCard(this.dragCardParam?.move?.card)
      }
      this.dragCardParam = null
    },
    changeDragCard (change) {
      // записываем что у нас произошли какие-то изменения
      // это вызывается до endDrag
      this.dragCardParam.change.push(change)
    },
    checkMoveDragCard ({ relatedContext, to, willInsertAfter }) {
      const targetCard = relatedContext.element || null
      const toColumnId = to.dataset.columnId
      const toColumn = this.storeCards.find(
        (column) => column.UID === toColumnId
      )
      if (!toColumn) return false
      // если мы не отменили перемещение
      // то записываем куда мы кидаем
      this.dragCardParam.move.targetColumn = toColumn
      this.dragCardParam.move.targetCard = targetCard
      this.dragCardParam.move.willInsertAfter = willInsertAfter
      return true
    },
    startDragColumn (start) {
      this.dragColumnParam = {
        move: {
          column: null
        }
      }
      //
      const columnUid = start.item.dataset.columnUid
      const column = this.storeCards.find(
        (stage) => stage.UID === columnUid
      )
      //
      this.dragColumnParam.move.column = column
    },
    endDragColumn (end) {
      if (end.oldIndex !== end.newIndex) {
        // поменялся порядок
        const column = this.dragColumnParam.move.column
        const diff = end.newIndex - end.oldIndex
        const oldOrder = column.Order
        const newOrder = oldOrder + diff
        console.log('endDragColumn', this.storeCards, oldOrder, newOrder)
        //
        this.changeColumnOrder(column.UID, newOrder)
      }
      this.dragColumnParam = null
    },
    checkMoveDragColumn ({ relatedContext }) {
      // запрещаем перемещать за задисейбленные столбцы
      const targetColumn = relatedContext.element || null
      if (!targetColumn?.CanEditStage) return false
      return true
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
