<template>
  <overlay
    v-show="value"
    @overlay-click="cancel"
  >
    <CardComponent
      v-show="value"
      has-table
      :title="title"
      class="shadow-xl  md:w-2/5 lg:w-[440px] z-50 px-[25px] py-[30px] rounded-[12px]"
      style="box-shadow: 0px 0px 24px rgba(27, 29, 37, 0.08), 0px 2px 6px rgba(27, 29, 37, 0.06);"
      @header-icon-click="cancel"
    >
      <div class="items-center justify-center">
        <InspectorContent
          :messages="messages"
          :select-employee="selectEmployee"
          :select-project="selectProject"
          :select-tag="selectTag"
          :select-color="selectColor"
          :select-time="selectTime"
          :action-confirm-new-params="actionConfirmNewParams"
          :action-confirm-delegate="actionConfirmDelegate"
          :last-selected="lastSelected"
          :current-state="currentState"
          :input-message="inputMessage"
          class="max-h-[40vh] h-[40vh] overflow-auto scroll-style pr-1"
        />
        <slot />
      </div>

      <div class="flex items-stretch flex-col">
        <input
          ref="input"
          v-model="inputMessage"
          maxlength="1000"
          :disabled="currentState === 'end'"
          type="text"
          class="bg-[#F2F4F7] w-full px-[15px] py-[16px] rounded-[10px] font-[400] text-[15px] leading-[18px] focus:ring-0"
          style="color: rgba(0, 0, 0, 0.5); border: none"
          placeholder="Написать сообщение..."
          @keyup.enter="addCustomerMessage"
          @keyup.esc="cancel"
          @keydown.meta.1.prevent="onSelectItem(1)"
          @keydown.ctrl.1.prevent="onSelectItem(1)"
          @keydown.meta.2.prevent="onSelectItem(2)"
          @keydown.ctrl.2.prevent="onSelectItem(2)"
          @keydown.meta.3.prevent="onSelectItem(3)"
          @keydown.ctrl.3.prevent="onSelectItem(3)"
          @keydown.meta.4.prevent="onSelectItem(4)"
          @keydown.ctrl.4.prevent="onSelectItem(4)"
        >
        <span class="mt-3">Осталось символов: {{ symbolsRemain }}</span>
      </div>
    </CardComponent>
  </overlay>
</template>

<script>
import { shouldAddTaskIntoList } from '@/websync/utils'
import * as DOITNOW from '@/store/actions/doitnow.js'

import CardComponent from '@/components/CardComponent.vue'
import Overlay from '@/components/modals/Overlay.vue'
import InspectorContent from '@/components/Inspector/InspectorContent.vue'
import { uuidv4 } from '@/helpers/functions'
import { TASK_STATUS } from '@/constants'

