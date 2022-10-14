<template>
  <button
    v-if="text !== ''"
    class="w-[238px] h-[40px] justify-center cursor-pointer bg-[#F2B679] text-[#2E2E2E] text-[14px] px-10 rounded-md hover:bg-slate-200 hover:text-[#422b14] font-medium"
  >
    {{ text }}
  </button>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: ''
    }
  }
}
</script>
