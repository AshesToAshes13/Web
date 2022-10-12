<template>
  <div class="flex items-center">
    <div class="border-2 border-[#dfdfdf] rounded-l-[5px] px-[5px] h-[29px]">
      <span class="font-roboto text-[13px]">
        {{ text }}
      </span>
    </div>
    <button
      class="px-[5px] h-[29px] border-2 border-[#dfdfdf] border-l-0 rounded-r-[5px] disabled:opacity-100 bg-[#f4f5f7]"
      :disabled="isCopied"
      @click="onCopy"
    >
      <svg
        v-if="!isCopied"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12.9576 5.00606H3.93939C2.87273 5.00606 2 5.87879 2 6.94545V16.0606C2 17.1273 2.87273 18 3.93939 18H13.0545C14.1212 18 14.9939 17.1273 14.9939 16.0606V6.94545C14.8 5.87879 14.0242 5.00606 12.9576 5.00606ZM3.64848 6.94545C3.64848 6.84848 3.74545 6.65455 3.93939 6.65455H13.0545C13.1515 6.65455 13.3455 6.75152 13.3455 6.94545V16.0606C13.3455 16.1576 13.2485 16.3515 13.0545 16.3515H3.93939C3.84242 16.3515 3.64848 16.2545 3.64848 16.0606V6.94545Z"
          fill="#757575"
        />
        <path
          d="M15.9636 2H6.36364C5.29697 2 4.42424 2.87273 4.42424 3.93939C4.42424 4.42424 4.81212 4.81212 5.29697 4.81212C5.78182 4.81212 6.1697 4.42424 6.1697 3.93939C6.1697 3.84242 6.26667 3.64848 6.46061 3.64848H16.0606C16.1576 3.64848 16.3515 3.74545 16.3515 3.93939V13.5394C16.3515 13.6364 16.2545 13.8303 16.0606 13.8303C15.5758 13.8303 15.1879 14.2182 15.1879 14.703C15.1879 15.1879 15.5758 15.5758 16.0606 15.5758C17.1273 15.5758 18 14.703 18 13.6364V3.84242C17.903 2.87273 17.0303 2 15.9636 2Z"
          fill="#757575"
        />
      </svg>
      <svg
        v-else
        width="20"
        height="20"
        viewBox="0 0 16 16"
        version="1.1"
      >
        <path
          fill="#757575"
          fill-rule="evenodd"
          d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"
        />
      </svg>
    </button>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      isCopied: false
    }
  },
  methods: {
    onCopy () {
      this.isCopied = true
      navigator.clipboard.writeText(this.text)
      setTimeout(() => {
        this.isCopied = false
      }, 2000)
    }
  }
}
</script>

<style scoped></style>
