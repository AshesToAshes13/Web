<template>
  <Popper
    class="light overflow-hidden"
    placement="left"
    :disabled="taskType !== 1 && taskType !== 2 && taskType !== 3"
  >
    <DoitnowRightButton
      :title="title"
      icon="perform"
      @click="setPerformerCurrentUserIfNeed"
    />
    <template
      #content="{ close }"
      class="bottom"
    >
      <div
        class="text-white body-popover-custom"
        @click="close"
      >
        <div class="container-employee-popover">
          <div
            v-if="isEmployeesInOrg"
          >
            <div
              v-for="emp in orgEmployees"
              :key="emp.uid"
            >
              <div
                v-if="emp.uid !== currentUserUid"
                class="list-employee-access"
                @click="changePerformer(emp.email)"
              >
                <img
                  :src="emp.fotolink"
                  class="mr-1 border-fotolink border-solid border-2 border-sky-500"
                  width="30"
                  height="30"
                >
                <label class="employee-name-custom">
                  {{ emp.name }}
                  <div class="popover-employee-email">{{ emp.email }}</div>
                </label>
                <span
                  v-if="isCurrentPerformerEmail(emp.email)"
                  class="inline-flex justify-center items-center"
                >
                  <svg
                    viewBox="0 0 26 20"
                    width="10"
                    height="10"
                    class="inline-block"
                  >
                    <path
                      fill="currentColor"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M24.4107 1.30299C25.2766 2.02718 25.3681 3.2892 24.6148 4.1218L11.8142 18.2718C10.8103 19.3815 9.06094 19.4991 7.9062 18.5344L0.902667 12.6839C0.0362917 11.9601 -0.0558157 10.6982 0.69694 9.86518C1.44969 9.0322 2.76226 8.94364 3.62864 9.66738L9.58691 14.6447L21.4789 1.49931C22.2321 0.666707 23.5447 0.578813 24.4107 1.30299Z"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </div>
          <div
            v-else-if="!isEmployeesInOrg"
          >
            <p
              class="w-[300px]"
            >
              Список сотруников, которым Вы можете поручить задачу пуст. Необходимо создать сотрудника. Для этого перейдите во вкладку сверху под названием
              <span class="font-bold">"Справочники"</span>  и в левом меню зайдите на страницу <span class="font-bold">"Сотрудники"</span>. Нажмите на <span class="font-bold">"+"</span>   и введите данные сотрудника. Этому сотруднику придет приглашение.
            </p>
          </div>
        </div>
      </div>
    </template>
  </Popper>
</template>

<script>
import Popper from 'vue3-popper'
import DoitnowRightButton from '@/components/Doitnow/DoitnowRightButton.vue'

export default {
  components: {
    DoitnowRightButton,
    Popper
  },
  props: {
    currentUserUid: {
      type: String,
      default: ''
    },
    performerEmail: {
      type: String,
      default: ''
    },
    taskType: {
      type: Number,
      default: 0
    }
  },
  emits: ['reAssign', 'changePerformer'],
  computed: {
    title () {
      if (this.taskType === 1) return 'Поручить'
      if (this.taskType === 2) return 'Изменить исполнителя'
      if (this.taskType === 3) return 'Перепоручить'
      if (this.taskType === 5) return 'Взять на исполнение'
      return ''
    },
    orgEmployees () {
      return this.$store.state.navigator.navigator.emps.items
    },
    employeesByEmail () {
      return this.$store.state.employees.employeesByEmail
    },
    isEmployeesInOrg () {
      return this.orgEmployees.length > 1
    }
  },
  methods: {
    getEmpNameByEmail (userEmail) {
      return this.employeesByEmail[userEmail.toLowerCase()]?.name ?? userEmail
    },
    isCurrentPerformerEmail (userEmail) {
      return this.performerEmail.toLowerCase() === userEmail.toLowerCase()
    },
    setPerformerCurrentUserIfNeed () {
      if (this.taskType !== 5) return
      // ставим исполнителем себя
      const currentUserEmail = this.$store.state.employees.employees[this.currentUserUid]?.email
      this.changePerformer(currentUserEmail)
    },
    changePerformer (userEmail) {
      if (this.isCurrentPerformerEmail(userEmail)) return
      if (this.taskType === 3) {
        this.$emit('reAssign', userEmail)
        return
      }
      this.$emit('changePerformer', userEmail)
    }
  }
}
</script>

<style scoped>
.light {
  --popper-theme-background-color: #ffffff;
  --popper-theme-background-color-hover: #ffffff;
  --popper-theme-text-color: #444444;
  --popper-theme-border-width: 0px;
  --popper-theme-border-style: solid;
  --popper-theme-border-radius: 8px;
  --popper-theme-padding: 10px 10px;
  --popper-theme-box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.1), 0px 3px 5px rgba(0, 0, 0, 0.12);
}
</style>
