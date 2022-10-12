<template>
  <div class="w-full bg-white min-h-[41px] flex items-center rounded-[6px]">
    <textarea
      ref="inputValue"
      v-model="currentValue"
      type="text"
      class="scroll-style rounded-[6px] border border-[#4c4c4d] focus:ring-0 focus:border-[#ff9123] min-h-[41px] w-full px-[14px] py-[11px] text-[14px] leading-[16px] text-[#4c4c4d] font-roboto resize-none"
      :maxlength="maxlength"
      @keyup.enter="onSave"
      @keyup.esc="onCancel"
      @blur="onSave"
    />
  </div>
</template>

<script>

export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    show: {
      type: Boolean,
      default: false
    },
    maxlength: {
      type: String,
      default: null
    }
  },
  emits: ['cancel', 'save'],
  data: () => ({
    currentValue: '',
    emittedOnce: false
  }),
  watch: {
    show: {
      immediate: true,
      handler: function (val) {
        if (val) {
          this.currentValue = this.value
          this.emittedOnce = false
          this.$nextTick(function () {
            this.$refs.inputValue.focus({ preventScroll: false })
          })
        }
      }
    }
  },
  methods: {
    onCancel () {
      if (this.show && !this.emittedOnce) {
        this.emittedOnce = true
        this.$emit('cancel')
      }
    },
    onSave () {
      const text = this.currentValue.trim()
      if (!text) return this.onCancel()
      if (this.show && !this.emittedOnce) {
        this.emittedOnce = true
        this.$emit('save', text)
      }
    }
  }
}
</script>

<style scoped>
.scroll-style::-webkit-scrollbar {
  width: 15px;
  height: 14px;
}

.scroll-style::-webkit-scrollbar-thumb {
  border: 4px solid transparent;
  border-radius: 9999px;
  background-clip: padding-box;
  background-color: rgb(215 215 215);
}

.scroll-style::-webkit-scrollbar-thumb:hover {
  background-color: rgb(190 190 190);
}
</style>
