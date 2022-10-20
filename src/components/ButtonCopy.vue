<template>
  <div
    class="flex align-middle grow-5 text-[13px] bg-[#F4F5F7] rounded-[6px] w-full"
  >
    <div class="flex-1 px-[11px] py-[13px] text-[#424242]">
      <span>{{ text }}</span>
    </div>
    <button
      class="flex-4 my-[5px] px-[11px] py-[6px] text-white border-2 bg-[#424242] rounded-[6px]"
      :class="{'bg-[#1CA345]': isCopied}"
      :disabled="isCopied"
      @click="onCopy"
    >
      <p
        v-if="!isCopied"
      >
        Копировать
      </p>
      <p
        v-else
      >
        Скопировано
      </p>
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
