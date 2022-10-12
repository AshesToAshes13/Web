<template>
  <div
    class="flex items-center"
  >
    <img
      :alt="employees[task.uid_performer]?.name"
      :src="employees[task.uid_performer] ? employees[task.uid_performer]?.fotolink : ''"
      class="rounded-lg ml-1 h-[30px] w-[30px] border-2 border-[#1ca345]"
    >
    <span class="ml-[8px] text-[#4C4C4D] text-[14px] font-[400]">{{ employees[task.uid_performer]?.name }}</span>
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
  }
}
</script>
