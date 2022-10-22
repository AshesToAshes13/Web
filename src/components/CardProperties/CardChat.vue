<template>
  <div
    class="flex flex-col"
  >
    <div
      v-for="(message, index) in cardMessages"
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
        :class="{ 'text-left': !message.isMyMessage, 'text-right': message.isMyMessage }"
      >
        <span class="w-[300px] overflow-hidden h-[15px] inline-block text-ellipsis whitespace-nowrap">
          {{ cardName && cardName + ' | ' }} {{ employees[message.uid_creator].name }}
        </span>
      </div>

      <CardChatQuoteMessage
        v-if="message.hasQuote"
        class="mb-[14px] mt-[19px]"
        :quote-message="message.quoteMessage"
        :employee="employees[message.quoteMessage.uid_creator]"
      />

      <CardChatInterlocutorMessage
        v-if="!message.isMyMessage && message.isMessage && !showFilesOnly && message.type !== 'call' && !message.emailSender"
        :message="message"
        :employee="employees[message.uid_creator]"
        @onQuoteMessage="setCurrentQuote"
      />
      <CardChatInterlocutorFileMessage
        v-if="!message.isMyMessage && message.isFile"
        :message="message"
        :employee="employees[message.uid_creator]"
        @onQuoteMessage="setCurrentQuote"
      />

      <CardChatSelfMessage
        v-if="message.isMyMessage && message.isMessage && !showFilesOnly && message.type !== 'call' && !message.emailSender"
        :message="message"
        :employee="employees[message.uid_creator]"
        @onQuoteMessage="setCurrentQuote"
        @onDeleteMessage="deleteMessage"
      />
      <CardChatSelfFileMessage
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
import CardChatInterlocutorMessage from '@/components/CardProperties/CardChatInterlocutorMessage.vue'
import CardChatInterlocutorFileMessage from '@/components/CardProperties/CardChatInterlocutorFileMessage.vue'
import CardChatSelfMessage from '@/components/CardProperties/CardChatSelfMessage.vue'
import CardChatSelfFileMessage from '@/components/CardProperties/CardChatSelfFileMessage.vue'
import CardChatQuoteMessage from '@/components/CardProperties/CardChatQuoteMessage.vue'
import CardAndClientChatCallMessage from '@/components/CardProperties/CardAndClientChatCallMessage.vue'

export default {
  components: {
    CardChatInterlocutorMessage,
    CardChatInterlocutorFileMessage,
    CardChatSelfMessage,
    CardChatSelfFileMessage,
    CardChatQuoteMessage,
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
    },
    inDoitnow: {
      type: Boolean,
      default: false
    },
    cardName: {
      type: String,
      default: ''
    }
  },
  emits: ['onQuote', 'onDeleteMessage', 'onDeleteFile'],
  computed: {
    cardMessages () {
      return this.messages.map((message) => ({
        ...message,
        isFile: !!message.uid_file,
        isMessage: !message.uid_file && message.uid_creator !== 'inspector',
        hasQuote: message.uid_quote && message.uid_quote !== '00000000-0000-0000-0000-000000000000' && message.deleted !== 1,
        quoteMessage: this.getMessageByUid(message?.uid_quote),
        isInspectorMessage: message.uid_creator === 'inspector',
        isMyMessage: message.uid_creator === this.currentUserUid
      }))
    },
    corpYandexIntegration () {
      return this.$store.state.corpYandexIntegration
    },
    personalYandexIntegration () {
      return this.$store.state.personalYandexIntegration
    }
  },
  methods: {
    getMessageByUid (uid) {
      for (const message of this.messages) {
        if (message.uid === uid) return message
      }
      return false
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
