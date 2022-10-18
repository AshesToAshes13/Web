<template>
  <div class="h-screen overflow-hidden">
    <div class="gap-[10px] font-roboto text-[16px] font-medium text-[#4C4C4D] text-center mt-3">
      <span>Доска: {{ boardName }}</span>
    </div>
    <div class="w-full h-[calc(100%-46px)] flex flex-col">
      <div class="mt-5 h-full min-h-0">
        <PublicBoard
          :store-cards="storeCards"
          :board="currentBoard"
          :show-archive="showArchive"
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
  props: {
    showArchive: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      showAddBoard: false,
      showBoardsLimit: false
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
      this.$store.dispatch(BOARD.GET_BOARD_REQUEST, this.boardUid).then((res) => {
        this.$store.state.cards.currentBoard = res
        this.$store.dispatch(CARD.PUBLIC_BOARD_CARDS_REQUEST, this.boardUid)
      })
    }
  }
}
</script>

<style scoped></style>
