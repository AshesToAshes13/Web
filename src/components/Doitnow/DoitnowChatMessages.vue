<template>
  <div
    class="max-w-1/2 mt-2 pt-2"
    :class="task.uid_marker !== '00000000-0000-0000-0000-000000000000' ? 'bg-white p-1 mt-1 rounded-lg' : ''"
  >
    <div class="mx-auto max-w-[540px]">
      <div
        v-if="isAnswerUidNotEmpty"
        class="quote-request border-l-2 border-[#7E7E80] mt-[8px] h-[40px]"
      >
        <div class="flex flex-row items-center">
          <div class="grow w-[calc(100%-20px)]">
            <div
              class="mx-[4px]"
            >
              <p class="text-[11px] leading-[16px] overflow-hidden text-black text-ellipsis whitespace-nowrap">
                <!-- Кому отвечают -->
                {{ messageQuoteUser }}
              </p>
              <p class="text-[12px] leading-[16px] overflow-hidden text-[#9a9fa6] text-ellipsis whitespace-nowrap">
                <!-- Сообщение на которое отвечают -->
                {{ messageQuoteString }}
              </p>
            </div>
          </div>
          <div
            class="flex-none"
            @click="onAnswerMessage('')"
          >
            <svg
              class="m-[2px]"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M4.28481 4.30107C4.67082 3.90608 5.30395 3.8988 5.69893 4.28481L9.25 7.75517L12.8011 4.28481C13.1961 3.8988 13.8292 3.90608 14.2152 4.30107C14.6012 4.69605 14.5939 5.32918 14.1989 5.71519L10.6808 9.15341L14.1989 12.5916C14.5939 12.9776 14.6012 13.6108 14.2152 14.0058C13.8292 14.4007 13.1961 14.408 12.8011 14.022L9.25 10.5516L5.69893 14.022C5.30395 14.408 4.67082 14.4007 4.28481 14.0058C3.8988 13.6108 3.90608 12.9776 4.30107 12.5916L7.81925 9.15341L4.30107 5.71519C3.90608 5.32918 3.8988 4.69605 4.28481 4.30107Z"
                fill="#999999"
              />
            </svg>
          </div>
        </div>
      </div>
      <!-- input -->
      <TaskPropsInputForm
        :task="task"
        :answer="currentAnswerMessageUid"
        @readTask="readTask"
        @sendTaskMsg="sendTaskMsg"
      />
      <MessageSkeleton v-if="isTaskMessagesLoading" />
      <!-- chat -->
      <TaskPropsChatMessages
        v-else-if="taskMessages?.length"
        id="content"
        class="mt-3"
        :task="task"
        :task-messages="taskMessages"
        :current-user-uid="currentUserUid"
        :show-all-messages="true"
        :show-only-files="showOnlyFiles"
        @answerMessage="answerMessage"
        @sendTaskMsg="sendTaskMsg"
        @onPasteEvent="onPasteEvent"
        @deleteFiles="deleteFiles"
        @deleteTaskMsg="deleteTaskMsg"
        @readTask="readTask"
      />
    </div>
  </div>
</template>
<script>
import TaskPropsInputForm from '@/components/Doitnow/TaskPropsInputForm.vue'
import MessageSkeleton from '../TaskProperties/MessageSkeleton.vue'
import TaskPropsChatMessages from '@/components/TaskProperties/TaskPropsChatMessages.vue'

export default {
  components: {
    TaskPropsChatMessages,
    MessageSkeleton,
    TaskPropsInputForm
  },
  props: {
    task: {
      type: Object,
      default: () => {}
    },
    currentAnswerMessageUid: {
      type: String,
      default: ''
    },
    isTaskMessagesLoading: {
      type: Boolean,
      default: false
    },
    taskMessages: {
      type: Array,
      default: () => ([])
    },
    messageQuoteUser: {
      type: String,
      default: ''
    },
    messageQuoteString: {
      type: String,
      default: ''
    },
    currentUserUid: {
      type: String,
      default: ''
    },
    showOnlyFiles: {
      type: Boolean,
      default: false
    }
  },
  emits: ['answerMessage', 'sendTaskMsg', 'onPasteEvent', 'deleteFiles', 'deleteTaskMsg', 'readTask'],
  computed: {
    isAnswerUidNotEmpty () {
      return this.currentAnswerMessageUid !== ''
    }
  },
  methods: {
    answerMessage (uid) {
      this.$emit('answerMessage', uid)
    },
    sendTaskMsg (msg) {
      this.$emit('sendTaskMsg', msg)
    },
    onPasteEvent (event) {
      this.$emit('onPasteEvent', event)
    },
    deleteFiles (uid) {
      this.$emit('deleteFiles', uid)
    },
    deleteTaskMsg (uid) {
      this.$emit('deleteTaskMsg', uid)
    },
    readTask () {
      this.$emit('readTask')
    }
  }
}
</script>
