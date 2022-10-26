<template>
  <div class="flex flex-col pb-[100px]">
    <!-- скрыл пока не готово -->
    <template v-if="false">
      <div
        v-for="(card, index) in cardMessages"
        :key="index"
      >
        <ClientCardChatMessages
          v-if="card"
          :card-name="cards[index]?.name"
          :messages="card"
          :employees="employees"
          :current-user-uid="user.current_user_uid"
        />
      </div>
    </template>
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
import ClientCardChatMessages from '@/components/Clients/ClientCardChatMessages'

export default {
  components: {
    ClientChatInterlocutorMessage,
    ClientChatInterlocutorFileMessage,
    ClientChatSelfMessage,
    ClientChatQuoteMessage,
    ClientChatSelfFileMessage,
    CardAndClientChatCallMessage,
    ClientCardChatMessages
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
    cardMessages () { return this.$store.state.clientfilesandmessages.cards.messages },
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
