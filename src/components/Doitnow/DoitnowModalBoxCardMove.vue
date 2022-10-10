<template>
  <ModalBox
    :title="title"
    ok="Переместить"
    @ok="onSave"
    @cancel="onCancel"
  >
    <div class="w-full overflow-y-auto max-h-[440px] scroll-style">
      <div class="ml-[4px] mb-[8px]">
        Доска:
      </div>
      <div
        class="grow flex flex-col mb-3"
        @click="boardsOpenedToggle"
      >
        <div
          class="flex items-center w-full rounded-[6px] bg-[#f4f5f7] border border-black/12 px-[14px] py-[11px]"
        >
          <div class="flex-1 text-[#4c4c4d] text-[14px] leading-[16px] font-medium font-roboto">
            {{ selectedBoardName }}
          </div>
          <div
            class="flex-none"
          >
            <svg
              v-if="boardsOpened"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M10.7603 8.43901C11.0027 8.19332 11.0001 7.7976 10.7544 7.55514L6.7011 3.55514C6.47139 3.32846 6.10687 3.31394 5.85986 3.52164L1.46875 7.21394C1.20456 7.43609 1.17047 7.83035 1.39262 8.09454C1.61477 8.35874 2.00903 8.39282 2.27322 8.17067L6.22845 4.84488L9.87642 8.44486C10.1221 8.68731 10.5178 8.68469 10.7603 8.43901Z"
                fill="#7e7e80"
              />
            </svg>
            <svg
              v-else
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M10.7603 3.56099C11.0027 3.80668 11.0001 4.2024 10.7544 4.44486L6.7011 8.44486C6.47139 8.67154 6.10687 8.68606 5.85986 8.47836L1.46875 4.78606C1.20456 4.56391 1.17047 4.16965 1.39262 3.90546C1.61477 3.64126 2.00903 3.60718 2.27322 3.82933L6.22845 7.15512L9.87642 3.55514C10.1221 3.31269 10.5178 3.31531 10.7603 3.56099Z"
                fill="#7e7e80"
              />
            </svg>
          </div>
        </div>
        <div
          v-if="boardsOpened"
          class="flex flex-col w-full gap-[9px] -mt-px bg-white border rounded-[6px] border-black/12 px-[16px] py-[14px]"
        >
          <div
            v-if="favoriteBoards.length"
          >
            Избранные доски:
          </div>
          <div
            v-for="board in favoriteBoards"
            :key="board.uid"
            class="cursor-pointer text-[#4c4c4d] hover:text-[#ebaa40] text-[14px] leading-[16px]"
            :style="{ 'margin-left': `${board.pad * 16}px` }"
            @click="selectBoard(board.uid)"
          >
            {{ board.name }} {{ board.uid === boardUid ? '(текущая)' : '' }}
          </div>
          <div
            v-if="myBoards.length"
            class="mt-2"
          >
            Мои доски:
          </div>
          <div
            v-for="board in myBoards"
            :key="board.uid"
            class="cursor-pointer text-[#4c4c4d] hover:text-[#ebaa40] text-[14px] leading-[16px]"
            :style="{ 'margin-left': `${board.pad * 16}px` }"
            @click="selectBoard(board.uid)"
          >
            {{ board.name }} {{ board.uid === boardUid ? '(текущая)' : '' }}
          </div>
          <div
            v-if="commonBoards.length"
            class="mt-2"
          >
            Общие доски:
          </div>
          <div
            v-for="board in commonBoards"
            :key="board.uid"
            class="cursor-pointer text-[#4c4c4d] hover:text-[#ebaa40] text-[14px] leading-[16px]"
            :style="{ 'margin-left': `${board.pad * 16}px` }"
            @click="selectBoard(board.uid)"
          >
            {{ board.name }}
          </div>
        </div>
      </div>

      <div class="ml-[4px] mb-[8px]">
        Колонка:
      </div>
      <div
        class="grow flex flex-col"
        @click="stagesOpenedToggle"
      >
        <div
          class="flex items-center w-full rounded-[6px] bg-[#f4f5f7] border border-black/12 px-[14px] py-[11px]"
        >
          <div class="flex-1 text-[#4c4c4d] text-[14px] leading-[16px] font-medium font-roboto">
            {{ selectedStageName }}
          </div>
          <div
            class="flex-none"
          >
            <svg
              v-if="stagesOpened"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M10.7603 8.43901C11.0027 8.19332 11.0001 7.7976 10.7544 7.55514L6.7011 3.55514C6.47139 3.32846 6.10687 3.31394 5.85986 3.52164L1.46875 7.21394C1.20456 7.43609 1.17047 7.83035 1.39262 8.09454C1.61477 8.35874 2.00903 8.39282 2.27322 8.17067L6.22845 4.84488L9.87642 8.44486C10.1221 8.68731 10.5178 8.68469 10.7603 8.43901Z"
                fill="#7e7e80"
              />
            </svg>
            <svg
              v-else
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M10.7603 3.56099C11.0027 3.80668 11.0001 4.2024 10.7544 4.44486L6.7011 8.44486C6.47139 8.67154 6.10687 8.68606 5.85986 8.47836L1.46875 4.78606C1.20456 4.56391 1.17047 4.16965 1.39262 3.90546C1.61477 3.64126 2.00903 3.60718 2.27322 3.82933L6.22845 7.15512L9.87642 3.55514C10.1221 3.31269 10.5178 3.31531 10.7603 3.56099Z"
                fill="#7e7e80"
              />
            </svg>
          </div>
        </div>
        <div
          v-if="stagesOpened"
          class="flex flex-col w-full gap-[9px] -mt-px bg-white border rounded-[6px] border-black/12 px-[16px] py-[14px]"
        >
          <div
            v-for="(stage, index) in selectedBoardStages"
            :key="stage.UID"
            class="cursor-pointer text-[#4c4c4d] hover:text-[#ebaa40] text-[14px] leading-[16px]"
            @click="selectStage(stage.UID)"
          >
            {{ index + 1 }} - {{ stage.Name }} {{ stage.UID === stageUid ? '(текущая)' : '' }}
          </div>
        </div>
      </div>
    </div>
  </ModalBox>