export default {
  components: {
    CardComponent,
    Overlay,
    InspectorContent
  },
  props: {
    title: {
      type: String,
      default: null
    },
    button: {
      type: String,
      default: 'white'
    },
    buttonLabel: {
      type: String,
      default: 'Done'
    },
    hasCancel: Boolean,
    modelValue: {
      type: [String, Number, Boolean],
      default: null
    },
    hasButton: Boolean
  },

  emits: ['update:modelValue', 'cancel', 'confirm', 'delegated'],
  data () {
    return {
      delegatedTask: {},
      input: null,
      currentState: 'taskName',
      inputMessage: '',
      messages: [
        {
          message: 'Привет, что нужно сделать?',
          messageFromInspector: true,
          type: 'taskName',
          createDate: new Date().toISOString()
        }
      ],
      lastSelectedObj: null
    }
  },

  computed: {
    value: {
      get () { return this.modelValue },
      set (value) { this.$emit('update:modelValue', value) }
    },
    user () {
      return this.$store.state.user.user
    },
    employees () {
      return this.$store.state.employees.employees
    },
    symbolsRemain () {
      return 1000 - this.inputMessage.length
    }
  },

  watch: {
    value (newVal) {
      if (!newVal) {
        // очищаем объект новой задачи
        Object.keys(this.delegatedTask).forEach((key) => delete this.delegatedTask[key])
        // очищаем все сообщения
        this.messages.splice(0)
        // запускаем первое сообщение
        this.messages.push({
          message: 'Привет, что нужно сделать?',
          messageFromInspector: true,
          type: 'taskName',
          createDate: new Date().toISOString()
        })
        this.currentState = 'taskName'
      } else {
        // ставим фокус в edit
        setTimeout(() => {
          this.$refs.input.focus({ preventScroll: false })
        }, 250)
      }
    }
  },
  methods: {
    confirmCancel (mode) {
      this.value = false
      this.inputMessage = ''
      this.$emit(mode)
    },
    cancel () {
      this.confirmCancel('cancel')
    },
    pad2 (n) {
      return (n < 10 ? '0' : '') + n
    },
    getTodaysDate (val, isYearFirst = true) {
      if (val == null) {
        val = new Date()
      }
      if (typeof val === 'string') {
        // parse date from ISO 8601 string
        val = new Date(val)
      }
      const month = this.pad2(val.getMonth() + 1)
      const day = this.pad2(val.getDate())
      const year = this.pad2(val.getFullYear())
      if (isYearFirst) {
        return year + '-' + month + '-' + day
      } else {
        return day + '-' + month + '-' + year
      }
    },
    createTask () {
      this.delegatedTask.uid = uuidv4()
      this.delegatedTask.uid_parent = '00000000-0000-0000-0000-000000000000'
      this.delegatedTask.uid_customer = this.user.current_user_uid
      this.delegatedTask.status = TASK_STATUS.NOT_BEGIN
      this.delegatedTask.type = 1
      this.delegatedTask._addToList = false
      this.$store.dispatch('CREATE_TASK', this.delegatedTask).then((resp) => {
        // manually setup uid_performer beacuse
        // we get empty uid_performer after CREATE_TASK request
        resp.data.uid_performer = this.delegatedTask.uid_performer
        this.$store.dispatch('CREATE_INSPECTOR_TASK', {
          uid: this.delegatedTask.uid,
          uid_customer: this.delegatedTask.uid_customer,
          is_inspectable: 1,
          taskJson: JSON.stringify(resp.data)
        }).then(() => {
          this.$store.commit(DOITNOW.SLIDES_CHANGE_VISIBLE, { name: 'delegateTasks', visible: false })
          this.$emit('delegated')
        })
        // update both, performer and customer in inspector service
        const performer = this.employees[resp.data.uid_performer]
        const myself = this.employees[this.user.current_user_uid]
        this.$store.dispatch('CREATE_OR_UPDATE_INSPECTOR_USER', {
          uid: performer.uid,
          userJson: JSON.stringify(performer)
        })
        this.$store.dispatch('CREATE_OR_UPDATE_INSPECTOR_USER', {
          uid: myself.uid,
          userJson: JSON.stringify(myself)
        })
        if (shouldAddTaskIntoList(resp.data)) {
          this.$store.commit('ADD_TASK', resp.data)
        }
      })
    },
    lastSelected (obj) {
      this.lastSelectedObj = obj ? { ...obj } : null
    },
    clearInputMessageAndFocus () {
      this.inputMessage = ''
      this.$nextTick(() => {
        this.$refs.input.focus({ preventScroll: false })
      })
    },
    onMessageSelectEmployee (message) {
      if (this.lastSelectedObj) {
        this.selectEmployee(this.lastSelectedObj)
        this.clearInputMessageAndFocus()
      }
    },
    onMessageSelectProject (message) {
      if (this.lastSelectedObj) {
        this.selectProject(this.lastSelectedObj)
        this.clearInputMessageAndFocus()
      }
    },
    onMessageSelectTag (message) {
      if (this.lastSelectedObj) {
        this.selectTag(this.lastSelectedObj)
        this.clearInputMessageAndFocus()
      }
    },
    onMessageSelectColor (message) {
      if (this.lastSelectedObj) {
        this.selectColor(this.lastSelectedObj)
        this.clearInputMessageAndFocus()
      }
    },
    onMessageSelectTime (message) {
      if (this.lastSelectedObj) {
        this.selectTime({
          name: this.lastSelectedObj.name,
          date: this.lastSelectedObj.value.toISOString()
        })
        this.clearInputMessageAndFocus()
      }
    },
    onMessageAddParams (message) {
      if (this.lastSelectedObj) {
        this.actionConfirmNewParams(this.lastSelectedObj.value)
        this.clearInputMessageAndFocus()
      }
    },
    onMessageConfirm (message) {
      if (this.lastSelectedObj) {
        this.actionConfirmDelegate(this.lastSelectedObj.value)
        this.clearInputMessageAndFocus()
      }
    },
    addCustomerMessage () {
      if (!this.inputMessage) {
        if (this.currentState === 'taskComment') {
          this.delegatedTask.comment = ''
          this.messages.push({
            message:
        'Отлично, теперь выберите исполнителя. Если сотрудника нет в списке - начните вводить его имя, а я его найду.',
            messageFromInspector: true,
            type: 'employeeSelection',
            createDate: new Date().toISOString()
          })
          this.currentState = 'employeeSelection'
          this.clearInputMessageAndFocus()
          return
        } else {
          return
        }
      }
      if (this.currentState === 'employeeSelection') {
        this.onMessageSelectEmployee(this.inputMessage)
        return
      }
      if (this.currentState === 'projectSelection') {
        this.onMessageSelectProject(this.inputMessage)
        return
      }
      if (this.currentState === 'tagSelection') {
        this.onMessageSelectTag(this.inputMessage)
        return
      }
      if (this.currentState === 'colorSelection') {
        this.onMessageSelectColor(this.inputMessage)
        return
      }
      if (this.currentState === 'timeSelection') {
        this.onMessageSelectTime(this.inputMessage)
        return
      }
      if (this.currentState === 'confirmParams') {
        this.onMessageAddParams(this.inputMessage)
        return
      }
      if (this.currentState === 'confirmDelegate') {
        this.onMessageConfirm(this.inputMessage)
        return
      }

      if (this.currentState !== 'taskName' && this.currentState !== 'taskComment') return
      this.messages.push({
        message: this.inputMessage,
        messageFromInspector: false,
        createDate: new Date().toISOString()
      })

      if (this.currentState === 'taskName') {
        this.delegatedTask.name = this.inputMessage
        this.messages.push({
          message:
        'Теперь добавим заметку для задачи. Чтобы пропустить - нажмите Enter',
          messageFromInspector: true,
          type: 'taskComment',
          createDate: new Date().toISOString()
        })
        this.currentState = 'taskComment'
        this.clearInputMessageAndFocus()
        return
      }

      if (this.currentState === 'taskComment') {
        this.delegatedTask.comment = this.inputMessage

        this.messages.push({
          message:
        'Отлично, теперь выберите исполнителя. Если сотрудника нет в списке - начните вводить его имя, а я его найду.',
          messageFromInspector: true,
          type: 'employeeSelection',
          createDate: new Date().toISOString()
        })
        this.currentState = 'employeeSelection'
        this.clearInputMessageAndFocus()
        return
      }
      this.clearInputMessageAndFocus()
    },
    selectEmployee (emp) {
      if (this.currentState !== 'employeeSelection') return
      this.messages.push({
        message: emp.name,
        messageFromInspector: false,
        createDate: new Date().toISOString()
      })
      if (this.currentState === 'employeeSelection') {
        this.delegatedTask.email_performer = emp.email
        this.delegatedTask.uid_performer = emp.uid
        this.messages.push({
          message: 'Очень хорошо, когда выполнить?',
          messageFromInspector: true,
          type: 'timeSelection',
          createDate: new Date().toISOString()
        })
        this.currentState = 'timeSelection'
        this.clearInputMessageAndFocus()
      }
    },
    selectProject (project) {
      if (this.currentState !== 'projectSelection') return
      this.messages.push({
        message: project.name,
        messageFromInspector: false,
        createDate: new Date().toISOString()
      })
      if (this.currentState === 'projectSelection') {
        if (project.uid !== 'no_set') this.delegatedTask.uid_project = project.uid
        this.messages.push({
          message: 'Супер, что насчет меток?',
          messageFromInspector: true,
          type: 'tagSelection',
          createDate: new Date().toISOString()
        })
        this.currentState = 'tagSelection'
      }
    },
    selectTag (tag) {
      if (this.currentState !== 'tagSelection') return
      this.messages.push({
        message: tag.name,
        messageFromInspector: false,
        createDate: new Date().toISOString()
      })
      if (this.currentState === 'tagSelection') {
        if (tag.uid !== 'no_set') this.delegatedTask.tags = [tag.uid]
        this.messages.push({
          message: 'Какой цвет присвоить задаче?',
          messageFromInspector: true,
          type: 'colorSelection',
          createDate: new Date().toISOString()
        })
        this.currentState = 'colorSelection'
        this.clearInputMessageAndFocus()
      }
    },

    selectColor (color) {
      if (this.currentState !== 'colorSelection') return
      this.messages.push({
        message: color.name,
        messageFromInspector: false,
        createDate: new Date().toISOString()
      })
      if (this.currentState === 'colorSelection') {
        if (color.uid !== 'no_set') this.delegatedTask.uid_marker = color.uid
        this.messages.push({
          message: 'На этом все, я поручу задачу?',
          messageFromInspector: true,
          type: 'confirmDelegate',
          createDate: new Date().toISOString()
        })
        this.currentState = 'confirmDelegate'
        this.clearInputMessageAndFocus()
      }
    },
    selectTime (time) {
      if (this.currentState !== 'timeSelection') return
      this.messages.push({
        message: time.name,
        messageFromInspector: false,
        createDate: new Date().toISOString()
      })
      this.delegatedTask.date_begin = this.getTodaysDate(time.date) + 'T00:00:00'
      this.delegatedTask.date_end = this.getTodaysDate(time.date) + 'T23:59:59'
      if (this.currentState === 'timeSelection') {
        this.delegatedTask.customer_date = time.date
        this.messages.push({
          message: 'Нет проблем, проставим дополнительные параметры?',
          messageFromInspector: true,
          type: 'confirmParams',
          createDate: new Date().toISOString()
        })
        this.currentState = 'confirmParams'
      }
    },
    actionConfirmNewParams (confirmed) {
      if (this.currentState !== 'confirmParams') return
      if (confirmed) {
        this.messages.push({
          message: 'Да',
          messageFromInspector: false,
          createDate: new Date().toISOString()
        })
        this.messages.push({
          message: 'В какой проект поместить задачу?',
          messageFromInspector: true,
          type: 'projectSelection',
          createDate: new Date().toISOString()
        })
        this.currentState = 'projectSelection'
        this.clearInputMessageAndFocus()
      } else {
        this.messages.push({
          message: 'Нет',
          messageFromInspector: false,
          createDate: new Date().toISOString()
        })
        this.messages.push({
          message: 'Я поручу задачу?',
          messageFromInspector: true,
          type: 'confirmDelegate',
          createDate: new Date().toISOString()
        })
        this.currentState = 'confirmDelegate'
      }
    },
    actionConfirmDelegate (confirmed) {
      if (this.currentState !== 'confirmDelegate') return
      if (confirmed) {
        this.messages.push({
          message: 'Да',
          messageFromInspector: false,
          createDate: new Date().toISOString()
        })
        this.createTask()
        this.messages.push({
          message: 'Я поручил вашу задачу, она будет выполнена неизбежно',
          messageFromInspector: true,
          type: 'end',
          createDate: new Date().toISOString()
        })
        this.currentState = 'end'
      } else {
        this.messages.push({
          message: 'Нет',
          messageFromInspector: false,
          createDate: new Date().toISOString()
        })
        this.messages.push({
          message: 'Жаль, обращайтесь когда я потребуюсь',
          messageFromInspector: true,
          type: 'end',
          createDate: new Date().toISOString()
        })
        this.currentState = 'end'
      }
      // закрываемся
      setTimeout(() => {
        this.cancel()
      }, 3000)
    },
    onSelectItem (item) {
      const selector = `.inspector-option-item${item}`
      const option = document.querySelector(selector)
      if (option) option.click({ preventScroll: false })
    }
  }
}
</script>
