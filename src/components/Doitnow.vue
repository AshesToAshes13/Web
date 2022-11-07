<template>
  <div
    ref="doitnow"
    class="w-full overflow-hidden"
    :class="showLimitMessage ? 'h-full' : ''"
  >
    <NavBar
      v-if="!showLimitMessage"
      class="pt-[8px]"
      title="Очередь"
    />
    <DoitnowSkeleton
      v-if="isLoadingDoits"
    />
    <DoitnowLimit
      v-else-if="showLimitMessage"
    />
    <transition
      v-else-if="tasksCount"
      name="slide-in-fade-out"
      @before-enter="onStartAnimation"
      @after-leave="onEndAnimation"
    >
      <div
        :key="firstTask.uid"
        class="flex justify-between gap-[20px]"
      >
        <div class="grow overflow-hidden">
          <DoitnowSlide
            v-if="isSlide"
            :name="firstTask.name"
            :is-animation-doitnow="isAnimationDoitnow"
            @next="nextTask"
          />
          <DoitnowReglament
            v-else-if="isReglament"
            :name="firstTask.name"
            :uid="firstTask.uid"
            :date="firstTask.lastDate"
            :last-change="firstTask.lastComment"
            :is-animation-doitnow="isAnimationDoitnow"
            @next="nextTask"
          />
          <DoitnowCard
            v-else-if="isCard"
            :is-animation-doitnow="isAnimationDoitnow"
            @next="nextTask"
          />
          <DoitnowTask
            v-else
            :task="firstTask"
            :childrens="childrens"
            :sub-tasks="subTasks"
            :colors="colors"
            :tags="tags"
            :user="user"
            :task-messages="taskMessages.slice().reverse()"
            :employees="employees"
            :is-animation-doitnow="isAnimationDoitnow"
            :projects="projects"
            :tasks-count="tasksCount"
            :is-task-messages-loading="isTaskMessagesLoading"
            @clickTask="onClickTask"
            @nextTask="nextTask"
            @changeValue="changeValue"
            @readTask="readTask"
          />
        </div>
      </div>
    </transition>
    <DoitnowEmpty
      v-else
      class="ml-0 pt-[15px] z-[2] grow"
    />
  </div>
</template>

<script>
import * as FILES from '@/store/actions/taskfiles.js'
import * as MSG from '@/store/actions/taskmessages.js'
import * as TASK from '@/store/actions/tasks.js'
import * as CARD from '@/store/actions/cards.js'

import DoitnowCard from '@/components/Doitnow/DoitnowCard.vue'
import DoitnowSlide from '@/components/Doitnow/DoitnowSlide.vue'
import DoitnowEmpty from '@/components/Doitnow/DoitnowEmpty.vue'
import DoitnowTask from '@/components/Doitnow/DoitnowTask.vue'
import DoitnowSkeleton from '@/components/Doitnow/DoitnowSkeleton.vue'
import NavBar from '@/components/Navbar/NavBar.vue'

import DoitnowReglament from './Doitnow/DoitnowReglament.vue'
import DoitnowLimit from '@/components/Doitnow/DoitnowLimit'

