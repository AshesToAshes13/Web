<template>
  <DoitnowContent
    :border-color="cardColor"
  >
    <div class="flex flex-col gap-[20px] overflow-x-hidden">
      <contenteditable
        v-model="title"
        v-linkify:options="{ className: 'text-blue-600 mx-[5px]', tagName: 'a' }"
        tag="div"
        class="ring-0 outline-none font-bold text-[21px] text-[#424242] break-words"
        style="word-break: break-word"
        :contenteditable="false"
        placeholder="Введите название карточки"
        :no-nl="false"
        :no-html="false"
      />
      <div class="gap-[5px] flex mb-[7px] flex-wrap">
        <DoitnowBadge
          v-if="remind"
          icon="calendar"
          :text="remind"
        />
        <DoitnowBadge
          v-if="cardBudget"
          title="Бюджет:"
          icon="budget"
          :text="cardBudget"
        />
        <DoitnowBadge
          v-if="currentBoard?.name"
          icon="board"
          :color="boardColor"
          :text="currentBoard?.name"
        />
        <DoitnowBadge
          v-if="currentStageName"
          title="Колонка:"
          :color="stageColor"
          :text="currentStageName"
        />
        <DoitnowBadge v-if="clientName">
          <svg
            width="13"
            height="14"
            viewBox="0 0 13 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.5631 7.94595C11.1349 7.56757 10.6352 7.18919 10.1356 6.96216C10.0642 6.96216 9.99287 6.88649 9.9215 6.88649C9.70737 6.88649 9.49325 7.03784 9.3505 7.26487C9.27912 7.41622 9.27912 7.64324 9.3505 7.7946C9.42187 7.94595 9.49325 8.0973 9.636 8.0973C10.0642 8.24865 10.4211 8.55135 10.778 8.85405C11.1349 9.23243 11.349 9.68649 11.349 10.2162V12.4108C11.349 12.6378 11.2062 12.7135 11.0635 12.7135H1.99887C1.78475 12.7135 1.71337 12.5622 1.71337 12.4108V10.2162C1.71337 9.68649 1.9275 9.23243 2.28437 8.85405C2.71262 8.47568 4.06875 7.49189 6.4955 7.49189C8.42262 7.49189 10.0642 5.82703 10.0642 3.78378C10.0642 1.74054 8.494 0 6.4955 0C4.56837 0 2.92675 1.66487 2.92675 3.70811C2.92675 4.76757 3.355 5.75135 4.06875 6.50811C2.64125 6.88649 1.78475 7.56757 1.42787 7.94595C0.856875 8.47568 0.5 9.30811 0.5 10.2162V12.4108C0.5 13.3189 1.21375 14 1.99887 14H10.9921C11.8486 14 12.491 13.2432 12.491 12.4108V10.2162C12.5624 9.30811 12.2055 8.47568 11.5631 7.94595ZM6.4955 6.20541C5.21075 6.20541 4.14012 5.07027 4.14012 3.70811C4.14012 2.34595 5.21075 1.21081 6.4955 1.21081C7.78025 1.21081 8.85087 2.34595 8.85087 3.70811C8.85087 5.07027 7.85162 6.20541 6.4955 6.20541Z"
              fill="#4C4C4D"
            />
          </svg>
          {{ clientName }}
          <span
            v-if="clientPhone"
            class="font-normal"
          >
            <a
              :href="`tel:${clientPhone}`"
              target="_blank"
            >
              {{ clientPhone }}
            </a>
          </span>
          <span
            v-if="clientEmail"
            class="font-normal whitespace-nowrap"
          >
            &lt;<a
              :href="`mailto:${clientEmail}`"
              target="_blank"
            >
              {{ clientEmail }}
            </a>&gt;
          </span>
        </DoitnowBadge>
      </div>
      <TaskPropsCommentEditor
        text-style="!text-[16px] leading-[155%] px-[22px] py-[12px] bg-[#f8f8fa] rounded-lg min-h-[200px]"
        style="word-break: break-word"
        :comment="comment"
        :can-edit="canEdit"
        @changeComment="changeComment"
        @onPasteFile="onPasteEvent"
      />
    </div>
    <div class="mt-4">
      <div class="max-w-[540px] mx-auto pt-[20px]">
        <DoitnowCardChat
          :card-messages="cardMessages"
          :user-uid="user.uid"
          :card-uid="card.uid"
        />
      </div>
    </div>
    <DoitnowModalBoxBudget
      v-if="showChangeCardBudget"
      :value="cardBudget"
      :show="showChangeCardBudget"
      title="Бюджет карточки"
      @cancel="showChangeCardBudget = false"
      @save="changeCardBudget"
    />
    <DoitnowModalBoxCardMove
      v-if="showMoveCard"
      :show="showMoveCard"
      :stage-uid="card.uid_stage"
      :board-uid="card.uid_board"
      @cancel="showMoveCard = false"
      @changePosition="onChangeCardPosition"
    />
    <template #buttons>
      <DoitnowRightButtonPostpone
        :is-animation-doitnow="isAnimationDoitnow"
        @postpone="onPostpone"
      />
      <DoitnowRightButtonContact
        title="Установить контакт"
        @changeContact="onChangeClient"
      />
      <DoitnowRightButton
        title="Архивировать: успех"
        icon="archive"
        @click="onSetSuccess"
      />
      <DoitnowRightButton
        title="Архивировать: отказ"
        icon="archive"
        @click="onSetReject"
      />
      <DoitnowRightButtonBudget
        :budget="card?.cost"
        :can-edit="true"
        @click="clickCardBudget"
        @onWipeBudget="changeCardBudget"
      />
      <DoitnowRightButton
        title="Переместить"
        icon="move"
        @click="onMove"
      />
    </template>
  </DoitnowContent>
