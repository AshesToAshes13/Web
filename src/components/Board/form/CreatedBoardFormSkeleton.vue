<template>
  <div
    class="flex justify-center h-full"
    :class="!frameMode && 'items-center'"
  >
    <div
      class="animate-pulse max-w-[400px] p-[25px] grow-0"
      :class="!frameMode && 'bg-[#F9F9F9] shadow-2xl'"
    >
      <div class="bg-[#EAEAEA] mx-auto rounded-[10px] w-[230px] h-[15px] mb-[20px]" />
      <div class="bg-[#EAEAEA] mx-auto rounded-[10px] w-[350px] h-[37px] mb-[12px]" />
      <div class="bg-[#EAEAEA] mx-auto rounded-[10px] w-[350px] h-[37px] mb-[12px]" />
      <div class="bg-[#EAEAEA] mx-auto rounded-[10px] w-[350px] h-[37px] mb-[12px]" />
      <div class="bg-[#EAEAEA] mx-auto rounded-[10px] w-[350px] h-[37px] mb-[12px]" />
      <div class="bg-[#ff9123] mx-auto rounded-[10px] w-[350px] h-[35px] mb-[12px]" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    frameMode: {
      type: Boolean,
      default: false
    }
  }
}
</script>
