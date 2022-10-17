<template>
  <BoardModalBoxBoardsLimit
    v-if="showBoardsLimit"
    @cancel="showBoardsLimit = false"
    @ok="showBoardsLimit = false"
  />
  <div class="px-[20px] py-[22px]">
    <AsideMenuListSkeleton v-if="status == 'loading'" />
    <div
      v-if="status == 'success'"
      class="flex flex-col gap-[25px]"
    >
      <BoardsSubmenuGroup
        v-if="favoriteBoards.length"
        title="Избранные доски"
        :boards="favoriteBoards"
        @goto="closeMenu"
      />

      <BoardsSubmenuGroup
        v-for="dep in depBoards"
        :key="dep.uid"
        :title="dep.title"
        :boards="dep.boards"
        @goto="closeMenu"
      />

      <BoardsSubmenuGroup
        title="Мои доски"
        :boards="privateBoards"
        @goto="closeMenu"
      >
        <AsideMenuListInput
          v-if="showAddBoard"
          :show="showAddBoard"
          @cancel="showAddBoard = false"
          @save="onAddNewBoard"
        >
          <svg
            class="flex-none"
            width="30"
            height="30"
            viewBox="0 0 30 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M6.5 24.9694C5.67347 24.9694 5 24.3061 5 23.4898V8.85714C5 8.04082 5.67347 7.37755 6.5 7.37755H10.102V6.32653C10.102 5.96939 10.3878 5.68367 10.7449 5.68367H12.7347L12.7857 5.55102C13.1122 4.62245 14.0102 4 15 4C15.9898 4 16.8878 4.62245 17.2143 5.55102L17.2653 5.68367H19.2551C19.6122 5.68367 19.898 5.96939 19.898 6.32653V7.37755H23.5C24.3265 7.37755 25 8.04082 25 8.85714V23.4898C25 24.3061 24.3265 24.9694 23.5 24.9694H6.5ZM6.29592 23.6939H23.7143V8.65306H19.898V9.70408C19.898 10.0612 19.6122 10.3469 19.2551 10.3469H10.7449C10.3878 10.3469 10.102 10.0612 10.102 9.70408V8.65306H6.29592V23.6939ZM11.398 9.06122H18.6122V6.96939H16.7041C16.3469 6.96939 16.0612 6.68367 16.0612 6.32653C16.0612 5.7449 15.5918 5.27551 15.0102 5.27551C14.4286 5.27551 13.949 5.7449 13.949 6.32653C13.949 6.68367 13.6633 6.96939 13.3061 6.96939H11.398V9.06122Z"
              fill="currentColor"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M8 14.75C8 14.3358 8.33579 14 8.75 14H11.25C11.6642 14 12 14.3358 12 14.75C12 15.1642 11.6642 15.5 11.25 15.5H8.75C8.33579 15.5 8 15.1642 8 14.75ZM13 14.75C13 14.3358 13.3358 14 13.75 14H16.25C16.6642 14 17 14.3358 17 14.75C17 15.1642 16.6642 15.5 16.25 15.5H13.75C13.3358 15.5 13 15.1642 13 14.75ZM18.75 14C18.3358 14 18 14.3358 18 14.75C18 15.1642 18.3358 15.5 18.75 15.5H21.25C21.6642 15.5 22 15.1642 22 14.75C22 14.3358 21.6642 14 21.25 14H18.75Z"
              fill="currentColor"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M8 19.75C8 19.3358 8.33579 19 8.75 19H11.25C11.6642 19 12 19.3358 12 19.75C12 20.1642 11.6642 20.5 11.25 20.5H8.75C8.33579 20.5 8 20.1642 8 19.75ZM13 19.75C13 19.3358 13.3358 19 13.75 19H16.25C16.6642 19 17 19.3358 17 19.75C17 20.1642 16.6642 20.5 16.25 20.5H13.75C13.3358 20.5 13 20.1642 13 19.75ZM18.75 19C18.3358 19 18 19.3358 18 19.75C18 20.1642 18.3358 20.5 18.75 20.5H21.25C21.6642 20.5 22 20.1642 22 19.75C22 19.3358 21.6642 19 21.25 19H18.75Z"
              fill="currentColor"
            />
          </svg>
        </AsideMenuListInput>
        <AsideMenuListAdd
          v-else
          class="mt-[6px]"
          title="Добавить доску"
          @click.stop="clickAddBoard"
        />
      </BoardsSubmenuGroup>

      <BoardsSubmenuGroup
        v-if="commonBoards.length"
        title="Общие доски"
        :boards="commonBoards"
        @goto="closeMenu"
      />
    </div>
  </div>
</template>

