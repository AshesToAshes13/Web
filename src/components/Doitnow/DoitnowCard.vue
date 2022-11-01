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
          :budget="cardBudget"
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
        <DoitnowBadge
          v-if="clientName"
          icon="contact"
        >
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
    <div class="mt-[65px]">
      <div>
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
        @next="nextTask"
      />
      <DoitnowRightButton
        title="Дальше"
        icon="next"
        @click="nextTask"
      />
      <DoitnowRightButtonContact
        v-if="canEdit"
        :title="contactButtonTitle"
        @changeContact="onChangeClient"
      />
      <DoitnowRightButton
        v-if="showCallButton"
        title="Позвонить"
        icon="call"
        @click="onCallClient"
      />
      <DoitnowRightButton
        v-if="canEdit"
        title="Архивировать: успех"
        icon="archive"
        @click="onSetSuccess"
      />
      <DoitnowRightButton
        v-if="canEdit"
        title="Архивировать: отказ"
        icon="archive"
        @click="onSetReject"
      />
      <DoitnowRightButton
        v-if="canEdit"
        title="Установить бюджет"
        icon="budget"
        @click="clickCardBudget"
      />
      <DoitnowRightButton
        v-if="canEdit"
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
import DoitnowCardChat from '@/components/Doitnow/DoitnowCard/DoitnowCardChat'
import DoitnowModalBoxBudget from '@/components/Doitnow/modals/DoitnowModalBoxBudget.vue'
import DoitnowModalBoxCardMove from '@/components/Doitnow/modals/DoitnowModalBoxCardMove.vue'
import contenteditable from 'vue-contenteditable'
import linkify from 'vue-linkify'
import { CREATE_FILES_REQUEST, FETCH_FILES_AND_MESSAGES } from '@/store/actions/cardfilesandmessages'
import { CHANGE_CARD_COMMENT, CHANGE_CARD_UID_CLIENT, CHANGE_CARD_BUDGET } from '@/store/actions/cards'
import { CHANGE_TASK_UID_BOARD_AND_STAGE, CHANGE_TASK_COST } from '@/store/actions/tasks'
import { REFRESH_MESSAGES } from '@/store/actions/taskmessages'
import { REFRESH_FILES } from '@/store/actions/taskfiles'
import { CARD_STAGE } from '@/constants'
import DoitnowBadge from '@/components/Doitnow/DoitnowBadge'
import * as CLIENT_FILES_AND_MESSAGES from '@/store/actions/clientfilesandmessages'
import * as CLIENTS from '@/store/actions/clients'
import { stripPhoneNumber } from '@/helpers/functions'
import * as CORP_MEGAFON from '@/store/actions/integrations/corpoMegafonInt'

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
      showChangeCardBudget: false,
      showMoveCard: false,
      clientInCard: null
    }
  },
  computed: {
    user () {
      const userEmail = this.card?.user?.toLowerCase() || ''
      return this.$store.state.employees.employeesByEmail[userEmail]
    },
    showCallButton () {
      return this.clientPhone && this.$store.getters.isMegafonCanCall
    },
    clientPhone () {
      return this.clientInCard?.phone || ''
    },
    clientName () {
      return this.clientInCard?.name || ''
    },
    contactButtonTitle () {
      if (this.clientName) {
        return 'Изменить контакт'
      }
      return 'Установить контакт'
    },
    clientEmail () {
      return this.clientInCard?.email || ''
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
      if (this.isClientInCard) {
        return [
          ...this.$store.state.cardfilesandmessages.messages,
          ...this.$store.state.clientfilesandmessages.messages
        ].reverse()
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
    },
    isClientInCard () {
      return this.clientUid !== '00000000-0000-0000-0000-000000000000' && this.clientUid
    }
  },
  mounted () {
    this.$store.commit(REFRESH_MESSAGES)
    this.$store.commit(REFRESH_FILES)
    this.$store.dispatch(FETCH_FILES_AND_MESSAGES, this.card.uid)
    this.loadClientData()
  },
  methods: {
    loadClientData () {
      this.$store.commit(CLIENT_FILES_AND_MESSAGES.REFRESH_MESSAGES)
      this.$store.commit(CLIENT_FILES_AND_MESSAGES.REFRESH_FILES)
      if (this.isClientInCard) {
        this.$store.dispatch(CLIENTS.GET_CLIENT, this.clientUid).then((resp) => {
          this.clientInCard = resp?.data || null
          this.$store.state.cards.clientInCard = resp.data || null
          if (this.clientInCard?.uid) {
            console.log('load contact', this.clientInCard)
            const data = {
              clientUid: this.clientInCard.uid,
              clientEmail: this.clientInCard.email,
              clientPhone: this.clientInCard.phone,
              crmKey: this.$store.state.corpMegafonIntegration.crmKey,
              corpYandexInt: this.$store.state.corpYandexIntegration.isIntegrated,
              personalYandexInt: this.$store.state.personalYandexIntegration.isIntegrated,
              megafonIntegration: this.$store.state.corpMegafonIntegration.isIntegrated
            }
            this.$store.dispatch(CLIENT_FILES_AND_MESSAGES.FETCH_FILES_AND_MESSAGES, data)
          }
        }).catch((err) => {
          this.clientInCard = null
          throw err
        })
      } else {
        this.clientInCard = null
      }
    },
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
      this.nextTask()
    },
    nextTask () {
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
    onChangeClient (contact) {
      this.clientUid = contact?.uid || ''
      this.clientInCard = contact
      this.$store.dispatch(
        CHANGE_CARD_UID_CLIENT, {
          ...this.card,
          uid_client: this.clientUid,
          client_name: this.clientName
        })
      this.loadClientData()
    },
    onCallClient () {
      const phone = stripPhoneNumber(this.clientPhone)
      this.$store.dispatch(CORP_MEGAFON.CALL_CLIENT, phone)
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
      this.nextTask()
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
