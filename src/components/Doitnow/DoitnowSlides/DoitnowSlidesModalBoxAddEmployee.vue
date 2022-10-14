<template>
  <ModalBox
    title="Добавить сотрудника"
    ok="Добавить"
    @ok="onSave"
    @cancel="onCancel"
  >
    <div class="grow gap-[15px] flex flex-col">
      <p class="w-full text-[13px] leading-[18px] text-[#4c4c4d] font-roboto font-medium">
        Имя сотрудника:
      </p>
      <input
        ref="inputValueName"
        v-model="currentValueName"
        maxlength="50"
        type="text"
        class="bg-[#f4f5f7]/50 rounded-[6px] focus:ring-0 border border-black/12 focus:border-[#ff9123] w-full px-[14px] py-[11px] text-[14px] leading-[16px] text-[#4c4c4d] font-roboto"
        @keyup.enter="onNext"
        @keyup.esc="onCancel"
      >
      <div>Осталось символов: {{ symbolsRemain }}</div>
      <p class="w-full text-[13px] leading-[18px] text-[#4c4c4d] font-roboto font-medium">
        Email:
      </p>
      <input
        ref="inputValueEmail"
        v-model="currentValueEmail"
        type="text"
        class="bg-[#f4f5f7]/50 rounded-[6px] focus:ring-0 border border-black/12 focus:border-[#ff9123] w-full px-[14px] py-[11px] text-[14px] leading-[16px] text-[#4c4c4d] font-roboto"
        @keyup.enter="onSave"
        @keyup.esc="onCancel"
      >
      <p
        v-if="showEmailError"
        class="text-red-500"
      >
        Неверный формат электронной почты
      </p>
      <p
        v-if="showError"
        class="text-red-500"
      >
        Для добавления сотрудника заполните все поля
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
    show: {
      type: Boolean,
      default: false
    }
  },
  emits: ['cancel', 'save'],
  data: () => ({
    currentValueName: '',
    currentValueEmail: '',
    showError: false,
    showEmailError: false
  }),
  computed: {
    symbolsRemain () {
      return 50 - this.currentValueName.length
    }
  },
  watch: {
    show: {
      immediate: true,
      handler: function (val) {
        if (val) {
          this.currentValueName = ''
          this.currentValueEmail = ''
          this.$nextTick(function () {
            this.$refs.inputValueName.focus({ preventScroll: false })
          })
        }
      }
    }
  },
  methods: {
    validateEmail () {
      if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/.test(this.currentValueEmail)) {
        return true
      }
      return false
    },
    onCancel () {
      if (this.show) this.$emit('cancel')
    },
    onSave () {
      if (this.currentValueName.length === 0 || this.currentValueEmail.length === 0) {
        this.showError = true
        this.showEmailError = false
        return
      }
      this.showError = false
      if (this.validateEmail() && this.show) {
        this.$emit('save', this.currentValueName, this.currentValueEmail)
      } else {
        this.showError = false
        this.showEmailError = true
      }
    },
    onNext () {
      if (this.show) {
        this.$nextTick(function () {
          this.$refs.inputValueEmail.focus({ preventScroll: false })
        })
      }
    }
  }
}
</script>

<style scoped></style>
