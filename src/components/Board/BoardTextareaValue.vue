<template>
  <div class="w-full bg-white h-[41px] flex items-center rounded-[6px]">
    <textarea
      ref="inputValue"
      v-model="currentValue"
      type="text"
      class="rounded-[6px] border border-[#4c4c4d] focus:ring-0 focus:border-[#ff9123] h-[41px] w-full px-[14px] py-[11px] text-[14px] leading-[16px] text-[#4c4c4d] font-roboto resize-none"
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

<style scoped></style>
