<template>
  <DoitnowContent
    :border-color="colors[task.uid_marker] ? colors[task.uid_marker].back_color : ''"
    :background-color="isTaskComplete &&
      task.uid_marker !== '00000000-0000-0000-0000-000000000000' ? 'rgb(229 231 235)' : ''"
  >
    <DoitnowStatusModal
      v-if="showStatusModal"
      :title="'Внимание'"
      :text="'При завершении этой задачи все подзадачи будут завершены. Завершить?'"
      @cancel="showStatusModal = false"
      @yes="changeStatus(lastSelectedStatus, true)"
    />

    <div>
      <DoitnowCustomerInfo
        v-if="shouldShowCustomer"
        :task="task"
        :employees="employees"
      />
      <DoitnowPerformerInfo
        v-else-if="shouldShowPerformer"
        :task="task"
        :employees="employees"
      />
      <div
        class="flex mr-[30px] justify-between items-center mb-[13px] py-2 rounded-[8px]"
      >
        <!-- task info/status -->
        <contenteditable
          v-model="name"
          v-linkify:options="{ className: 'text-blue-600 mx-[5px]', tagName: 'a' }"
          tag="div"
          class="ring-0 outline-none overflow-hidden font-bold text-[21px] text-[#424242]"
          style="word-break: break-word"
          :contenteditable="task._isEditable"
          placeholder="Введите название задачи"
          :no-nl="false"
          :no-html="false"
          :class="{ 'uppercase': !task._isEditable && colors[task.uid_marker] && colors[task.uid_marker].uppercase, 'text-gray-500': task.status == TASK_STATUS.TASK_COMPLETED || task.status == TASK_STATUS.TASK_CANCELLED, 'line-through': task.status == TASK_STATUS.TASK_COMPLETED || task.status == TASK_STATUS.TASK_CANCELLED }"
          @focusout="clearTaskFocus(task)"
          @dblclick.stop="editTaskName(task)"
          @keydown.enter="updateTask($event, task)"
        />
      </div>
      <div class="gap-[5px] flex flex-wrap mb-[20px]">
        <TaskStatus
          class="pt-[6px]"
          :task="task"
          @changeStatus="changeStatus"
        />
        <DoitnowBadge
          v-if="createTaskDate"
          class="ml-1"
          icon="calendar"
          :text="createTaskDate"
        />
        <template
          v-for="(tag, index) in task.tags"
          :key="index"
        >
          <TaskListTagLabel
            v-if="tags[tag]"
            :icon-path="tagIcon.path"
            :icon-box="tagIcon.viewBox"
            :text="tags[tag].name"
            :color-bg-style="{ backgroundColor: tags[tag] ? tags[tag].back_color : '' }"
          />
        </template>
        <DoitnowBadge
          v-if="isTaskHaveOverdueTime"
          class="!text-white"
          title="Просрочено:"
          color="#ef7665"
          bold-text
          :text="isTaskHaveOverdueTime"
        />
        <DoitnowBadge
          v-if="shouldShowProject"
          :text="projectName"
          color="#facc15"
          icon="project"
        />
      </div>
      <TaskPropsCommentEditor
        v-if="shouldShowCommentEditor"
        class="mt-3"
        text-style="!text-[16px] leading-[155%] px-[22px] py-[12px] bg-[#f8f8fa] rounded-lg min-h-[200px]"
        style="word-break: break-word"
        :comment="task.comment"
        :can-edit="task.uid_customer === user?.current_user_uid"
        @changeComment="onChangeComment"
        @onPasteFile="onPasteEvent"
      />
      <Checklist
        v-if="shouldShowChecklist"
        class="mt-5 checklist-custom font-medium"
        :checklist="task?.checklist"
        :can-edit="canEditChecklist"
        :can-check="canCheckChecklist"
        :add-new="checklistshow"
        @changeChecklist="onChangeChecklist"
        @endEdit="onAddChecklistComplete"
      />
      <DoitnowChatMessages
        :task="task"
        :is-task-messages-loading="isTaskMessagesLoading"
        :task-messages="taskMessages"
        :current-user-uid="user?.current_user_uid"
        :message-quote-user="messageQuoteUser"
        :message-quoute-string="messageQuoteString"
        :show-all-messages="true"
        :show-only-files="showOnlyFiles"
        @answerMessage="onAnswerMessage"
        @sendTaskMsg="sendTaskMsg"
        @onPasteEvent="onPasteEvent"
        @deleteFiles="deleteFiles"
        @deleteTaskMsg="deleteTaskMsg"
        @readTask="readTask"
      />
    </div>
    <template #buttons>
      <DoitnowRightButtonPostpone
        v-if="!task.mode && shouldShowPostponeButton"
        :is-animation-doitnow="isAnimationDoitnow"
        @postpone="onPostpone"
        @next="nextTask"
      />
      <DoitnowRightButton
        v-if="!task.mode && shouldShowAcceptButton"
        :title="acceptButtonText"
        icon="check"
        @click="accept"
      />
      <DoitnowRightButton
        v-if="!task.mode && shouldShowRefineButton"
        title="На доработку"
        icon="refine"
        @click="refine"
      />
      <DoitnowRightButton
        v-if="!task.mode && shouldShowRejectButton"
        title="Отклонить"
        icon="cancel"
        @click="reject"
      />
      <DoitnowRightButton
        v-if="!task.mode && shouldShowCancelButton"
        title="Отменить"
        icon="cancel"
        @click="cancel"
      />
      <DoitnowRightButtonPerform
        v-if="!task.mode && shouldShowPerformButton"
        :task-type="task.type"
        :current-user-uid="user?.current_user_uid"
        :performer-email="task.email_performer"
        @changePerformer="onChangePerformer"
        @reAssign="onReAssignToUser"
      />
      <DoitnowRightButton
        v-if="!task.mode"
        title="Открыть задачу"
        icon="task-open"
        @click="openTaskFromQueue"
      />
    </template>
  </DoitnowContent>