<script>
import BoardModalBoxBoardsLimit from '@/components/Board/modalboxes/BoardModalBoxBoardsLimit.vue'
import AsideMenuListAdd from '@/components/AsideMenu/AsideMenuListAdd.vue'
import AsideMenuListInput from '@/components/AsideMenu/AsideMenuListInput.vue'
import BoardsSubmenuGroup from '@/components/AsideMenu/BoardsSubmenuGroup.vue'
import AsideMenuListSkeleton from '@/components/AsideMenu/AsideMenuListSkeleton.vue'

import * as BOARD from '@/store/actions/boards'
import * as NAVIGATOR from '@/store/actions/navigator'

export default {
  components: {
    BoardModalBoxBoardsLimit,
    BoardsSubmenuGroup,
    AsideMenuListAdd,
    AsideMenuListInput,
    AsideMenuListSkeleton
  },
  data () {
    return {
      showAddBoard: false,
      showBoardsLimit: false
    }
  },
  computed: {
    status () {
      return this.$store.state.navigator.status
    },
    storeNavigator () {
      return this.$store.state.navigator.navigator
    },
    user () {
      return this.$store.state.user.user
    },
    employees () {
      return this.$store.state.employees.employees
    },
    isPropertiesMobileExpanded () {
      return this.$store.state.isPropertiesMobileExpanded
    },
    isAsideMobileExpanded () {
      return this.$store.state.isAsideMobileExpanded
    },
    favoriteBoards () {
      const boards = Object.values(this.$store.state.boards.boards)
      const arrFavBoards = boards.filter(board => board.favorite === 1)
      arrFavBoards.sort((board1, board2) => { return board1.name.localeCompare(board2.name) })
      return arrFavBoards
    },
    privateBoards () {
      const boards = this.storeNavigator?.new_private_boards[0]?.items ?? []
      return boards.filter(board => this.depBoardsMap[board.uid] === undefined)
    },
    commonBoards () {
      const boards = this.storeNavigator?.new_private_boards[1]?.items ?? []
      return boards.filter(board => this.depBoardsMap[board.uid] === undefined)
    },
    depBoardsMap () {
      return this.depBoards.reduce((acc, dep) => {
        dep.boards.forEach(board => {
          acc[board.uid] = dep
        })
        return acc
      }, {})
    },
    depBoards () {
      const boards = Object.values(this.$store.state.boards.boards)
      const depsMap = boards.reduce((acc, board) => {
        Object.keys(board.deps).forEach(depUid => {
          if (acc[depUid] === undefined) acc[depUid] = []
          acc[depUid].push(board)
        })
        return acc
      }, {})
      const allDeps = this.$store.getters.sortedDepartments
      return allDeps.reduce((acc, dep) => {
        if (depsMap[dep.uid] && dep.name) {
          const depGroup = {
            uid: dep.uid,
            title: dep.name,
            boards: depsMap[dep.uid]
          }
          depGroup.boards.sort((board1, board2) => { return board1.name.localeCompare(board2.name) })
          acc.push(depGroup)
        }
        return acc
      }, [])
    }
  },
  methods: {
    clickAddBoard () {
      // если лицензия истекла
      if (Object.keys(this.$store.state.boards.boards).length >= 3 && this.$store.getters.isLicenseExpired) {
        this.showBoardsLimit = true
        return
      }
      this.showAddBoard = true
    },
    isDepBoardsAreAvalible (depUid) {
      const isDepUidInBoards = this.commonBoards.find(item => item?.deps[depUid]) !== undefined
      return this.employees[this.user.current_user_uid].uid_dep === depUid && isDepUidInBoards
    },
    onAddNewBoard (name) {
      this.showAddBoard = false
      const title = name.trim()
      if (title) {
        // добавляем новую доску и переходим в неё
        const boardData = {
          name: title
        }
        this.$store.dispatch(BOARD.CREATE_BOARD_REQUEST, boardData).then((res) => {
          const board = res.data
          // заполняем недостающие параметры
          board.global_property_uid = '1b30b42c-b77e-40a4-9b43-a19991809add'
          board.color = '#A998B6'
          //
          this.$store.commit(BOARD.PUSH_BOARD, [board])
          this.$store.commit(NAVIGATOR.NAVIGATOR_PUSH_BOARD, [board])
          this.$router.push('/board/' + board.uid)
          this.closeMenu()
        })
      }
    },
    closeMenu () {
      // закрываем сабменю
      this.$store.state.navigator.submenu.status = false

      if (this.isPropertiesMobileExpanded) {
        this.$store.dispatch('asidePropertiesToggle', false)
      }
      if (this.isAsideMobileExpanded) {
        this.$store.dispatch('asideMobileToggle', false)
      }
    }
  }
}
</script>
