<template>
  <div class="w-full">
    <div>
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

export default {
  components: {
    TasksListNew,
    NavBarTasks
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
    }
  }
}
</script>
