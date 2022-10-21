<template>
  <div class="flex flex-col pb-[100px]">
    <div
      v-for="(message, index) in clientMessages"
      :key="message"
    >
      <div
        v-if="isChangedDate(index)"
        class="text-[#88888A] text-[11px] font-[400] leading-[13px] tracking-wide my-[15px] text-center"
      >
        {{ getMessageWeekDateString(message.date_create) }}
      </div>

      <span
        v-if="message.type === 'call'"
        class="flex py-[10px] px-[15px] rounded-t-[12px] mb-[5px] max-w-[300px] text-[#4C4C4D] text-[14px]"
        :class="{'float-left rounded-br-[12px] bg-[#FCEBEB]': message.direction === 'in', 'float-right rounded-bl-[12px] bg-[#F4F5F7]': message.direction === 'out'}"
      >
        <a
          :href="message.link"
          target="_blank"
          class="flex items-center justify-center"
          :class="{'hover:underline': message.link !== null}"
        >
          <svg
            v-if="message.direction === 'in' && message.status === 'Success'"
            xmlns="http://www.w3.org/2000/svg"
            class="mr-2"
            width="12"
            height="12"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511zM15.854.146a.5.5 0 0 1 0 .708L11.707 5H14.5a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5v-4a.5.5 0 0 1 1 0v2.793L15.146.146a.5.5 0 0 1 .708 0z"
            />
          </svg>
          <svg
            v-else-if="message.direction === 'out' && message.status === 'Success'"
            xmlns="http://www.w3.org/2000/svg"
            class="mr-2"
            width="12"
            height="12"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511zM11 .5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V1.707l-4.146 4.147a.5.5 0 0 1-.708-.708L14.293 1H11.5a.5.5 0 0 1-.5-.5z"
            />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="mr-2"
            width="12"
            height="12"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511zm9.261 1.135a.5.5 0 0 1 .708 0L13 2.793l1.146-1.147a.5.5 0 0 1 .708.708L13.707 3.5l1.147 1.146a.5.5 0 0 1-.708.708L13 4.207l-1.146 1.147a.5.5 0 0 1-.708-.708L12.293 3.5l-1.147-1.146a.5.5 0 0 1 0-.708z"
            />
          </svg>
          <span>{{ getCallText(message) }}</span>
        </a>
        <p
          style="color: rgba(0, 0, 0, 0.4);"
          class="text-right font-[700] ml-[8px] leading-[14px] text-[11px] self-end min-w-[30px]"
        >
          {{ getMessageTimeString(message.date_create) }}
        </p>
      </span>
      <!-- New creator -->
      <div
        v-if="isChangedCreator(index) && employees[message.uid_creator]"
        class="text-[#7E7E80] text-[13px] font-[500] leading-[15px] tracking-wide mb-[6px]"
        :class="{ 'text-left': !isMyMessage(message), 'text-right': isMyMessage(message) }"
      >
        <span class="w-[300px] overflow-hidden h-[15px] inline-block text-ellipsis whitespace-nowrap">
          {{ employees[message.uid_creator].name }}
        </span>
      </div>
      <div
        v-if="message.emailSender"
        class="text-[#7E7E80] text-[13px] font-[500] leading-[15px] tracking-wide mb-[6px]"
        :class="{ 'text-left': !isMessageIncludesIntegrationLogin(message), 'text-right': isMessageIncludesIntegrationLogin(message) }"
      >
        <span class="w-[300px] overflow-hidden h-[15px] inline-block text-ellipsis whitespace-nowrap">{{ message.emailSender }}</span>
      </div>

      <ClientChatQuoteMessage
        v-if="message.hasQuote"
        :quote-message-uid="message.uid_quote"
      />
      <ClientChatInterlocutorMessage
        v-if="!message.isMyMessage && message.isMessage && !showFilesOnly"
        :message="message"
        :should-show-options="shouldShowOptions(message)"
        :employee="employees[message.uid_creator]"
        @onQuoteMessage="setCurrentQuote"
      />
      <ClientChatInterlocutorFileMessage
        v-if="!message.isMyMessage && message.isFile"
        :message="message"
        :employee="employees[message.uid_creator]"
        @onQuoteMessage="setCurrentQuote"
      />

      <ClientChatSelfMessage
        v-if="message.isMyMessage && message.isMessage && !showFilesOnly"
        :message="message"
        :employee="employees[message.uid_creator]"
        :should-show-options="shouldShowOptions(message)"
        @onDeleteMessage="onDeleteMessage"
        @onQuoteMessage="setCurrentQuote"
      />
      <ClientChatSelfFileMessage
        v-if="message.isMyMessage && message.isFile"
        :message="message"
        :employee="employees[message.uid_creator]"
        @onQuoteMessage="setCurrentQuote"
        @onDeleteFile="deleteFile"
      />
    </div>
  </div>
</template>

