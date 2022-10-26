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
      <!-- звоночек) -->
      <CardAndClientChatCallMessage
        v-if="message.type === 'call'"
        :message="message"
      />
      <!-- New creator -->
      <div
        v-if="message.uid_card"
        class="flex flex-row text-[#7E7E80] text-[13px] font-[500] leading-[15px] tracking-wide mb-[6px]"
        :class="{ 'justify-start': !isMyMessage(message), 'justify-end': isMyMessage(message) }"
      >
        <svg
          class="mr-[5px]"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M2.33333 2.5H13C13.7353 2.5 14.3333 3.098 14.3333 3.83333V11.8333C14.3333 12.5687 13.7353 13.1667 13 13.1667H2.33333C1.598 13.1667 1 12.5687 1 11.8333V3.83333C1 3.098 1.598 2.5 2.33333 2.5ZM2.33333 3.83333V11.8333H13.0007L13 3.83333H2.33333ZM7.33335 7.17188H4.00002C3.91161 7.17188 3.82683 7.13676 3.76432 7.07424C3.70181 7.01173 3.66669 6.92695 3.66669 6.83854V5.50521C3.66669 5.4168 3.70181 5.33202 3.76432 5.26951C3.82683 5.20699 3.91161 5.17188 4.00002 5.17188H7.33335C7.42176 5.17188 7.50654 5.20699 7.56906 5.26951C7.63157 5.33202 7.66669 5.4168 7.66669 5.50521V6.83854C7.66669 6.92695 7.63157 7.01173 7.56906 7.07424C7.50654 7.13676 7.42176 7.17188 7.33335 7.17188ZM7.66669 9.17188H3.66669V10.5059H7.66669V9.17188ZM11.6667 9.17188H8.33335V10.5059H11.6667V9.17188Z"
            fill="#747476"
          />
        </svg>
        <div>
          {{ getCardName(message.uid_card) }}
        </div>
      </div>
      <div
        v-if="isChangedCreator(index) && employees[message.uid_creator]"
        class="text-[#7E7E80] text-[13px] font-[500] leading-[15px] tracking-wide mb-[6px]"
        :class="{ 'text-left': !isMyMessage(message), 'text-right': isMyMessage(message) }"
      >
        <span class="w-[300px] overflow-hidden h-[15px] inline-block text-ellipsis whitespace-nowrap">
          {{ employees[message.uid_creator].name }}
        </span>
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
import CardAndClientChatCallMessage from '@/components/CardProperties/CardAndClientChatCallMessage.vue'

export default {
  components: {
    ClientChatInterlocutorMessage,
    ClientChatInterlocutorFileMessage,
    ClientChatSelfMessage,
    ClientChatQuoteMessage,
    ClientChatSelfFileMessage,
    CardAndClientChatCallMessage
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
    cards () { return this.$store.state.clientfilesandmessages.cards.cards },
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
    getCardName (uidCard) {
      let cardName
      for (let i = 0; i < this.cards.length; i++) {
        if (this.cards[i].uid === uidCard) {
          cardName = this.cards[i].name
        }
      }
      return cardName
    },
    isMessageIncludesIntegrationLogin (msg) {
      if (msg?.emailSender) {
        return msg.emailSender.includes(this.corpYandexIntegration?.login) || msg.emailSender.includes(this.personalYandexIntegration?.login)
      }
      return false
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
    }
  }
}
</script>