</template>

<script>
import { uuidv4 } from '@/helpers/functions'
import { TASK_STATUS, TASK_TYPE } from '@/constants'
import contenteditable from 'vue-contenteditable'
import linkify from 'vue-linkify'
import TaskPropsCommentEditor from '@/components/TaskProperties/TaskPropsCommentEditor.vue'

// Doitnow components
import Checklist from '@/components/Doitnow/Checklist.vue'
import DoitnowStatusModal from '@/components/Doitnow/DoitnowStatusModal.vue'
import DoitnowChatMessages from '@/components/Doitnow/DoitnowChatMessages.vue'
import DoitnowRightButtonPerform from '@/components/Doitnow/DoitnowRightButtonPerform.vue'
import DoitnowRightButtonPostpone from '@/components/Doitnow/DoitnowRightButtonPostpone.vue'
import DoitnowRightButton from '@/components/Doitnow/DoitnowRightButton.vue'
import DoitnowCustomerInfo from '@/components/Doitnow/DoitnowCustomerInfo.vue'
import DoitnowPerformerInfo from '@/components/Doitnow/DoitnowPerformerInfo.vue'
import TaskListTagLabel from '@/components/TasksList/TaskListTagLabel'
import DoitnowContent from '@/components/Doitnow/DoitnowContent.vue'

import * as INSPECTOR from '@/store/actions/inspector.js'
import * as TASK from '@/store/actions/tasks'
import * as MSG from '@/store/actions/taskmessages'
import * as FILES from '@/store/actions/taskfiles.js'
import tagIcon from '@/icons/tag'
import DoitnowBadge from '@/components/Doitnow/DoitnowBadge'
import TaskStatus from '@/components/TasksList/TaskStatus'