</template>

<script>
import ModalBox from '@/components/modals/ModalBox.vue'

export default {
  components: {
    ModalBox
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'Переместить карточку'
    },
    boardUid: {
      type: String,
      default: ''
    },
    stageUid: {
      type: String,
      default: ''
    }
  },
  emits: ['changePosition', 'cancel'],
  data: () => ({
    selectedStageUid: '',
    selectedBoardUid: '',
    boardsOpened: false,
    stagesOpened: false
  }),
  computed: {
    user () {
      return this.$store.state.user.user
    },
    boards () {
      return this.$store.state.boards.boards
    },
    boardsCanEdit () {
      const currentUserUid = this.user.current_user_uid
      return Object.values(this.$store.state.boards.boards).filter(
        item => item.members[currentUserUid] === 1 || item.members[currentUserUid] === 2
      )
    },
    myBoards () {
      const currentUserEmail = this.user.current_user_email.toLowerCase()
      const arrMyBoards = this.boardsCanEdit.filter(board => board.email_creator.toLowerCase() === currentUserEmail)
      arrMyBoards.sort((board1, board2) => {
        let compare = board1.order - board2.order
        if (compare === 0) compare = board1.name.localeCompare(board2.name)
        return compare
      })
      const result = []
      this.buildTree(result, arrMyBoards, '00000000-0000-0000-0000-000000000000', 0)
      // сортируем остатки - чтобы без родителя были сверху
      arrMyBoards.sort((board1, board2) => {
        const board1HasParent = arrMyBoards.findIndex(board => board.uid === board1.uid_parent) === -1 ? 0 : 1
        const board2HasParent = arrMyBoards.findIndex(board => board.uid === board2.uid_parent) === -1 ? 0 : 1
        return board1HasParent - board2HasParent
      })
      this.buildTree(result, arrMyBoards, null, 0)
      return result
    },
    favoriteBoards () {
      const arr = []
      const boards = this.$store.state.boards.boards
      Object.keys(boards).forEach(key => {
        if (boards[key].favorite === 1) {
          arr.push(boards[key])
        }
      })
      return arr.sort((board1, board2) => { return board1.name.localeCompare(board2.name) })
    },
    commonBoards () {
      const arrCommonBoards = this.boardsCanEdit.filter(board => board.members[this.user.current_user_uid] !== 0)
      arrCommonBoards.sort((board1, board2) => {
        return board1.name.localeCompare(board2.name)
      })
      const result = []
      this.buildTree(result, arrCommonBoards, '00000000-0000-0000-0000-000000000000', 0)
      // сортируем остатки - чтобы без родителя были сверху
      arrCommonBoards.sort((board1, board2) => {
        const board1HasParent = arrCommonBoards.findIndex(board => board.uid === board1.uid_parent) === -1 ? 0 : 1
        const board2HasParent = arrCommonBoards.findIndex(board => board.uid === board2.uid_parent) === -1 ? 0 : 1
        return board1HasParent - board2HasParent
      })
      this.buildTree(result, arrCommonBoards, null, 0)
      return result
    },
    selectedBoardName () {
      const selectedBoard = this.boards[this.selectedBoardUid]
      if (selectedBoard) return selectedBoard.name
      return 'Выберете доску'
    },
    selectedStageName () {
      const selectedBoard = this.boards[this.selectedBoardUid]
      if (selectedBoard) {
        const selectedStage = selectedBoard.stages.find(stage => stage.UID === this.selectedStageUid)
        if (selectedStage) return selectedStage.Name
      }
      return 'Выберете колонку'
    },
    selectedBoardStages () {
      const selectedBoard = this.boards[this.selectedBoardUid]
      if (selectedBoard) return selectedBoard.stages
      return []
    }
  },
  watch: {
    show: {
      immediate: true,
      handler: function (val) {
        if (val) {
          this.stagesOpened = false
          this.boardsOpened = false
          this.selectedStageUid = this.stageUid
          this.selectedBoardUid = this.boardUid
        }
      }
    }
  },
  methods: {
    onCancel () {
      this.$emit('cancel')
    },
    onSave () {
      if (this.selectedStageUid === this.stageUid &&
          this.selectedBoardUid === this.boardUid) {
        // ничего не поменялось - выходим
        this.onCancel()
        return
      }
      if (!this.selectedBoardUid || !this.selectedStageUid) {
        // не выбрали доску или колонку - выходим
        this.onCancel()
        return
      }
      this.$emit('changePosition', { boardUid: this.selectedBoardUid, stageUid: this.selectedStageUid })
    },
    stagesOpenedToggle () {
      this.stagesOpened = !this.stagesOpened
    },
    boardsOpenedToggle () {
      this.boardsOpened = !this.boardsOpened
    },
    selectBoard (boardUid) {
      if (this.selectedBoardUid === boardUid) return
      this.selectedBoardUid = boardUid
      this.selectedStageUid = this.selectedBoardStages[0]?.UID ?? ''
      this.stagesOpened = false
    },
    selectStage (stageUid) {
      if (this.selectedStageUid === stageUid) return
      this.selectedStageUid = stageUid
    },
    buildTree (arrOut, arrIn, uidParent, treePos) {
      let index = uidParent ? arrIn.findIndex(board => board.uid_parent === uidParent) : arrIn.findIndex(board => true)
      while (index !== -1) {
        const board = arrIn[index]
        const sortedBoard = { uid: board.uid, name: board.name, pad: treePos }
        arrOut.push(sortedBoard)
        arrIn.splice(index, 1)
        this.buildTree(arrOut, arrIn, sortedBoard.uid, treePos + 1)
        index = uidParent ? arrIn.findIndex(board => board.uid_parent === uidParent) : arrIn.findIndex(board => true)
      }
    }
  }
}
</script>

<style scoped></style>
