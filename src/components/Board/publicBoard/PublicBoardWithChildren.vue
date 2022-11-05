<template>
  <div class="h-screen overflow-hidden mx-[20px]">
    <div class="gap-[10px] font-roboto text-[16px] font-medium text-[#4C4C4D] text-center mt-3">
      <div
        v-if="boardName"
      >
        <span>Доска: {{ boardName }}</span>
      </div>
      <div
        v-else-if="!boardName && !isLoading"
      >
        <h1 class="text-3xl text-gray-600 font-bold mb-5">
          Нет доступа к доске
        </h1>
      </div>
    </div>
    <div
      v-if="showEmptyMessage === true"
      class="gap-[10px] flex justify-center font-roboto text-[40px] mt-[350px] font-medium text-[#4C4C4D] text-center"
    >
      <span class="bg-white rounded-[12px] px-[50px] py-[30px]">
        В этой доске еще нет контента.
      </span>
    </div>
    <div
      v-if="showEmptyMessage === false"
      class="w-full h-[calc(100%-46px)] flex flex-col"
    >
      <div class="mt-5 h-full min-h-0">
        <PublicBoard
          :store-cards="storeCards"
          :board="currentBoard"
        />
      </div>
    </div>
  </div>
</template>

<script>
import PublicBoard from '@/components/Board/publicBoard/PublicBoard.vue'
import * as BOARD from '@/store/actions/boards'
import * as CARD from '@/store/actions/cards'

export default {
  components: {
    PublicBoard
  },
  data () {
    return {
      showEmptyMessage: false,
      isLoading: false
    }
  },
  computed: {
    storeCards () {
      return this.$store.state.cards.cards
    },
    boardUid () {
      return this.$route.params.board_id
    },
    boardName () {
      return this.$store.state.cards.currentBoard?.data?.name
    },
    currentBoard () {
      return this.$store.state.boards.boards[this.boardUid]
    }
  },
  watch: {
    boardUid (newUid) {
      if (newUid) {
        this.loadBoard()
      }
    }
  },
  mounted () {
    this.loadBoard()
  },
  methods: {
    loadBoard () {
      this.showEmptyMessage = false
      this.isLoading = true
      this.$store.dispatch(BOARD.GET_BOARD_REQUEST, this.boardUid).then((res) => {
        if (res.data.stages.length === 0) {
          this.showEmptyMessage = true
        }
        this.isLoading = false
        this.$store.state.cards.currentBoard = res
        this.$store.dispatch(CARD.PUBLIC_BOARD_CARDS_REQUEST, this.boardUid)
      })
        .catch(() => {
          this.isLoading = false
          console.log('Ошибка: Нет доступа к доске')
        })
    }
  }
}
</script>

<style scoped></style>