export default {
  components: {
    DoitnowCard,
    DoitnowSlide,
    DoitnowLimit,
    DoitnowEmpty,
    DoitnowSkeleton,
    DoitnowTask,
    DoitnowReglament,
    NavBar
  },
  data () {
    return {
      childrens: [],
      isTaskMessagesLoading: false,
      isLoadingDoits: false,
      isAnimationDoitnow: false
    }
  },
  computed: {
    cards () {
      return this.$store.state.doitnow.cards
    },
    unreadTasks () {
      return this.$store.state.doitnow.unreadTasks
    },
    todayTasks () {
      return this.$store.state.doitnow.todayTasks
    },
    readyTasks () {
      return this.$store.state.doitnow.readyTasks
    },
    greetingSlides () {
      return this.$store.state.doitnow.greetingSlides
    },
    reglaments () {
      return this.$store.state.doitnow.reglaments
    },
    tasksCount () {
      return (
        this.greetingSlides?.length +
        this.unreadTasks?.length +
        this.readyTasks?.length +
        this.todayTasks?.length +
        this.reglaments?.length +
        this.cards?.length
      )
    },
    firstTask () {
      if (this.greetingSlides.length) {
        return this.$store.state.doitnow?.greetingSlides[0]
      }
      if (this.reglaments.length) {
        return this.$store.state.doitnow?.reglaments[0]
      }
      if (this.cards.length) {
        return this.$store.state.doitnow?.cards[0]
      }
      if (this.unreadTasks.length) {
        return this.$store.state.doitnow?.unreadTasks[0]
      }
      if (this.readyTasks.length) {
        return this.$store.state.doitnow?.readyTasks[0]
      }
      if (this.todayTasks.length) {
        return this.$store.state.doitnow?.todayTasks[0]
      }
      return null
    },
    taskMessages () {
      return this.$store.state.taskfilesandmessages.messages
    },
    employees () {
      return this.$store.state.employees.employees
    },
    projects () {
      return this.$store.state.projects.projects
    },
    colors () {
      return this.$store.state.colors.colors
    },
    tags () {
      return this.$store.state.tasks.tags
    },
    user () {
      return this.$store.state.user.user
    },
    subTasks () {
      return this.$store.state.tasks.subtasks.tasks
    },
    isSlide () {
      return this.firstTask?.mode === 'slide'
    },
    isReglament () {
      return !!this.firstTask?.notify
    },
    isCard () {
      return !!this.firstTask?.uid_board
    },
    justRegistered () {
      return this.$store.state.onboarding.justRegistered
    },
    showLimitMessage () {
      const tarif = this.$store.state.user.user.tarif
      return (tarif !== 'alpha' && tarif !== 'trial') || this.$store.getters.isLicenseExpired
    }
  },
  watch: {
    firstTask (newtask) {
      if (newtask && newtask.uid && !this.isReglament && !newtask.mode) {
        this.isTaskMessagesLoading = true
        this.$store.dispatch(TASK.GET_TASK_CHILDRENS, newtask.uid)
          .then((resp) => {
            this.childrens = resp.data.tasks
          })
        this.$store.commit(TASK.SELECT_TASK, newtask)
        this.$store.dispatch(MSG.MESSAGES_REQUEST, newtask.uid)
          .then(() => {
            this.$store.dispatch(FILES.FILES_REQUEST, newtask.uid)
              .then(() => {
                this.$store.dispatch(MSG.INSPECTOR_MESSAGES_REQUEST, newtask.uid)
                  .then(() => {
                    this.$store.commit(FILES.MERGE_FILES_WITH_MESSAGES)
                  }).finally(() => {
                    this.isTaskMessagesLoading = false
                  })
              })
          })
          .catch(() => {
            this.isNextTaskLoading = false
          })
        this.$store.dispatch(MSG.INSPECTOR_MESSAGES_REQUEST, newtask.uid)
        this.$store.dispatch(TASK.SUBTASKS_REQUEST, newtask.uid)
      }
    }
  },
  mounted: function () {
    this.loadAll()
    this.$store.dispatch('fullScreenToggle', 'add')
  },
  unmounted: function () {
    this.$store.dispatch('REGLAMENTS_CLEAR')
  },
  methods: {
    async loadAll () {
      this.isLoadingDoits = true
      //
      try {
      // получаем карточки
        this.$store.state.doitnow.cards = await this.$store.dispatch(CARD.DOITNOW_CARDS_REQUEST)
        // ждем пока сгенерируются регламенты
        // потом их получаем
        await this.$store.dispatch('REGLAMENTS_GENERATE')
        // получаем слайды (только если мы только что зарегились)
        if (this.justRegistered) {
          const currDate = new Date()
          const storeSlides = this.$store.state.doitnow.slides
          this.$store.state.doitnow.greetingSlides = storeSlides.filter(slide => !!slide.visible && (new Date(slide.reminder) <= currDate))
        }
        // получаем задачи
        const [tasksUnread, tasksOwerdue, tasksToday, tasksReady] = await this.$store.dispatch(TASK.DOITNOW_TASKS_REQUEST)
        const currentUserUid = this.user?.current_user_uid
        const unreadDelegateByMe = tasksUnread.filter(task => task.uid_customer === currentUserUid)
        const unreadDelegateToMe = tasksUnread.filter(task => task.uid_customer !== currentUserUid && task.uid_performer === currentUserUid)
        // заполняем главные массивы задач очереди
        this.$store.state.doitnow.unreadTasks = [
        // в массив не попали непрочитанные расшаренные мне задачи
        // только задачи с которыми я связан как заказчик или исполнитель
          ...unreadDelegateByMe,
          ...unreadDelegateToMe
        ]
        this.$store.state.doitnow.readyTasks = [...tasksReady]
        this.$store.state.doitnow.todayTasks = [
          ...tasksOwerdue, // просроченные
          ...tasksToday // сегодня
        ]
      } catch (e) {
        // очищаем все массивы, как буд-то очередь пустая
        // (по хорошему нужно сделать на экране сообщение - не удалось загрузить, кнопка попробовать еще раз)
        this.$store.state.doitnow.greetingSlides = []
        this.$store.state.doitnow.unreadTasks = []
        this.$store.state.doitnow.readyTasks = []
        this.$store.state.doitnow.todayTasks = []
        this.$store.state.doitnow.reglaments = []
        this.$store.state.doitnow.cards = []
        // репортим ошибку
        console.log('Doitnow loadAll error', e)
      }
      //
      this.isLoadingDoits = false
    },
    pad2 (n) {
      return (n < 10 ? '0' : '') + n
    },
    readTask () {
      this.$store.dispatch(TASK.CHANGE_TASK_READ, this.firstTask?.uid)
    },
    nextTask () {
      // Удаляем поппер 'Отложить', т.к из-за него ломается анимация
      document.querySelectorAll('.popper').forEach(popper => popper.remove())

      if (this.greetingSlides.length) {
        this.$store.state.doitnow.greetingSlides.shift()
        return
      }
      if (this.reglaments.length) {
        this.$store.state.doitnow.reglaments.shift()
        return
      }
      if (this.cards.length) {
        this.$store.state.doitnow.cards.shift()
        return
      }
      this.readTask()
      if (this.unreadTasks.length) {
        this.$store.state.doitnow.unreadTasks.shift()
        return
      }
      if (this.readyTasks.length) {
        this.$store.state.doitnow.readyTasks.shift()
        return
      }
      if (this.todayTasks.length) {
        this.$store.state.doitnow.todayTasks.shift()
      }
    },
    changeValue (objWithValues) {
      for (const elem in objWithValues) {
        this.firstTask[elem] = objWithValues[elem]
      }
    },
    onClickTask (task) {
      this.$store.commit('basic', { key: 'propertiesState', value: 'task' })
      this.$store.dispatch(TASK.SELECT_TASK, task)
      this.$store.dispatch('asidePropertiesToggle', true)
    },
    onStartAnimation () {
      this.isAnimationDoitnow = true
      this.$refs.doitnow.classList.toggle('slide-in-parent')
    },
    onEndAnimation () {
      this.isAnimationDoitnow = false
      this.$refs.doitnow.classList.toggle('slide-in-parent')
    }
  }
}
</script>

<style scoped>
.slide-in-fade-out-enter-from {
  transform: translateX(45px);
}

.slide-in-fade-out-enter-active {
  transition-delay: .4s;
  transition-property: opacity, transform;
  transition-duration: .4s;
}

.slide-in-fade-out-enter-from, .slide-in-fade-out-leave-to {
  opacity: 0;
}

.slide-in-fade-out-leave-active {
  transition-property: opacity, transform;
  transition-duration: .8s;
}

.slide-in-fade-out-leave-to {
  position: absolute;
  width: 100%;
}

.slide-in-parent {
  height: 100%;
  overflow: hidden;
  position: relative;
}
</style>
