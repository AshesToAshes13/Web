<template>
  <NavBar
    id="NavBarBoards"
    title="Доски"
    route="/board"
    :breadcrumbs="breadcrumbs"
  >
    <div
      v-if="onlineUsers?.length"
      class="flex -space-x-1.5"
    >
      <div
        v-for="user in onlineUsers"
        :key="user"
        class="w-[32px] h-[32px] p-[1px] bg-blue-300 rounded-full"
      >
        <img
          :title="user.name"
          class="w-[30px] h-[30px] rounded-full"
          :alt="user.name"
          :src="user.fotolink"
        >
      </div>
    </div>
    <NavBarSearch
      @change="onSearch"
    />
    <NavBarButtonsBoard
      v-if="boardUid"
      :board-uid="boardUid"
      @popNavBar="popNavBar"
    />
  </NavBar>
</template>

<script>
import NavBarButtonsBoard from '@/components/Navbar/NavBarButtonsBoard.vue'
import NavBarSearch from '@/components/Navbar/NavBarSearch.vue'
import NavBar from '@/components/Navbar/NavBar.vue'

import * as BOARD from '@/store/actions/boards'

export default {
  components: {
    NavBarButtonsBoard,
    NavBarSearch,
    NavBar
  },
  props: {
    boardUid: {
      type: String,
      default: ''
    },
    boardTitle: {
      type: String,
      default: ''
    }
  },
  computed: {
    employees () {
      return this.$store.state.employees.employees
    },
    onlineUsers () {
      const currentUserUid = this.$store.state.user.user.current_user_uid
      const onlineUsers = Object.values(this.employees).filter(emp => emp.onlineBoardUid === this.boardUid && emp.uid !== currentUserUid)
      onlineUsers.push(this.employees[currentUserUid])
      return onlineUsers
    },
    boards () {
      return this.$store.state.boards.boards
    },
    breadcrumbs () {
      let board = this.boards[this.boardUid]
      if (!board) return [{ name: 'Доска не найдена', selected: true }]

      const arrResult = [
        { name: board.name, selected: true } // на самого себя нажать нельзя по этому не добавляем to
      ]

      board = this.boards[board.uid_parent]
      while (board) {
        arrResult.unshift({ name: board.name, to: `/board/${board.uid}`, showNext: true })
        board = this.boards[board.uid_parent]
      }

      return arrResult
    }
  },
  methods: {
    popNavBar () {
      const prevIndex = this.breadcrumbs.length - 2
      const to = prevIndex >= 0 ? this.breadcrumbs[prevIndex].to : null
      this.$router.push(to || '/board')
    },
    onSearch (text) {
      this.$store.commit(BOARD.SHOW_SEARCH_CARDS, text)
    }
  }
}
</script>