<script>
import * as CLIENTS_CHAT from '@/store/actions/clientfilesandmessages.js'
import ClientChatQuoteMessage from '@/components/Clients/ClientChatQuoteMessage.vue'
import ClientChatInterlocutorMessage from '@/components/Clients/ClientChatInterlocutorMessage.vue'
import ClientChatInterlocutorFileMessage from '@/components/Clients/ClientChatInterlocutorFileMessage.vue'
import ClientChatSelfMessage from '@/components/Clients/ClientChatSelfMessage.vue'
import ClientChatSelfFileMessage from '@/components/Clients/ClientChatSelfFileMessage.vue'

export default {
  components: {
    ClientChatInterlocutorMessage,
    ClientChatInterlocutorFileMessage,
    ClientChatSelfMessage,
    ClientChatQuoteMessage,
    ClientChatSelfFileMessage
  },
  props: {
    key: {
      type: String,
      default: ''
    },
    messages: {
      type: Array,
      default: () => []
    },
    currentUserUid: {
      type: String,
      default: ''
    },
    employees: {
      type: Object,
      default: () => {}
    },
    showFilesOnly: {
      type: Boolean,
      default: false
    }
  },
  emits: ['onQuote', 'onDeleteMessage', 'onDeleteFile'],
  computed: {
    clientMessages () {
      return this.messages.map((message) => ({
        ...message,
        isFile: !!message.uid_file,
        isMessage: !message.uid_file && message.uid_creator !== 'inspector' && message.type !== 'call',
        hasQuote: message.uid_quote && message.uid_quote !== '00000000-0000-0000-0000-000000000000' && message.deleted !== 1,
        quoteMessage: this.getMessageByUid(message?.uid_quote),
        isInspectorMessage: message.uid_creator === 'inspector',
        isMyMessage: (message?.uid_creator === this.currentUserUid) || this.isMessageIncludesIntegrationLogin(message)
      }))
    },
    cardsMessages () {
      return this.messages.filter((message) => message.uid_creator === 'inspector')
    },
    user () {
      return this.$store.state.user.user
    },
    corpYandexIntegration () {
      return this.$store.state.corpYandexIntegration
    },
    personalYandexIntegration () {
      return this.$store.state.personalYandexIntegration
    }
  },
  methods: {
    onDeleteMessage (msgUid) {
      this.$store.dispatch(CLIENTS_CHAT.DELETE_MESSAGE_REQUEST, msgUid)
    },
    isMessageIncludesIntegrationLogin (msg) {
      if (msg?.emailSender) {
        return msg.emailSender.includes(this.corpYandexIntegration?.login) || msg.emailSender.includes(this.personalYandexIntegration?.login)
      }
      return false
    },
    getMessageTimeString (dateCreate) {
      if (!dateCreate) return ''
      // добавляем Z в конец, чтобы он посчитал что это UTC время
      if (dateCreate[dateCreate.length - 1] !== 'Z') {
        dateCreate += 'Z'
      }
      const date = new Date(dateCreate)
      return date.toLocaleString('default', {
        hour: 'numeric',
        minute: 'numeric'
      })
    },
    getMessageByUid (uid) {
      for (const message of this.messages) {
        if (message?.uid === uid) return message
      }
      return false
    },
    isMyMessage (msg) {
      return msg.uid_creator === this.currentUserUid
    },
    shouldShowOptions (msg) {
      return !msg.isYandex
    },
    isChangedDate (index) {
      if (index === 0) return true
      const messagePrev = this.messages[index - 1]
      const messageCurr = this.messages[index]
      if (!messagePrev || !messageCurr) return false
      return new Date(messagePrev.date_create).toDateString() !==
        new Date(messageCurr.date_create).toDateString()
    },
    isChangedCreator (index) {
      if (index === 0) return true
      const messagePrev = this.messages[index - 1]
      const messageCurr = this.messages[index]
      if (!messagePrev || !messageCurr) return false
      return messagePrev.uid_creator !== messageCurr.uid_creator
    },
    setCurrentQuote (quoteMessage) {
      this.$emit('onQuote', quoteMessage)
    },
    deleteMessage (uid) {
      this.$emit('onDeleteMessage', uid)
    },
    deleteFile (uid) {
      this.$emit('onDeleteFile', uid)
    },
    getMessageWeekDateString (dateCreate) {
      if (!dateCreate) return ''
      // добавляем Z в конец, чтобы он посчитал что это UTC время
      if (dateCreate[dateCreate.length - 1] !== 'Z') {
        dateCreate += 'Z'
      }
      const today = new Date()
      const date = new Date(dateCreate)
      let weekDay = date.toLocaleString('default', { weekday: 'long' })
      weekDay = weekDay.slice(0, 1).toUpperCase() + weekDay.slice(1)
      const dayNum = date.getDate()
      const day = (dayNum < 10 ? '0' : '') + dayNum
      const month = date.toLocaleString('default', { month: 'short' }).slice(0, 3)
      const year = (today.getFullYear() !== date.getFullYear()) ? date.getFullYear().toString() : ''
      return `${weekDay}, ${day} ${month} ${year}`
    },
    getCallText (message) {
      const minutes = Math.floor(message.duration / 60)
      const seconds = (message.duration % 60).toString().padStart(2, '0')
      return (message.direction === 'in' ? 'Звонок от клиента' : `Звонок от ${message.user}`) + ` (${minutes}:${seconds})`
    }
  }
}
</script>
