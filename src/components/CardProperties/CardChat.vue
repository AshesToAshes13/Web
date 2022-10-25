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
      <div
        v-if="message?.emailSender"
        class="text-[#7E7E80] text-[13px] font-[500] flex flex-row leading-[15px] tracking-wide mb-[6px]"
      >
        <span>
          <svg
            class="ml-auto mr-[7px]"
            width="12"
            height="13"
            viewBox="0 0 12 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.4141 10.4312C11.1194 9.73308 10.6916 9.09891 10.1547 8.56406C9.61947 8.02767 8.9854 7.60001 8.28754 7.30469C8.28129 7.30156 8.27504 7.3 8.26879 7.29688C9.24223 6.59375 9.87504 5.44844 9.87504 4.15625C9.87504 2.01562 8.14066 0.28125 6.00004 0.28125C3.85941 0.28125 2.12504 2.01562 2.12504 4.15625C2.12504 5.44844 2.75785 6.59375 3.73129 7.29844C3.72504 7.30156 3.71879 7.30312 3.71254 7.30625C3.01254 7.60156 2.38441 8.025 1.84535 8.56563C1.30896 9.10089 0.881296 9.73495 0.585977 10.4328C0.295855 11.116 0.139386 11.8485 0.125039 12.5906C0.124622 12.6073 0.127547 12.6239 0.133642 12.6394C0.139737 12.6549 0.148878 12.6691 0.160527 12.681C0.172176 12.693 0.186098 12.7025 0.201471 12.7089C0.216844 12.7154 0.233358 12.7188 0.250039 12.7188H1.18754C1.25629 12.7188 1.31098 12.6641 1.31254 12.5969C1.34379 11.3906 1.82816 10.2609 2.68441 9.40469C3.57035 8.51875 4.74691 8.03125 6.00004 8.03125C7.25316 8.03125 8.42973 8.51875 9.31566 9.40469C10.1719 10.2609 10.6563 11.3906 10.6875 12.5969C10.6891 12.6656 10.7438 12.7188 10.8125 12.7188H11.75C11.7667 12.7188 11.7832 12.7154 11.7986 12.7089C11.814 12.7025 11.8279 12.693 11.8396 12.681C11.8512 12.6691 11.8603 12.6549 11.8664 12.6394C11.8725 12.6239 11.8755 12.6073 11.875 12.5906C11.8594 11.8437 11.7047 11.1172 11.4141 10.4312V10.4312ZM6.00004 6.84375C5.28285 6.84375 4.60785 6.56406 4.10004 6.05625C3.59223 5.54844 3.31254 4.87344 3.31254 4.15625C3.31254 3.43906 3.59223 2.76406 4.10004 2.25625C4.60785 1.74844 5.28285 1.46875 6.00004 1.46875C6.71723 1.46875 7.39223 1.74844 7.90004 2.25625C8.40785 2.76406 8.68754 3.43906 8.68754 4.15625C8.68754 4.87344 8.40785 5.54844 7.90004 6.05625C7.39223 6.56406 6.71723 6.84375 6.00004 6.84375Z"
              fill="#747476"
            />
          </svg>
        </span>
        <span class="w-auto overflow-hidden h-[15px] inline-block text-ellipsis whitespace-nowrap">
          {{ cardName && cardName + ' | ' }}
          <span>{{ selectedCard.client_name }}</span>
        </span>
      </div>
      <CardMailMessage
        v-if="message?.emailSender"
        :message="message"
        :time="getMessageTimeString(message.date_create)"
        class="py-[10px] px-[15px] rounded-t-[12px] rounded-br-[12px] mb-[5px] float-left max-w-[300px] group bg-[#FCEBEB]"
      />
      <!-- звоночек) -->
      <div
        v-if="message.type === 'call'"
        class="text-[#7E7E80] text-[13px] font-[500] flex flex-row leading-[15px] tracking-wide mb-[6px]"
        :class="{ 'justify-start': message.direction === 'in', 'justify-end': message.direction === 'out' }"
      >
        <span>
          <svg
            class="ml-auto mr-[7px]"
            width="12"
            height="13"
            viewBox="0 0 12 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.4141 10.4312C11.1194 9.73308 10.6916 9.09891 10.1547 8.56406C9.61947 8.02767 8.9854 7.60001 8.28754 7.30469C8.28129 7.30156 8.27504 7.3 8.26879 7.29688C9.24223 6.59375 9.87504 5.44844 9.87504 4.15625C9.87504 2.01562 8.14066 0.28125 6.00004 0.28125C3.85941 0.28125 2.12504 2.01562 2.12504 4.15625C2.12504 5.44844 2.75785 6.59375 3.73129 7.29844C3.72504 7.30156 3.71879 7.30312 3.71254 7.30625C3.01254 7.60156 2.38441 8.025 1.84535 8.56563C1.30896 9.10089 0.881296 9.73495 0.585977 10.4328C0.295855 11.116 0.139386 11.8485 0.125039 12.5906C0.124622 12.6073 0.127547 12.6239 0.133642 12.6394C0.139737 12.6549 0.148878 12.6691 0.160527 12.681C0.172176 12.693 0.186098 12.7025 0.201471 12.7089C0.216844 12.7154 0.233358 12.7188 0.250039 12.7188H1.18754C1.25629 12.7188 1.31098 12.6641 1.31254 12.5969C1.34379 11.3906 1.82816 10.2609 2.68441 9.40469C3.57035 8.51875 4.74691 8.03125 6.00004 8.03125C7.25316 8.03125 8.42973 8.51875 9.31566 9.40469C10.1719 10.2609 10.6563 11.3906 10.6875 12.5969C10.6891 12.6656 10.7438 12.7188 10.8125 12.7188H11.75C11.7667 12.7188 11.7832 12.7154 11.7986 12.7089C11.814 12.7025 11.8279 12.693 11.8396 12.681C11.8512 12.6691 11.8603 12.6549 11.8664 12.6394C11.8725 12.6239 11.8755 12.6073 11.875 12.5906C11.8594 11.8437 11.7047 11.1172 11.4141 10.4312V10.4312ZM6.00004 6.84375C5.28285 6.84375 4.60785 6.56406 4.10004 6.05625C3.59223 5.54844 3.31254 4.87344 3.31254 4.15625C3.31254 3.43906 3.59223 2.76406 4.10004 2.25625C4.60785 1.74844 5.28285 1.46875 6.00004 1.46875C6.71723 1.46875 7.39223 1.74844 7.90004 2.25625C8.40785 2.76406 8.68754 3.43906 8.68754 4.15625C8.68754 4.87344 8.40785 5.54844 7.90004 6.05625C7.39223 6.56406 6.71723 6.84375 6.00004 6.84375Z"
              fill="#747476"
            />
          </svg>
        </span>
        <span class="w-auto overflow-hidden h-[15px] inline-block text-ellipsis whitespace-nowrap">
          {{ cardName && cardName + ' | ' }}
          <span>{{ selectedCard.client_name }}</span>
        </span>
      </div>
      <CardAndClientChatCallMessage
        v-if="message.type === 'call'"
        :message="message"
      />
      <!-- New creator -->
      <div
        v-if="employees[message.uid_creator]"
        class="text-[#7E7E80] text-[13px] font-[500] flex flex-row leading-[15px] tracking-wide mb-[6px]"
        :class="{ 'justify-start': !message.isMyMessage, 'justify-end': message.isMyMessage }"
      >
        <span>
          <svg
            v-if="message.uid_client"
            class="ml-auto mr-[7px]"
            width="12"
            height="13"
            viewBox="0 0 12 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.4141 10.4312C11.1194 9.73308 10.6916 9.09891 10.1547 8.56406C9.61947 8.02767 8.9854 7.60001 8.28754 7.30469C8.28129 7.30156 8.27504 7.3 8.26879 7.29688C9.24223 6.59375 9.87504 5.44844 9.87504 4.15625C9.87504 2.01562 8.14066 0.28125 6.00004 0.28125C3.85941 0.28125 2.12504 2.01562 2.12504 4.15625C2.12504 5.44844 2.75785 6.59375 3.73129 7.29844C3.72504 7.30156 3.71879 7.30312 3.71254 7.30625C3.01254 7.60156 2.38441 8.025 1.84535 8.56563C1.30896 9.10089 0.881296 9.73495 0.585977 10.4328C0.295855 11.116 0.139386 11.8485 0.125039 12.5906C0.124622 12.6073 0.127547 12.6239 0.133642 12.6394C0.139737 12.6549 0.148878 12.6691 0.160527 12.681C0.172176 12.693 0.186098 12.7025 0.201471 12.7089C0.216844 12.7154 0.233358 12.7188 0.250039 12.7188H1.18754C1.25629 12.7188 1.31098 12.6641 1.31254 12.5969C1.34379 11.3906 1.82816 10.2609 2.68441 9.40469C3.57035 8.51875 4.74691 8.03125 6.00004 8.03125C7.25316 8.03125 8.42973 8.51875 9.31566 9.40469C10.1719 10.2609 10.6563 11.3906 10.6875 12.5969C10.6891 12.6656 10.7438 12.7188 10.8125 12.7188H11.75C11.7667 12.7188 11.7832 12.7154 11.7986 12.7089C11.814 12.7025 11.8279 12.693 11.8396 12.681C11.8512 12.6691 11.8603 12.6549 11.8664 12.6394C11.8725 12.6239 11.8755 12.6073 11.875 12.5906C11.8594 11.8437 11.7047 11.1172 11.4141 10.4312V10.4312ZM6.00004 6.84375C5.28285 6.84375 4.60785 6.56406 4.10004 6.05625C3.59223 5.54844 3.31254 4.87344 3.31254 4.15625C3.31254 3.43906 3.59223 2.76406 4.10004 2.25625C4.60785 1.74844 5.28285 1.46875 6.00004 1.46875C6.71723 1.46875 7.39223 1.74844 7.90004 2.25625C8.40785 2.76406 8.68754 3.43906 8.68754 4.15625C8.68754 4.87344 8.40785 5.54844 7.90004 6.05625C7.39223 6.56406 6.71723 6.84375 6.00004 6.84375Z"
              fill="#747476"
            />
          </svg>
        </span>
        <span class="w-auto overflow-hidden h-[15px] inline-block text-ellipsis whitespace-nowrap">
          {{ cardName && cardName + ' | ' }}
          <span
            class="mr-[10px]"
          >
            {{ message.uid_client ? selectedCard.client_name : '' }}
          </span>
          <span
            v-if="isChangedCreator(index)"
            class="text-[#4C4C4D]"
          >
            {{ employees[message.uid_creator].name }}
          </span>
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
import CardMailMessage from './CardMailMessage.vue'

export default {
  components: {
    CardChatInterlocutorMessage,
    CardChatInterlocutorFileMessage,
    CardChatSelfMessage,
    CardChatSelfFileMessage,
    CardChatQuoteMessage,
    CardAndClientChatCallMessage,
    CardMailMessage
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
    selectedCard () { return this.$store.getters.selectedCard },
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
    deleteClientMessage (uid) {
      this.$emit('deleteClientMessage', uid)
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