</template>

<script>
import * as CARD from '@/store/actions/cards'

import TaskPropsCommentEditor from '@/components/TaskProperties/TaskPropsCommentEditor.vue'
import DoitnowContent from '@/components/Doitnow/DoitnowContent.vue'
import DoitnowRightButton from '@/components/Doitnow/DoitnowRightButton.vue'
import DoitnowRightButtonPostpone from '@/components/Doitnow/DoitnowRightButtonPostpone.vue'
import DoitnowRightButtonContact from '@/components/Doitnow/DoitnowRightButtonContact.vue'
import DoitnowCardChat from '@/components/Doitnow/DoitnowCardChat'
import DoitnowRightButtonBudget from '@/components/Doitnow/DoitnowRightButtonBudget.vue'
import DoitnowModalBoxBudget from '@/components/Doitnow/DoitnowModalBoxBudget.vue'
import DoitnowModalBoxCardMove from '@/components/Doitnow/DoitnowModalBoxCardMove.vue'
import contenteditable from 'vue-contenteditable'
import linkify from 'vue-linkify'
import { CREATE_FILES_REQUEST, FETCH_FILES_AND_MESSAGES } from '@/store/actions/cardfilesandmessages'
import { CHANGE_CARD_COMMENT, CHANGE_CARD_UID_CLIENT, CHANGE_CARD_BUDGET } from '@/store/actions/cards'
import { CHANGE_TASK_UID_BOARD_AND_STAGE, CHANGE_TASK_COST } from '@/store/actions/tasks'
import { REFRESH_MESSAGES } from '@/store/actions/taskmessages'
import { REFRESH_FILES } from '@/store/actions/taskfiles'
import { CARD_STAGE } from '@/constants'
import DoitnowBadge from '@/components/Doitnow/DoitnowBadge'

