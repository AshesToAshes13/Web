<template>
  <div
    class="taskName text-[#424242] leading-[25px] p-2 ring-0 outline-none max-w-7xl mt-0.5 ml-1 w-full md:text-[20px] lg:text-[25px] font-bold mb-[28px]"
  >
    {{ title }}
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>
