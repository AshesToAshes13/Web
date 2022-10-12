<template>
  <div
    class="flex items-center mb-[8px]"
  >
    <div
      v-if="!employees[task.uid_customer]?.fotolink"
    >
      <svg
        class="rounded-lg ml-1 h-[20px] w-[20px]"
        width="20"
        height="20"
        viewBox="0 0 42 42"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          width="42"
          height="42"
          rx="8"
          fill="#ded9d9"
        />
        <path
          d="M15.75 14.583C15.75 17.4775 18.1055 19.833 21 19.833C23.8945 19.833 26.25 17.4775 26.25 14.583C26.25 11.6885 23.8945 9.33301 21 9.33301C18.1055 9.33301 15.75 11.6885 15.75 14.583ZM30.3333 31.4997H31.5V30.333C31.5 25.8308 27.8355 22.1663 23.3333 22.1663H18.6667C14.1633 22.1663 10.5 25.8308 10.5 30.333V31.4997H30.3333Z"
          fill="#ed3b18"
        />
      </svg>
    </div>
    <img
      v-else
      :alt="employees[task.uid_customer]?.name"
      :src="employees[task.uid_customer]?.fotolink"
      class="rounded-lg ml-1 h-[30px] w-[30px] border-2 border-[#f46868]"
    >
    <span class="ml-[8px] text-[#4C4C4D] text-[14px] font-[400]">{{ getByNameOrEmail(employees) }}</span>
  </div>
</template>
<script>
export default {
  props: {
    task: {
      type: Object,
      default: () => {}
    },
    employees: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    getByNameOrEmail (employees) {
      return employees[this.task.uid_customer]?.name || this.task?.email_customer
    }
  }
}
</script>