export default {
  components: {
    DoitnowBadge,
    DoitnowCardChat,
    DoitnowRightButtonPostpone,
    DoitnowRightButtonContact,
    TaskPropsCommentEditor,
    DoitnowRightButton,
    DoitnowContent,
    contenteditable,
    DoitnowRightButtonBudget,
    DoitnowModalBoxBudget,
    DoitnowModalBoxCardMove
  },
  directives: {
    linkify
  },
  props: {
    card: {
      type: Object,
      default: () => ({})
    },
    isAnimationDoitnow: {
      type: Boolean,
      default: false
    }
  },
  emits: ['next'],
  data () {
    return {
      title: this.card.name || '',
      comment: this.card.comment || '',
      clientUid: this.card.uid_client || '',
      clientName: this.card.client_name || '',
      showChangeCardBudget: false,
      showMoveCard: false
    }
  },
  computed: {
    user () {
      const userEmail = this.card?.user?.toLowerCase() || ''
      return this.$store.state.employees.employeesByEmail[userEmail]
    },
    clientPhone () {
      return ''
    },
    clientEmail () {
      return ''
    },
    remind () {
      if (!this.card?.date_reminder) return ''
      //
      const calendarDate = new Date(this.card.date_reminder)
      const day = calendarDate.getDate()
      const month = calendarDate.toLocaleString('default', { month: 'short' })
      const hours = String(calendarDate.getHours()).padStart(2, '0')
      const minutes = String(calendarDate.getMinutes()).padStart(2, '0')
      const time = hours === '00' && minutes === '00' ? '' : `${hours}:${minutes}`
      return `${day} ${month} ${time}`
    },
    currentBoard () {
      return this.$store.state.boards.boards[this.card.uid_board]
    },
    currentStageName () {
      let currentStage = null
      this.currentBoard.stages.forEach(stage => {
        if (stage.UID === this.card.uid_stage) {
          currentStage = stage
        }
      })
      return currentStage?.Name
    },
    cardBudget () {
      return this.card?.cost / 100
    },
    cardMessages () {
      if (this.card.uid_client !== '00000000-0000-0000-0000-000000000000' && this.card.uid_client) {
        return this.$store.state.clientfilesandmessages.messages.slice().reverse()
      }
      return this.$store.state.cardfilesandmessages.messages.slice().reverse()
    },
    canEdit () {
      return this.currentBoard?.type_access !== 0
    },
    cardColor () {
      return this.card?.cover_color === '#A998B6' ? '' : this.card?.cover_color
    },
    boardColor () {
      return this.$store.state.boards.boards[this.card.uid_board].color === '#A998B6' ? '' : this.$store.state.boards.boards[this.card.uid_board].color
    },
    stageColor () {
      const stages = this.$store.state.boards.boards[this.card.uid_board].stages
      for (let i = 0; i < stages.length; i++) {
        if (stages[i].UID === this.card.uid_stage && stages[i].Color !== '') {
          return stages[i].Color
        }
      }
      return ''
    }
  },
  mounted () {
    this.$store.commit(REFRESH_MESSAGES)
    this.$store.commit(REFRESH_FILES)
    this.$store.dispatch(FETCH_FILES_AND_MESSAGES, this.card.uid)
  },
  methods: {
    onPostpone (date) {
      if (date) {
        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const year = String(date.getFullYear()).padStart(4, '0')
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        const seconds = String(date.getSeconds()).padStart(2, '0')
        const selectedCard = { ...this.card }
        selectedCard.date_reminder = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
        this.$store.dispatch(CARD.CHANGE_CARD_DATE_REMINDER, selectedCard)
      }
      this.$emit('next')
    },
    changeComment (text) {
      const data = { cardUid: this.card.uid, comment: text }
      this.$store.dispatch(CHANGE_CARD_COMMENT, data)
      this.comment = text
    },
    onPasteEvent (e) {
      const items = (e.clipboardData || e.originalEvent.clipboardData).items
      for (const index in items) {
        const item = items[index]
        if (item.kind === 'file') {
          const blob = item.getAsFile()
          const formData = new FormData()
          formData.append('files', blob)
          const data = {
            uid_card: this.card.uid,
            name: formData
          }
          this.$store.dispatch(CREATE_FILES_REQUEST, data)
        }
      }
    },
    onChangeClient (payload) {
      const [uid, name] = payload
      this.clientUid = uid
      this.clientName = name
      this.$store.dispatch(
        CHANGE_CARD_UID_CLIENT, {
          ...this.card,
          uid_client: this.clientUid,
          client_name: this.clientName
        })
    },
    onSetSuccess () {
      this.setColumn(CARD_STAGE.ARCHIVE_SUCCESS)
    },
    onSetReject () {
      this.setColumn(CARD_STAGE.ARCHIVE_REJECT)
    },
    setColumn (stageTo) {
      this.$store.dispatch(CARD.MOVE_ALL_CARDS, {
        cards: [{ uid: this.card?.uid }],
        stageTo,
        boardTo: this.currentBoard?.uid
      })
      this.$emit('next')
    },
    clickCardBudget () {
      this.showChangeCardBudget = true
    },
    changeCardBudget (budget) {
      const data = { cardUid: this.card?.uid, budget: budget * 100 }
      this.$store.dispatch(CHANGE_CARD_BUDGET, data).then((resp) => {
        this.$store.commit(CHANGE_TASK_COST, resp.data.cost)
        this.showChangeCardBudget = false
      })
    },
    onMove () {
      this.showMoveCard = true
    },
    onChangeCardPosition (position) {
      this.$store.dispatch(CARD.MOVE_ALL_CARDS, {
        cards: [{ uid: this.card.uid }],
        boardTo: position.boardUid,
        stageTo: position.stageUid
      }).then((resp) => {
        this.$store.commit(CHANGE_TASK_UID_BOARD_AND_STAGE, resp.data[0])
        this.showMoveCard = false
      })
    }
  }
}
</script>
