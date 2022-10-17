<template>
  <div class="w-full">
    <TaskListUnboardingCard
      v-if="displayModalTasks"
      @ok="okToModal"
    />
    <div
      v-else
    >
      <NavBarTasks
        id="NavBarToday"
        class="pt-[8px]"
        title="Сегодня"
        @reload="reload"
      />
      <TasksListNew
        :new-task-props="newTaskProps"
      />
    </div>
  </div>
</template>

<script>
import TasksListNew from '../TasksListNew.vue'
import NavBarTasks from '@/components/Navbar/NavBarTasks.vue'
import TaskListUnboardingCard from './TaskListUnboardingCard.vue'
import { USER_VIEWED_MODAL } from '@/store/actions/onboarding.js'

export default {
  components: {
    TasksListNew,
    NavBarTasks,
    TaskListUnboardingCard
  },
  data () {
    return {
      date: new Date()
    }
  },
  computed: {
    newTaskProps () {
      return ({
        date_begin: this.getDateString(this.date) + 'T00:00:00',
        date_end: this.getDateString(this.date) + 'T23:59:59'
      })
    },
    displayModalTasks () {
      return !this.$store.state.onboarding.visitedModals?.includes('tasks') && this.$store.state.onboarding.showModals
    }
  },
  mounted () {
    this.reload()
  },
  methods: {
    pad2 (n) {
      return (n < 10 ? '0' : '') + n
    },
    getDateString (date) {
      const month = this.pad2(date.getMonth() + 1)
      const day = this.pad2(date.getDate())
      const year = this.pad2(date.getFullYear())
      return year + '-' + month + '-' + day
    },
    reload () {
      this.$store.dispatch('TASKS_REQUEST', new Date(this.date))
    },
    okToModal () {
      this.$store.commit(USER_VIEWED_MODAL, 'tasks')
    }
  }
}
</script>
