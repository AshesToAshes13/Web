<template>
  <div
    class="flex rounded-[4px] bg-[#ef7665] text-white text-[12px] px-[8px] gap-x-[5px] items-center"
  >
    <span class="shrink-0">
      Просрочено:
    </span>
    <span class="font-medium">{{ isTaskHaveOverdueTime }}</span>
  </div>
</template>
<script>
export default {
  props: {
    isTaskHaveOverdueTime: {
      type: String,
      default: ''
    }
  }
}
</script>
