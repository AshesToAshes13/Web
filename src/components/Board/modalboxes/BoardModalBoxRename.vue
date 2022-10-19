<template>
  <ModalBox
    :title="title"
    ok="Сохранить"
    @ok="onSave"
    @cancel="onCancel"
  >
    <div class="flex flex-col w-full">
      <input
        ref="inputValue"
        v-model="currentValue"
        type="text"
        class="bg-[#f4f5f7]/50 rounded-[6px] focus:ring-0 border border-[#4c4c4d] focus:border-[#ff9123] w-full px-[14px] py-[11px] text-[14px] leading-[16px] text-[#4c4c4d] font-roboto"
        @keyup.enter="onSave"
        @keyup.esc="onCancel"
      >
      <p
        v-if="showError"
        class="mt-2 mb-[-15px] text-red-500"
      >
        Поле не должно быть пустым
      </p>
    </div>
  </ModalBox>
</template>

<script>
import ModalBox from '@/components/modals/ModalBox.vue'

export default {
  components: {
    ModalBox
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  emits: ['cancel', 'save'],
  data: () => ({
    currentValue: '',
    showError: false
  }),
  watch: {
    show: {
      immediate: true,
      handler: function (val) {
        if (val) {
          this.currentValue = this.value
          this.$nextTick(function () {
            this.$refs.inputValue.focus({ preventScroll: false })
          })
        }
      }
    }
  },
  methods: {
    onCancel () {
      if (this.show) this.$emit('cancel')
    },
    onSave () {
      if (this.currentValue.length === 0) {
        this.showError = true
        return
      }
      if (this.show) {
        this.$emit('save', this.currentValue)
        this.showError = false
      }
    }
  }
}
</script>

<style scoped></style>
