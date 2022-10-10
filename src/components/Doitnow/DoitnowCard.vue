<template>
  <DoitnowContent>
    <div class="flex flex-col gap-[20px] overflow-x-hidden">
      <contenteditable
        v-model="title"
        v-linkify:options="{ className: 'text-blue-600 mx-[5px]', tagName: 'a' }"
        tag="div"
        class="ring-0 outline-none font-bold text-[18px] text-[#424242] break-words"
        style="word-break: break-word"
        :contenteditable="false"
        placeholder="Введите название карточки"
        :no-nl="false"
        :no-html="false"
      />
      <DoitnowPropsColumn class="empty:hidden">
        <DoitnowPropsColumnUser
          v-if="card?.user"
          key-title="Ответственный:"
          :value-email="card?.user"
        />
        <DoitnowPropsColumnItem
          v-if="remind"
          key-title="Дата:"
          :value-text="remind"
        />
        <DoitnowPropsColumnItem
          v-if="cardBudget"
          key-title="Бюджет:"
          :value-text="cardBudget"
        >
          <svg
            width="17"
            height="12"
            viewBox="0 0 17 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M2.57405 1.55572C2.37759 1.55572 2.18918 1.63376 2.05027 1.77268C1.91135 1.9116 1.83331 2.10001 1.83331 2.29646V9.70387C1.83331 9.90033 1.91135 10.0887 2.05027 10.2277C2.18918 10.3666 2.37759 10.4446 2.57405 10.4446H14.4259C14.6224 10.4446 14.8108 10.3666 14.9497 10.2277C15.0886 10.0887 15.1666 9.90033 15.1666 9.70387V2.29646C15.1666 2.10001 15.0886 1.9116 14.9497 1.77268C14.8108 1.63376 14.6224 1.55572 14.4259 1.55572H2.57405ZM1.0027 0.725114C1.41945 0.308366 1.98468 0.0742402 2.57405 0.0742402H14.4259C15.0153 0.0742402 15.5805 0.308367 15.9973 0.725114C16.414 1.14186 16.6481 1.70709 16.6481 2.29646V9.70387C16.6481 10.2932 16.414 10.8585 15.9973 11.2752C15.5805 11.692 15.0153 11.9261 14.4259 11.9261H2.57405C1.98468 11.9261 1.41945 11.692 1.0027 11.2752C0.585955 10.8585 0.351828 10.2932 0.351828 9.70387V2.29646C0.351828 1.70709 0.585954 1.14186 1.0027 0.725114Z"
              fill="black"
              fill-opacity="0.5"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M8.49998 4.51869C7.68178 4.51869 7.0185 5.18197 7.0185 6.00017C7.0185 6.81837 7.68178 7.48165 8.49998 7.48165C9.31818 7.48165 9.98146 6.81837 9.98146 6.00017C9.98146 5.18197 9.31818 4.51869 8.49998 4.51869ZM5.53701 6.00017C5.53701 4.36377 6.86358 3.0372 8.49998 3.0372C10.1364 3.0372 11.4629 4.36377 11.4629 6.00017C11.4629 7.63657 10.1364 8.96313 8.49998 8.96313C6.86358 8.96313 5.53701 7.63657 5.53701 6.00017Z"
              fill="black"
              fill-opacity="0.5"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M4.339 0.130626C4.6158 0.245279 4.79627 0.515379 4.79627 0.814981C4.79627 1.79726 4.40606 2.73932 3.71148 3.4339C3.0169 4.12847 2.07485 4.51868 1.09257 4.51868C0.792967 4.51868 0.522866 4.33821 0.408214 4.06141C0.293561 3.78462 0.356936 3.46601 0.568786 3.25416L3.53175 0.291198C3.7436 0.079348 4.06221 0.0159733 4.339 0.130626ZM15.9074 8.96313C15.318 8.96313 14.7528 9.19726 14.336 9.614C13.9193 10.0308 13.6852 10.596 13.6852 11.1854C13.6852 11.5945 13.3535 11.9261 12.9444 11.9261C12.5353 11.9261 12.2037 11.5945 12.2037 11.1854C12.2037 10.2031 12.5939 9.26102 13.2885 8.56644C13.9831 7.87186 14.9251 7.48165 15.9074 7.48165C16.3165 7.48165 16.6481 7.81329 16.6481 8.22239C16.6481 8.63149 16.3165 8.96313 15.9074 8.96313Z"
              fill="black"
              fill-opacity="0.5"
            />
          </svg>
        </DoitnowPropsColumnItem>
        <DoitnowPropsColumnItem
          v-if="currentBoard?.name"
          key-title="Доска:"
          :value-text="currentBoard?.name"
        />
        <DoitnowPropsColumnItem
          v-if="currentStageName"
          key-title="Колонка:"
          :value-text="currentStageName"
        />
        <DoitnowPropsColumnItem
          v-if="clientName"
          key-title="Контакт:"
        >
          <template #value>
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
          </template>
        </DoitnowPropsColumnItem>
      </DoitnowPropsColumn>
      <TaskPropsCommentEditor
        text-style="!text-[16px] leading-[155%]"
        style="word-break: break-word"
        :comment="comment"
        :can-edit="canEdit"
        @changeComment="changeComment"
        @onPasteFile="onPasteEvent"
      />
    </div>
    <div class="border-t mt-4">
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
    <template #buttons>
      <DoitnowRightButtonPostpone
        @postpone="onPostpone"
      />
      <DoitnowRightButton
        title="Пропустить"
        icon="next"
        @click="onPostpone()"
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
import DoitnowPropsColumn from '@/components/Doitnow/DoitnowPropsColumn.vue'
import DoitnowPropsColumnItem from '@/components/Doitnow/DoitnowPropsColumnItem.vue'
import DoitnowPropsColumnUser from '@/components/Doitnow/DoitnowPropsColumnUser.vue'
import DoitnowCardChat from '@/components/Doitnow/DoitnowCardChat'
import DoitnowRightButtonBudget from '@/components/Doitnow/DoitnowRightButtonBudget.vue'
import DoitnowModalBoxBudget from '@/components/Doitnow/DoitnowModalBoxBudget.vue'
import contenteditable from 'vue-contenteditable'
import linkify from 'vue-linkify'
import { CREATE_FILES_REQUEST, FETCH_FILES_AND_MESSAGES } from '@/store/actions/cardfilesandmessages'
import { CHANGE_CARD_COMMENT, CHANGE_CARD_UID_CLIENT, CHANGE_CARD_BUDGET } from '@/store/actions/cards'
import { REFRESH_MESSAGES } from '@/store/actions/taskmessages'
import { REFRESH_FILES } from '@/store/actions/taskfiles'
import { CARD_STAGE } from '@/constants'
import { CHANGE_TASK_COST } from '@/store/actions/tasks'

export default {
  components: {
    DoitnowCardChat,
    DoitnowRightButtonPostpone,
    DoitnowRightButtonContact,
    TaskPropsCommentEditor,
    DoitnowRightButton,
    DoitnowPropsColumn,
    DoitnowPropsColumnItem,
    DoitnowPropsColumnUser,
    DoitnowContent,
    contenteditable,
    DoitnowRightButtonBudget,
    DoitnowModalBoxBudget
  },
  directives: {
    linkify
  },
  props: {
    card: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['next'],
  data () {
    return {
      title: this.card.name || '',
      comment: this.card.comment || '',
      clientUid: this.card.uid_client || '',
      clientName: this.card.client_name || '',
      showChangeCardBudget: false
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
      return currentStage.Name
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
    }
  }
}
</script>

<style scoped>
</style>