export default {
  components: {
    TaskStatus,
    DoitnowBadge,
    DoitnowRightButtonPerform,
    TaskPropsCommentEditor,
    DoitnowCustomerInfo,
    DoitnowPerformerInfo,
    Checklist,
    DoitnowRightButtonPostpone,
    DoitnowRightButton,
    DoitnowStatusModal,
    contenteditable,
    DoitnowChatMessages,
    TaskListTagLabel,
    DoitnowContent
  },
  directives: {
    linkify
  },
  props: {
    task: {
      type: Object,
      default: () => ({})
    },
    subTasks: {
      type: Array,
      default: () => ([])
    },
    colors: {
      type: Object,
      default: () => ({})
    },
    employees: {
      type: Object,
      default: () => ({})
    },
    projects: {
      type: Object,
      default: () => ({})
    },
    user: {
      type: Object,
      default: () => ({})
    },
    taskMessages: {
      type: Array,
      default: () => ([])
    },
    childrens: {
      type: Array,
      default: () => ([])
    },
    isTaskMessagesLoading: {
      type: Boolean,
      default: false
    },
    isAnimationDoitnow: {
      type: Boolean,
      default: false
    }
  },
  emits: ['clickTask', 'nextTask', 'changeValue', 'readTask'],
  data () {
    return {
      showStatusModal: false,
      lastSelectedStatus: '',
      showConfirm: false,
      checklistshow: false,
      checklistSavedNow: false,
      currentAnswerMessageUid: '',
      name: this.task.name,
      isloading: false,
      showOnlyFiles: false,
      dateIsNotEditingNow: false,
      TASK_STATUS,
      postponeIndex: 0,
      postponeDate: {
        start: '',
        end: ''
      },
      tagIcon
    }
  },
  computed: {
    acceptButtonText () {
      if (this.isCustomer && this.isPerformer) {
        return 'Завершить'
      } else if (this.isCustomer && !this.isPerformer) {
        return 'Принять и завершить'
      } else if (!this.isCustomer && this.isPerformer) {
        return 'Готово к сдаче'
      }
      return 'Понятно'
    },
    tags () {
      return this.$store.state.tasks.tags
    },
    canEditChecklist () {
      return ((this.task?.type === 1 || this.task?.type === 2) && this.user.tarif !== 'free') || !this.$store.getters.isLicenseExpired
    },
    canCheckChecklist () {
      return ((this.canEditChecklist || this.task?.type === 3) && this.user.tarif !== 'free') || !this.$store.getters.isLicenseExpired
    },
    taskMessagesAndFiles () {
      return this.$store.state.taskfilesandmessages.messages
    },
    isPerformer () {
      return this.task.uid_performer === this.user?.current_user_uid
    },
    isCustomer () {
      return this.task.uid_customer === this.user?.current_user_uid
    },
    dateClearWords () {
      let time
      if (this.isCustomer) {
        time = this.task.date_end
      } else {
        time = this.task.customer_date_end
      }
      if (time === '0001-01-01T00:00:00') {
        return false
      }
      return this.getDate(time, !this.task.customer_date_end.includes('23:59:59'))
    },
    createTaskDate () {
      const time = this.task.date_create
      if (time === '0001-01-01T00:00:00' || !time) {
        return false
      }
      return this.getDate(time, true)
    },
    isPropertiesMobileExpanded () {
      return this.$store.state.isPropertiesMobileExpanded
    },
    isTaskComplete () {
      return this.task.status === TASK_STATUS.TASK_COMPLETED || this.task.status === TASK_STATUS.TASK_CANCELLED
    },
    isTaskHaveOverdueTime () {
      let time
      if (this.isCustomer) {
        time = this.task.date_end
      } else {
        time = this.task.customer_date_end
      }
      if (time === '0001-01-01T00:00:00') {
        return false
      }
      const todayDate = new Date()
      const dateEnd = new Date(time)
      todayDate.setHours(0, 0, 0, 0)
      dateEnd.setHours(0, 0, 0, 0)
      const date = Math.floor((todayDate - dateEnd) / (60 * 60 * 24 * 1000))
      const dayName = date % 10 === 1 && date % 100 !== 11 ? 'день' : (((date >= 2) && (date % 10 <= 4)) && (date % 100 < 10 || date % 100 >= 20) ? 'дня' : 'дней')
      if (date <= 0) {
        return false
      } else {
        return date + ' ' + dayName
      }
    },
    messageQuoteUser () {
      if (!this.currentAnswerMessageUid) return ''
      const quotedMessage = this.taskMessages.find(message => message.uid === this.currentAnswerMessageUid)
      if (!quotedMessage) return ''
      return this.employees[quotedMessage.uid_creator]?.name ?? '???'
    },
    messageQuoteString () {
      if (!this.currentAnswerMessageUid) return ''
      const quotedMessage = this.taskMessages.find(message => message.uid === this.currentAnswerMessageUid)
      if (!quotedMessage) return ''
      let msg = quotedMessage.msg.trim()
      msg = msg.replaceAll('&amp;', '&')
      msg = msg.replaceAll('&lt;', '<')
      msg = msg.replaceAll('&gt;', '>')
      return msg
    },
    // состояния для v-if
    shouldShowCustomer () {
      return this.task?.type !== TASK_TYPE.MY_TASK_NO_ASSIGNEE && (this.task?.uid_customer !== this.user?.current_user_uid)
    },
    shouldShowPerformer () {
      return (this.task?.type !== TASK_TYPE.MY_TASK_NO_ASSIGNEE) && (this.task?.uid_performer !== this.task?.uid_customer)
    },
    shouldShowProject () {
      return this.task?.uid && this.projects[this.task?.uid_project]
    },
    shouldShowCommentEditor () {
      return this.task?.comment?.length || this.task?.uid_customer === this.user?.current_user_uid
    },
    shouldShowChecklist () {
      return this.task?.checklist || this.checklistshow || this.checklistSavedNow
    },
    shouldShowPostponeButton () {
      return this.shouldShowAcceptButton && this.task.status !== TASK_STATUS.TASK_READY
    },
    shouldShowAcceptButton () {
      return this.task.uid_customer === this.user?.current_user_uid || this.task.uid_performer === this.user?.current_user_uid
    },
    shouldShowRefineButton () {
      return this.isCustomer && !this.isPerformer && this.task.status === TASK_STATUS.TASK_READY
    },
    shouldShowRejectButton () {
      return !this.isCustomer && this.isPerformer
    },
    shouldShowCancelButton () {
      return this.isCustomer
    },
    shouldShowPerformButton () {
      return this.task.status !== TASK_STATUS.NOTE && this.task.type !== TASK_STATUS.TASK_IN_WORK && (this.task.uid_customer === this.user?.current_user_uid || this.task.uid_customer === this.task.uid_performer)
    },
    projectName () {
      return this.projects[this.task.uid_project]?.name.length > 99
        ? this.projects[this.task.uid_project]?.name.split('').slice(0, 100).join('') + '...'
        : this.projects[this.task.uid_project]?.name
    }
  },
  watch: {
    task () {
      this.name = this.task.name
    }
  },
  methods: {
    changeDateEditingStatus (value) {
      this.dateIsNotEditingNow = value
    },
    onChangeChecklist (checklist) {
      const data = {
        uid_task: this.task?.uid,
        checklist: checklist
      }
      this.checklistSavedNow = true
      this.$store.dispatch(TASK.CHANGE_TASK_CHECKLIST, data).then(
        resp => {
          this.$emit('changeValue', { checklist: checklist })
        }
      ).finally(() => {
        this.checklistSavedNow = false
      })
    },
    onAddChecklistComplete () {
      this.checklistshow = false
    },
    sendTaskMsg (msg) {
      const date = new Date()
      const month = this.pad2(date.getUTCMonth() + 1)
      const day = this.pad2(date.getUTCDate())
      const year = this.pad2(date.getUTCFullYear())
      const hours = this.pad2(date.getUTCHours())
      const minutes = this.pad2(date.getUTCMinutes())
      const seconds = this.pad2(date.getUTCSeconds())
      const dateCreate = year + '-' + month + '-' + day + 'T' + hours + ':' + minutes + ':' + seconds
      const msgtask = this._linkify(msg)
      const uid = uuidv4()

      const data = {
        uid_task: this.task.uid,
        uid_creator: this.user.current_user_uid,
        uid: uid,
        uid_msg: uid,
        uid_quote: this.currentAnswerMessageUid,
        date_create: dateCreate,
        deleted: 0,
        text: msg,
        msg: msgtask
      }

      this.$store.dispatch(MSG.CREATE_MESSAGE_REQUEST, data)
        .then(() => {
          const lastInspectorMessage = this.taskMessagesAndFiles[this.taskMessagesAndFiles.length - 2].uid_creator === 'inspector' ? this.taskMessagesAndFiles[this.taskMessagesAndFiles.length - 2] : false
          console.log('lastInspectorMessage: ', lastInspectorMessage)
          if (lastInspectorMessage) {
            this.$store.dispatch(INSPECTOR.ANSWER_INSPECTOR_TASK, {
              id: lastInspectorMessage.id,
              answer: 1
            }).then(() => {
              lastInspectorMessage.performer_answer = 1
            })
          }

          if (this.task.type === 2 || this.task.type === 3) {
            if ([TASK_STATUS.TASK_COMPLETED, TASK_STATUS.TASK_READY, TASK_STATUS.TASK_CANCELLED, TASK_STATUS.TASK_REJECTED].includes(this.task.status)) {
              this.$emit('changeValue', { status: TASK_STATUS.TASK_REFINE })
            }
          }
        })
      this.$emit('changeValue', { has_msgs: true })
      this.taskMsg = ''
    },
    openTaskFromQueue () {
      const uid = this.task.uid
      this.$router.push('/task/' + uid)
      this.$store.state.tasks.taskFromQueue = uid
    },
    postponeTask (begin, end, item) {
      const dateEnd = new Date()
      switch (item.name) {
        case '10 минут':
          dateEnd.setMinutes(dateEnd.getMinutes() + item.value)
          break
        case '1 час':
        case '3 часа':
          dateEnd.setHours(dateEnd.getHours() + item.value)
          break
        case 'Завтра':
          dateEnd.setDate(dateEnd.getDate() + item.value)
          break
      }

      const month = this.pad2(dateEnd.getMonth() + 1)
      const day = this.pad2(dateEnd.getDate())
      const year = String(dateEnd.getFullYear()).padStart(4, '0')
      const hours = this.pad2(dateEnd.getHours())
      const minutes = this.pad2(dateEnd.getMinutes())
      const seconds = this.pad2(dateEnd.getSeconds())
      const newDateEnd = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`

      const data = {
        uid_task: this.task.uid,
        str_date_begin: newDateEnd,
        str_date_end: end,
        reset: 0
      }
      this.$store.dispatch(TASK.CHANGE_TASK_DATE, data)
        .then(
          resp => {
            const data = {
              is_overdue: resp.is_overdue,
              term_user: resp.term,
              date_begin: resp.str_date_begin,
              date_end: resp.str_date_end
            }
            this.$emit('changeValue', data)
            this.readTask()
          })
      this.nextTask()
    },
    readTask () {
      this.$emit('readTask')
    },
    pad2 (n) {
      return (n < 10 ? '0' : '') + n
    },
    onChangeComment (text) {
      const data = {
        uid: this.task.uid,
        value: text
      }
      this.$store.dispatch(TASK.CHANGE_TASK_COMMENT, data)
      this.$emit('changeValue', { comment: text })
    },
    _linkify (text) {
      return text.replace(/(lt?:\/\/[^\s]+)/g, '<a href="$1">$1</a>')
    },
    removeTask (uid) {
      if (this.isPropertiesMobileExpanded) {
        this.$store.dispatch('asidePropertiesToggle', false)
      }
      this.$store.dispatch(TASK.REMOVE_TASK, uid)
    },
    // copypaste
    onPasteEvent: function (e) {
      const items = (e.clipboardData || e.originalEvent.clipboardData).items
      let loadFile = false
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
          loadFile = true
          this.isloading = true
          this.$store.dispatch(FILES.CREATE_FILES_REQUEST, data).then(
            () => {
              this.isloading = false
              // ставим статус "на доработку" когда прикладываем файл
              if (this.task.type === 2 || this.task.type === 3) {
                if ([TASK_STATUS.TASK_COMPLETED, TASK_STATUS.TASK_READY, TASK_STATUS.TASK_CANCELLED, TASK_STATUS.TASK_REJECTED].includes(this.task.status)) {
                  if (((this.task.uid_customer === this.cusers?.current_user_uid) && ((this.task.status === TASK_STATUS.TASK_COMPLETED) || (this.task.status === TASK_STATUS.TASK_READY)))) {
                    this.$emit('changeValue', { status: TASK_STATUS.TASK_REFINE })
                  }
                }
              }
              // загрузка завершена - подписываемся опять
              this.$refs.taskMsgEdit.addEventListener('paste', this.onPasteEvent, { once: true })
            })
          setTimeout(() => {
            const elmnt = document.getElementById('content').lastElementChild
            elmnt.scrollIntoView({ behavior: 'smooth' })
          }, 100)
        }
      }
      if (!loadFile) {
        // не вставка файла - подписываемся опять
        this.$refs.taskMsgEdit.addEventListener('paste', this.onPasteEvent, { once: true })
      }
    },
    updateTask (event, task) {
      this.$store.dispatch(TASK.CHANGE_TASK_NAME, {
        uid: task.uid,
        value: this.name.replace(/\r?\n|\r/g, '')
      })
      if (task.name.length > 0) {
        if (task._justCreated) {
          task._addToList = true
          this.$store.dispatch(TASK.CREATE_TASK, task)
        } else {
          this.$store.dispatch(TASK.CHANGE_TASK_NAME, {
            uid: task.uid,
            value: this.name
          })
        }
        const data = {
          _isEditing: false
        }
        this.$emit('changeValue', data)
      } else if (task.name.length === 0) {
        if (task._justCreated) {
          if (this.isPropertiesMobileExpanded) {
            this.$store.dispatch('asidePropertiesToggle', false)
          }
          this.$store.commit(TASK.REMOVE_TASK, task.uid)
        } else {
          this.showConfirm = true
          // removeTask(task.uid)
        }
      }
    },
    deleteFiles (uid) {
      this.$store.dispatch(FILES.DELETE_FILE_REQUEST, { uid: uid })
    },
    deleteTaskMsg (uid) {
      this.$store.dispatch(MSG.DELETE_MESSAGE_REQUEST, { uid: uid })
        .then(() => {
          this.$store.state.taskfilesandmessages.messages.find(message => message.uid === uid).deleted = 1
        })
    },
    editTaskName (task) {
      const data = {
        _isEditable: this.user?.current_user_uid === task.uid_customer
      }
      this.$emit('changeValue', data)
    },
    clearTaskFocus (task) {
      if (task.name === '') {
        this.removeTask(task.uid)
      } else if (task.name !== '' && !task.enterPress) {
        this.updateTask(event, task)
      }
      if (this.isPropertiesMobileExpanded) {
        this.$store.dispatch('asidePropertiesToggle', false)
      }
      const data = {
        _isEditing: false
      }
      this.$emit('changeValue', data)
    },
    getValidForeColor (foreColor) {
      if (foreColor && foreColor !== '#A998B6') return foreColor
      return ''
    },
    changeValue (value) {
      this.$emit('changeValue', value)
    },
    nextTask () {
      this.$emit('nextTask')
    },
    refine () {
      if (this.childrens?.length) {
        this.lastSelectedStatus = TASK_STATUS.TASK_REFINE
        this.changeStatus(this.lastSelectedStatus, true)
        return
      }
      this.readTask()
      this.$store.dispatch(TASK.CHANGE_TASK_STATUS, {
        uid: this.task.uid,
        value: TASK_STATUS.TASK_REFINE
      })
      this.$emit('changeValue', { status: TASK_STATUS.TASK_REFINE })
      this.nextTask()
    },
    cancel () {
      if (this.childrens?.length) {
        this.lastSelectedStatus = TASK_STATUS.TASK_CANCELLED
        this.changeStatus(this.lastSelectedStatus, true)
        return
      }
      this.readTask()
      this.$store.dispatch(TASK.CHANGE_TASK_STATUS, {
        uid: this.task.uid,
        value: TASK_STATUS.TASK_CANCELLED
      })
      this.$emit('changeValue', { status: TASK_STATUS.TASK_CANCELLED })
      this.nextTask()
    },
    reject () {
      if (this.childrens?.length) {
        this.lastSelectedStatus = TASK_STATUS.TASK_REJECTED
        this.changeStatus(this.lastSelectedStatus, true)
        return
      }
      this.readTask()
      this.$store.dispatch(TASK.CHANGE_TASK_STATUS, {
        uid: this.task.uid,
        value: TASK_STATUS.TASK_REJECTED
      })
      this.$emit('changeValue', { status: TASK_STATUS.TASK_REJECTED })
      this.nextTask()
    },
    accept () {
      if (this.childrens?.length) {
        this.showStatusModal = true
        if ((this.task.uid_performer === this.user.current_user_uid && this.task.uid_customer === this.user.current_user_uid) ||
        (this.task.uid_performer !== this.user.current_user_uid && this.task.uid_customer === this.user.current_user_uid)) {
          this.lastSelectedStatus = TASK_STATUS.TASK_COMPLETED
        } else {
          this.lastSelectedStatus = TASK_STATUS.TASK_READY
        }
        return
      }
      this.readTask()
      if ((this.task.uid_performer === this.user?.current_user_uid && this.task.uid_customer === this.user?.current_user_uid) ||
        (this.task.uid_performer !== this.user?.current_user_uid && this.task.uid_customer === this.user?.current_user_uid)) {
        this.$store.dispatch(TASK.CHANGE_TASK_STATUS, {
          uid: this.task.uid,
          value: 1
        })
        this.$emit('changeValue', { status: TASK_STATUS.TASK_COMPLETED })
      } else {
        this.$store.dispatch(TASK.CHANGE_TASK_STATUS, {
          uid: this.task.uid,
          value: 5
        })
        this.$emit('changeValue', { status: TASK_STATUS.TASK_READY })
      }
      this.nextTask()
    },
    decline () {
      this.readTask()
      this.$store.dispatch(TASK.CHANGE_TASK_STATUS, {
        uid: this.task.uid,
        value: TASK_STATUS.TASK_PAUSED
      })
      this.$emit('changeValue', { status: TASK_STATUS.TASK_PAUSED })
      this.nextTask()
    },
    onReAssignToUser: function (userEmail) {
      const data = {
        uid: this.task.uid,
        value: userEmail
      }
      this.$store.dispatch(TASK.CHANGE_TASK_REDELEGATE, data)
        .then(
          resp => {
            this.$store.commit(TASK.SUBTASKS_REQUEST, resp.data)
          }
        )
    },
    onChangePerformer: function (userEmail) {
      console.log('onChangePerformer', userEmail)
      const user = this.$store.state.user.user
      const taskUid = this.task.uid
      const data = {
        uid: this.task.uid,
        value: userEmail
      }
      this.$store.dispatch(TASK.CHANGE_TASK_PERFORMER, data)
        .then(
          resp => {
            const data = {
              email_performer: resp.data.email_performer,
              perform_time: resp.data.perform_time,
              performerreaded: resp.data.performerreaded,
              uid_performer: resp.data.uid_performer,
              type: resp.data.type
            }
            this.changeValue(data)
          }
        )
      if (user?.current_user_email !== userEmail) {
        this.$store.commit(TASK.REMOVE_TASK, taskUid)
        this.$store.dispatch('asidePropertiesToggle', false)
      }
    },
    onAnswerMessage (uid) {
      this.currentAnswerMessageUid = uid
    },
    onPostpone (date) {
      const year = String(date.getFullYear()).padStart(4, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')
      const dateStr = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
      this.onChangeDates(dateStr, dateStr)
    },
    onChangeDates (begin, end) {
      const data = {
        uid_task: this.task.uid,
        str_date_begin: begin,
        str_date_end: end,
        reset: 0
      }
      this.$store.dispatch(TASK.CHANGE_TASK_DATE, data)
        .then(
          resp => {
            const data = {
              is_overdue: resp.is_overdue,
              term_user: resp.term,
              date_begin: resp.str_date_begin,
              date_end: resp.str_date_end
            }
            this.$emit('changeValue', data)
            this.readTask()
            this.changeDateEditingStatus(true)
          })
      this.nextTask()
    },
    changeStatus (status, isModalAnswer) {
      if (this.childrens?.length && !(isModalAnswer) && [TASK_STATUS.TASK_COMPLETED, TASK_STATUS.TASK_READY, TASK_STATUS.TASK_CANCELLED, TASK_STATUS.TASK_REJECTED].includes(status)) {
        this.lastSelectedStatus = status
        this.showStatusModal = true
        return
      }
      this.$store.dispatch(TASK.CHANGE_TASK_STATUS, {
        uid: this.task.uid,
        value: status
      }).then(() => {
        this.$emit('changeValue', { status: status })
        this.showStatusModal = false
        this.$emit('nextTask')
      })
    },
    getDate (time, withHours) {
      const month = new Date(time).getMonth() + 1
      const months = [' Января ', ' Февраля ', ' Марта ', ' Апреля ', ' Мая ', ' Июня ', ' Июля ', ' Августа ', ' Сентября ', ' Октября ', ' Ноября ', ' Декабря ']

      let fullDate = new Date(time).getDate() + months[month - 1] + (new Date().getFullYear() === new Date(time).getUTCFullYear() ? '' : new Date(time).getUTCFullYear())

      if (withHours) {
        const date = new Date(time)
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')

        fullDate += `(${hours}:${minutes})`
      }

      return fullDate
    },
    changePostponeIndex (index) {
      this.postponeDate = {
        start: '',
        end: ''
      }
      this.postponeIndex = index
    },
    changePostponeDate (dateBegin, dateEnd) {
      this.postponeDate.start = dateBegin
      this.postponeDate.end = dateEnd
    }
  }
}
</script>
