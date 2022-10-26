<template>
  <div
    class="flex flex-col"
  >
    <div class="text-center flex flex-row justify-end w-full my-3">
      <svg
        width="16"
        height="17"
        viewBox="0 0 16 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M2.33333 3H13C13.7353 3 14.3333 3.598 14.3333 4.33333V12.3333C14.3333 13.0687 13.7353 13.6667 13 13.6667H2.33333C1.598 13.6667 1 13.0687 1 12.3333V4.33333C1 3.598 1.598 3 2.33333 3ZM2.33333 4.33333V12.3333H13.0007L13 4.33333H2.33333ZM7.33335 7.67188H4.00002C3.91161 7.67188 3.82683 7.63676 3.76432 7.57424C3.70181 7.51173 3.66669 7.42695 3.66669 7.33854V6.00521C3.66669 5.9168 3.70181 5.83202 3.76432 5.76951C3.82683 5.70699 3.91161 5.67188 4.00002 5.67188H7.33335C7.42176 5.67188 7.50654 5.70699 7.56906 5.76951C7.63157 5.83202 7.66669 5.9168 7.66669 6.00521V7.33854C7.66669 7.42695 7.63157 7.51173 7.56906 7.57424C7.50654 7.63676 7.42176 7.67188 7.33335 7.67188ZM7.66669 9.67188H3.66669V11.0059H7.66669V9.67188ZM11.6667 9.67188H8.33335V11.0059H11.6667V9.67188Z"
          fill="#747476"
        />
      </svg>
      <span class="ml-[5px]">{{ cardName }}</span>
    </div>
    <div
      v-for="(message, index) in cardMessages"
      :key="index"
    >
      <CardChatInterlocutorMessage
        v-if="!message.isMyMessage && message.isMessage && !showFilesOnly"
        :message="message"
        :employee="employees[message.uid_creator]"
      />
      <CardChatInterlocutorFileMessage
        v-if="!message.isMyMessage && message.isFile"
        :message="message"
        :employee="employees[message.uid_creator]"
      />

      <CardChatSelfMessage
        v-if="message.isMyMessage && message.isMessage && !showFilesOnly"
        :message="message"
        :employee="employees[message.uid_creator]"
      />
      <CardChatSelfFileMessage
        v-if="message.isMyMessage && message.isFile"
        :message="message"
        :employee="employees[message.uid_creator]"
      />
    </div>
  </div>
</template>

<script>
import CardChatInterlocutorMessage from '@/components/CardProperties/CardChatInterlocutorMessage.vue'
import CardChatInterlocutorFileMessage from '@/components/CardProperties/CardChatInterlocutorFileMessage.vue'
import CardChatSelfMessage from '@/components/CardProperties/CardChatSelfMessage.vue'
import CardChatSelfFileMessage from '@/components/CardProperties/CardChatSelfFileMessage.vue'

export default {
  components: {
    CardChatInterlocutorMessage,
    CardChatInterlocutorFileMessage,
    CardChatSelfMessage,
    CardChatSelfFileMessage
  },
  props: {
    cardName: {
      type: String,
      default: ''
    },
    employees: {
      type: Object,
      default: () => {}
    },
    messages: {
      type: Array,
      default: () => []
    },
    currentUserUid: {
      type: String,
      default: ''
    }
  },
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
    }
  },
  methods: {
    getMessageByUid (uid) {
      for (const message of this.messages) {
        if (message.uid === uid) return message
      }
      return false
    }
  }
}
</script>
