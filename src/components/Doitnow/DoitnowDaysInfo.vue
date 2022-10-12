<template>
  <div
    class="flex items-center gap-x-[5px] rounded-[4px] bg-[#F4F5F7] px-[8px] py-[4px] text-[#4C4C4D] text-[12px] font-[500] font-medium"
  >
    <span>Срок:</span>
    <span>{{ dateClearWords }}</span>
  </div>
</template>
<script>
export default {
  props: {
    dateClearWords: {
      type: String,
      default: ''
    }
  }
}
</script>
