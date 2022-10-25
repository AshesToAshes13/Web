<template>
  <nav class="flex items-center justify-between pt-[15px] mb-[15px]">
    <NavBar
      :title="'Архив: ' + boardName"
    />
    <div class="font-roboto text-[16px] font-medium text-[#4C4C4D]" />
    <div class="flex items-center gap-[10px]">
      <router-link
        :to="`/board/${boardUid}`"
      >
        <BoardSmallButton
          class="flex items-center px-[10px] py-[5px]"
          icon="back"
        >
          Назад
        </BoardSmallButton>
      </router-link>
      <NavBarSearch @change="onSearch" />
      <PopMenu>
        <NavBarButtonIcon
          icon="filter"
          :colored="isFilterSet"
        />
        <template #menu>
          <PopMenuItem
            :icon="showOnlyCardsWhereIAmResponsible ? 'check' : 'uncheck'"
            @click="clickBoardMyCards"
          >
            Ответственный я
          </PopMenuItem>
          <PopMenuItem
            :icon="showOnlyCardsWithNoResponsible ? 'check' : 'uncheck'"
            @click="clickBoardNoResponsibleCards"
          >
            Нет ответственного
          </PopMenuItem>
          <PopMenuItem
            :icon="showOnlyMyCreatedCards ? 'check' : 'uncheck'"
            @click="clickBoardMyCardsCreated"
          >
            Создатель я
          </PopMenuItem>
          <PopMenuDivider
            v-if="isFilterSet"
          />
          <PopMenuItem
            v-if="isFilterSet"
            icon="uncheck"
            @click="clickBoardFilterClear"
          >
            Сбросить
          </PopMenuItem>
        </template>
      </PopMenu>
    </div>
  </nav>
</template>

<script>
import PopMenu from '@/components/Common/PopMenu'
import NavBarButtonIcon from '@/components/Navbar/NavBarButtonIcon'
import PopMenuItem from '@/components/Common/PopMenuItem'
import * as BOARD from '@/store/actions/boards'
import PopMenuDivider from '@/components/Common/PopMenuDivider'
import BoardSmallButton from '@/components/Board/buttons/BoardSmallButton'
import NavBarSearch from '@/components/Navbar/NavBarSearch'
import NavBar from '@/components/Navbar/NavBar.vue'

export default {
  components: { NavBarSearch, BoardSmallButton, PopMenuDivider, PopMenuItem, NavBarButtonIcon, PopMenu, NavBar },
  props: {
    boardUid: {
      type: String,
      default: ''
    },
    boardName: {
      type: String,
      default: ''
    }
  },
  computed: {
    showOnlyCardsWhereIAmResponsible () {
      return this.$store.state.boards.showOnlyCardsWhereIAmResponsible
    },
    showOnlyCardsWithNoResponsible () {
      return this.$store.state.boards.showOnlyCardsWithNoResponsible
    },
    showOnlyMyCreatedCards () {
      return this.$store.state.boards.showOnlyMyCreatedCards
    },
    isFilterSet () {
      return this.showOnlyMyCreatedCards || this.showOnlyCardsWhereIAmResponsible || this.showOnlyCardsWithNoResponsible
    }
  },
  methods: {
    clickBoardMyCards () {
      this.$store.commit(BOARD.SHOW_BOARD_MY_CARDS_WHERE_IAM_RESPONSIBLE, !this.showOnlyCardsWhereIAmResponsible)
      this.$store.commit(BOARD.SHOW_BOARD_CARDS_WITH_NO_RESPONSIBLE, false)
      this.$store.commit(BOARD.SHOW_BOARD_MY_CREATED_CARDS, false)
    },
    clickBoardNoResponsibleCards () {
      this.$store.commit(BOARD.SHOW_BOARD_MY_CARDS_WHERE_IAM_RESPONSIBLE, false)
      this.$store.commit(BOARD.SHOW_BOARD_CARDS_WITH_NO_RESPONSIBLE, !this.showOnlyCardsWithNoResponsible)
      this.$store.commit(BOARD.SHOW_BOARD_MY_CREATED_CARDS, false)
    },
    clickBoardMyCardsCreated () {
      this.$store.commit(BOARD.SHOW_BOARD_MY_CARDS_WHERE_IAM_RESPONSIBLE, false)
      this.$store.commit(BOARD.SHOW_BOARD_CARDS_WITH_NO_RESPONSIBLE, false)
      this.$store.commit(BOARD.SHOW_BOARD_MY_CREATED_CARDS, !this.showOnlyMyCreatedCards)
    },
    clickBoardFilterClear () {
      this.$store.commit(BOARD.BOARD_CLEAR_FILTER)
    },
    onSearch (text) {
      this.$store.commit(BOARD.SHOW_SEARCH_CARDS, text)
    }
  }
}
</script>
