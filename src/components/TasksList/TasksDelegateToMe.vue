<template>
  <div class="w-full">
    <NavBarTasks
      id="NavBarDelegateToMe"
      class="pt-[8px]"
      :title="'Поручено мне: ' + employeeName"
      @reload="reload"
    />
    <TasksListNew
      hide-input
    />
  </div>
</template>

<script>
import TasksListNew from '../TasksListNew.vue'
import NavBarTasks from '@/components/Navbar/NavBarTasks.vue'

import * as TASK from '@/store/actions/tasks'

export default {
  components: {
    TasksListNew,
    NavBarTasks
  },
  computed: {
    employeeUid () {
      return this.$route.params.employee_uid
    },
    employee () {
      // сделано так, потому что у нас могут быть поручения сотрудникам
      // не из нашей организации
      const emps = this.$store.state.navigator?.navigator?.new_delegate[1]?.items ?? []
      const emp = emps.find(emp => emp.uid === this.employeeUid)
      if (emp) return emp
      //
      const emps2 = this.$store.state.navigator?.navigator?.delegate_to_me?.items ?? []
      const emp2 = emps2.find(emp => emp.uid === this.employeeUid)
      if (emp2) return emp2
      //
      const emps3 = this.$store.state.employees?.employees ?? {}
      return emps3[this.employeeUid]
    },
    employeeName () {
      return this.employee?.name ?? '???'
    }
  },
  watch: {
    employeeUid: {
      handler: function (val) {
        if (val && this.$route.name === 'tasksDelegateToMe') this.selectAnotherEmployee(val)
      }
    }
  },
  mounted () {
    this.reload()
  },
  methods: {
    selectAnotherEmployee (uid) {
      this.$store.dispatch(TASK.ACTION_GET_TASK_DELEGATE_ME, uid)
    },
    reload () {
      this.selectAnotherEmployee(this.employeeUid)
    }
  }
}
</script>
