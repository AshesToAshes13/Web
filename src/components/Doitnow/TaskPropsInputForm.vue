<template>
  <img
    v-if="isloading"
    src="/ajaxloader.gif"
  >
  <div class="w-full mt-[20px]">
    <CardMessageInput
      v-model="taskMsg"
      :can-add-files="true"
      @createCardMessage="sendTaskMsg"
      @createCardFile="createTaskFile($event)"
    />
  </div>
</template>

<script>
import * as FILES from '@/store/actions/taskfiles.js'
import { TASK_STATUS } from '@/constants'
import CardMessageInput from '@/components/CardProperties/CardMessageInput'

export default {
  components: { CardMessageInput },
  props: {
    task: {
      type: Object,
      default: () => ({})
    },
    answer: {
      type: String,
      default: ''
    }
  },
  emits: ['readTask', 'sendTaskMsg'],
  data: () => ({
    isloading: false,
    files: [],
    taskMsg: ''
  }),
  computed: {
    user () {
      return this.$store.state.user.user
    },
    selectedTask () {
      return this.$store.state.tasks.selectedTask
    },
    cusers () {
      return this.$store.state.user.user
    },
    taskMessagesAndFiles () {
      return this.$store.state.taskfilesandmessages.messages
    }
  },
  watch: {
    task (newval, oldval) {
      this.taskMsg = ''
    }
  },
  methods: {
    readTask () {
      this.$emit('readTask')
    },
    pad2: function (n) {
      return (n < 10 ? '0' : '') + n
    },
    _linkify: function (text) {
      return text.replace(/(lt?:\/\/[^\s]+)/g, '<a href="$1">$1</a>')
    },
    onPasteEvent: function (e) {
      const items = (e.clipboardData || e.originalEvent.clipboardData).items
      for (const index in items) {
        const item = items[index]
        if (item.kind === 'file') {
          const blob = item.getAsFile()
          const formData = new FormData()
          formData.append('files', blob)
          const data = {
            uid_task: this.task.uid,
            name: formData
          }
          this.isloading = true
          this.$store.dispatch(FILES.CREATE_FILES_REQUEST, data)
            .then((resp) => {
              this.isloading = false
              if (this.task.type === 2 || this.task.uid.type === 3) {
                if ([TASK_STATUS.TASK_COMPLETED, TASK_STATUS.TASK_READY, TASK_STATUS.TASK_CANCELLED, TASK_STATUS.TASK_REJECTED].includes(this.task.status)) {
                  this.selectedTask.status = 9
                }
              }
            })
        }
      }
    },
    sendTaskMsg (msg) {
      let msgtask = msg || this.taskMsg
      console.log('msgtask', msgtask, msg, this.taskMsg)
      msgtask = this.taskMsg.trim()
      msgtask = this.taskMsg.replaceAll('&', '&amp;')
      msgtask = this.taskMsg.replaceAll('<', '&lt;')
      msgtask = this.taskMsg.replaceAll('>', '&gt;')
      this.$emit('sendTaskMsg', msgtask)
    },
    createTaskFile (event) {
      this.files = event.target.files ? event.target.files : event.dataTransfer.files
      const formData = new FormData()
      for (let i = 0; i < this.files.length; i++) {
        const file = this.files[i]
        formData.append('files[' + i + ']', file)
      }
      const data = {
        uid_task: this.task.uid,
        name: formData
      }

      for (const formItem of formData) {
        this.$store.commit(
          'createLoadingFile',
          {
            msg: formItem[1].name,
            uid_creator: this.user.current_user_uid,
            date_create: new Date().toISOString(),
            file_size: formItem[1].size
          })
      }

      this.$store.dispatch(FILES.CREATE_FILES_REQUEST, data)
        .then((resp) => {
          if (this.task.type === 2 || this.task.type === 3) {
            if ([TASK_STATUS.TASK_COMPLETED, TASK_STATUS.TASK_READY, TASK_STATUS.TASK_CANCELLED, TASK_STATUS.TASK_REJECTED].includes(this.task.status)) {
              this.selectedTask.status = TASK_STATUS.TASK_REFINE
            }
          }
          this.selectedTask.has_files = true
          if (this.task.uid_customer === this.user.current_user_uid && (this.task.status === TASK_STATUS.TASK_READY || this.task.status === TASK_STATUS.TASK_CANCELLED)) {
            this.selectedTask.status = TASK_STATUS.TASK_REFINE
          }
        })
      this.infoComplete = true
      this.$store.commit(FILES.REFRESH_FILES)
    }
  }
}
</script>
