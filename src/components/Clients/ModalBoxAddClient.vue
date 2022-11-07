<template>
  <ModalBox
    :title="title"
    @cancel="onCancel"
  >
    <form
      class="flex flex-col w-full gap-[12px]"
      @submit.prevent="onSave"
    >
      <p>
        <span class="mb-1">Имя</span>
        <input
          ref="inputValue"
          v-model="name"
          name="name"
          type="text"
          :maxLength="maxLengthInput"
          class="bg-[#f4f5f7]/50 rounded-[6px] focus:ring-0 border w-full px-[14px] py-[11px] text-[14px] leading-[16px] text-[#4c4c4d] font-roboto"
          :class="onValidateField('name')"
        >
        <span
          v-if="!validationInputs.name"
          class="text-[11px] text-[#dc2626]"
        >Обязательное для заполнения</span>
      </p>
      <p>
        <span class="mb-1">Телефон</span>
        <input
          ref="phone"
          v-model="phone"
          v-maska="'+7 (###) ###-##-##'"
          type="text"
          name="phone"
          :maxLength="maxLengthInput"
          class="bg-[#f4f5f7]/50 rounded-[6px] focus:ring-0 border w-full px-[14px] py-[11px] text-[14px] leading-[16px] text-[#4c4c4d] font-roboto"
          :class="onValidateField('phone')"
          @paste="replacePhoneNumber"
        >
        <span
          v-if="!validationInputs.phone"
          class="text-[11px] text-[#dc2626]"
        >Обязательное для заполнения</span>
      </p>
      <p>
        <span class="mb-1">Email</span>
        <input
          v-model="email"
          type="text"
          name="email"
          class="bg-[#f4f5f7]/50 rounded-[6px] focus:ring-0 w-full px-[14px] py-[11px] text-[14px] leading-[16px] text-[#4c4c4d] font-roboto border"
          :class="onValidateField('email')"
        >
        <span
          v-if="!validationInputs.email"
          class="text-[11px] text-[#dc2626]"
        >Обязательное для заполнения</span>
      </p>
      <p>
        <span class="mb-1">Комментарий</span>
        <input
          v-model="comment"
          name="comment"
          type="text"
          class="bg-[#f4f5f7]/50 rounded-[6px] focus:ring-0 border border-[#4c4c4d] focus:border-[#ff9123] w-full px-[14px] py-[11px] text-[14px] leading-[16px] text-[#4c4c4d] font-roboto"
        >
      </p>
      <input
        value="Сохранить"
        type="submit"
        class="focus:ring min-w-[90px] focus:outline-none inline-flex cursor-pointer whitespace-nowrap justify-center items-center duration-150 px-[12px] py-[10px] rounded-md bg-[#ff9123] text-white text-[13px] leading-[15px] font-medium font-roboto disabled:opacity-70 disabled:cursor-default"
      >
    </form>
  </ModalBox>
</template>

<script>
import ModalBox from '@/components/modals/ModalBox.vue'
import { uuidv4 } from '@/helpers/functions'
import { maska } from 'maska'

export default {
  directives: {
    maska
  },
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
    cardEmail: {
      type: String,
      default: ''
    },
    cardPhone: {
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
    name: '',
    phone: '',
    email: '',
    comment: '',
    validationInputs: {
      name: true,
      phone: true,
      email: true
    }
  }),
  computed: {
    maxLengthInput () {
      return '50'
    },
    validateForm () {
      return !this.validateNameField || !this.validatePhoneField || !this.validateEmailField
    },
    validateNameField () {
      const minNameLength = 0
      const maxNameLength = 50

      return this.name.length > minNameLength && this.name.length < maxNameLength
    },
    validatePhoneField () {
      return this.phone.length === 18
    },
    validateEmailField () {
      return String(this.email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    }
  },
  mounted () {
    if (this.cardPhone) {
      if ((this.cardPhone.startsWith('8') || this.cardPhone.startsWith('7')) && this.cardPhone.length === 11) {
        this.phone = this.cardPhone.substr(1)
      }
      if (this.cardPhone.startsWith('+7') && this.cardPhone.length === 12) {
        this.phone = this.cardPhone.substr(2)
      }
    }
    this.email = this.cardEmail ? this.cardEmail : ''
  },
  methods: {
    onCancel () {
      this.$emit('cancel')
    },
    onSave () {
      this.validationInputs.name = this.validateNameField
      this.validationInputs.phone = this.validatePhoneField
      this.validationInputs.email = this.validateEmailField

      if (!this.validateForm) {
        const data = {
          uid: uuidv4(),
          name: this.name,
          phone: '+7' + this.$refs.phone.dataset.maskRawValue,
          email: this.email,
          comment: this.comment,
          date_create: new Date().toLocaleString()
        }
        this.$emit('save', data)
      }
    },
    onValidateField (key) {
      const defaultClass = 'border-[#4c4c4d] focus:border-[#ff9123]'
      const errorClass = 'border-rose-500 focus:border-rose-500'
      const { name, phone, email } = this.validationInputs

      switch (key) {
        case 'name':
          return !name ? errorClass : defaultClass
        case 'phone':
          return !phone ? errorClass : defaultClass
        case 'email':
          return !email ? errorClass : defaultClass
        default:
          return defaultClass
      }
    },
    replacePhoneNumber (e) {
      const text = (e.clipboardData || window.clipboardData).getData('text').split('')

      if (text.length === 11 && text[0] === '8') {
        e.preventDefault()
        text.splice(0, 1)
        const number = [text.splice(0, 3), text.splice(0, 3), text.splice(0, 2), text.splice(0, 2)]
        // Формируем номер телефона по v-maska
        this.phone = `+7 (${number[0].join('')}) ${number[1].join('')}-${number[2].join('')}-${number[3].join('')}`
      }
    }
  }
}
</script>

<style scoped></style>
