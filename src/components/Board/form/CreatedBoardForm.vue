<template>
  <div
    class="w-full h-screen overflow-auto flex items-center justify-center"
    :class="isFrame && 'bg-white'"
  >
    <CreatedBoardFormSkeleton
      v-if="!formIsLoaded"
      :frame-mode="isFrame"
    />
    <div
      v-if="!showFormSended && formIsLoaded"
      class="flex justify-center max-w-[400px] mx-auto"
      :class="!isFrame && 'items-center'"
    >
      <div
        class="flex flex-col w-full p-[25px]"
        :class="!isFrame && 'bg-[#F9F9F9] shadow-2xl'"
      >
        <h1
          :title="item.title"
          class="mb-[15px] text-[30px] text-center text-[#777] shrink-0 w-[350px] min-h-[30px]"
          style="word-break: break-word"
          :class="{'truncate': isFrame}"
        >
          {{ item.title }}
        </h1>
        <input
          v-if="showInput1"
          v-model="modelInput1"
          :placeholder="item.inputs.input1"
          type="text"
          name="name"
          class="bg-[#f4f5f7]/50 rounded-[6px] border border-[#4c4c4d] focus:border-[#ff9123] w-full mb-3 px-[14px] py-[11px] text-[14px] leading-[16px] text-[#4c4c4d] font-roboto"
          :class="inputsValidateError && modelInput1.length < 1 ? 'border-red-500' : 'border-[#4c4c4d]'"
        >
        <input
          v-if="showInput2"
          v-model="modelInput2"
          :placeholder="item.inputs.input2"
          type="text"
          name="email"
          class="bg-[#f4f5f7]/50 rounded-[6px] border border-[#4c4c4d] focus:border-[#ff9123] w-full mb-3 px-[14px] py-[11px] text-[14px] leading-[16px] text-[#4c4c4d] font-roboto"
          :class="inputsValidateError && modelInput2.length < 1 ? 'border-red-500' : 'border-[#4c4c4d]'"
        >
        <input
          v-if="showInput3"
          v-model="modelInput3"
          :placeholder="item.inputs.input3"
          type="text"
          name="phone"
          class="bg-[#f4f5f7]/50 rounded-[6px] border border-[#4c4c4d] focus:border-[#ff9123] w-full mb-3 px-[14px] py-[11px] text-[14px] leading-[16px] text-[#4c4c4d] font-roboto"
          :class="inputsValidateError && modelInput3.length < 1 ? 'border-red-500' : 'border-[#4c4c4d]'"
        >
        <input
          v-if="showInput4"
          v-model="modelInput4"
          :placeholder="item.inputs.input4"
          type="text"
          name="comment"
          class="bg-[#f4f5f7]/50 rounded-[6px] border focus:border-[#ff9123] w-full mb-3 px-[14px] py-[11px] text-[14px] leading-[16px] text-[#4c4c4d] font-roboto"
          :class="inputsValidateError && modelInput4.length < 1 ? 'border-red-500' : 'border-[#4c4c4d]'"
        >
        <template v-if="inputsValidateError">
          <p
            class="text-red-500 text-xs mb-3"
          >
            Форма не сохранена
          </p>
          <p
            class="text-red-500 text-xs mb-3"
          >
            Поля должны быть обязательно заполнены
          </p>
        </template>
        <button
          class="focus:ring min-w-[90px] focus:outline-none cursor-pointer whitespace-nowrap justify-center duration-150 px-[12px] py-[10px] rounded-md bg-[#ff9123] text-white text-[13px] leading-[15px] font-medium font-roboto block truncate"
          @click="submitForm"
        >
          {{ item.buttonText }}
        </button>
        <span class="mt-3 text-center text-gray-500 text-[14px]">Продолжая, вы соглашаетесь с условиями
          <a
            class="underline text-blue-500 hover:text-blue-800"
            :href="item.privacyPolicyHref"
            target="_blank"
          >Политики обработки персональных данных
          </a>
        </span>
      </div>
    </div>
    <div
      v-if="showFormSended && formIsLoaded"
      class="h-full flex items-center justify-center max-w-[600px] mx-auto"
    >
      <div class="flex justify-center items-center flex-col w-full rounded-[8px] bg-[#F9F9F9] p-[25px] shadow-2xl">
        <span>Форма успешно отправлена!</span>
        <span v-if="item.redirectLink && !isFrame">{{ !linkIsText ? 'Сейчас Вы будете перенаправлены.' : item.redirectLink }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import * as BOARD from '@/store/actions/boards'
import * as BOARD_FORMS from '@/store/actions/boardforms'
import CreatedBoardFormSkeleton from '@/components/Board/form/CreatedBoardFormSkeleton'

export default {
  components: { CreatedBoardFormSkeleton },
  data () {
    return {
      showFormSended: false,
      showInput1: true,
      showInput2: true,
      showInput3: true,
      showInput4: true,
      modelInput1: '',
      modelInput2: '',
      modelInput3: '',
      modelInput4: '',
      item: {
        title: '',
        buttonText: '',
        redirectLink: '',
        privacyPolicyHref: '',
        inputs: {
          input1: '',
          input2: '',
          input3: '',
          input4: ''
        }
      },
      formIsLoaded: false,
      errors: [],
      inputsValidateError: false
    }
  },
  computed: {
    boardForm () {
      return this.$store.state.boardforms.boardForm
    },
    isFrame () {
      return !!this.$route.query.frame
    },
    linkIsText () {
      const re = /(https?:\/\/[^\s]+)/g
      return !re.test(this.item.redirectLink)
    }
  },
  mounted () {
    this.$store.dispatch('fullScreenToggle', 'add')
    this.$store.dispatch(BOARD_FORMS.GET_BOARD_FORM_REQUEST, this.$route.params.board_id).then((res) => {
      const data = {
        uid_board: res.data[0].uid_board,
        info: res.data[0].info
      }
      this.$store.state.boardforms.boardForm = data
      this.item.title = this.boardForm.info.title
      this.item.redirectLink = this.boardForm.info.redirect_link
      this.item.privacyPolicyHref = this.boardForm.info.privacy_policy_href
      if (this.item.privacyPolicyHref === '') {
        this.item.privacyPolicyHref = 'https://www.leadertask.ru/privacy-policy'
      }
      this.item.buttonText = this.boardForm.info.button_text
      this.item.inputs.input1 = this.boardForm.info?.name.text
      this.item.inputs.input2 = this.boardForm.info?.email.text
      this.item.inputs.input3 = this.boardForm.info?.phone.text
      this.item.inputs.input4 = this.boardForm.info?.comment.text

      this.showInput1 = this.boardForm.info.name.visible
      this.showInput2 = this.boardForm.info.email.visible
      this.showInput3 = this.boardForm.info.phone.visible
      this.showInput4 = this.boardForm.info.comment.visible
      this.formIsLoaded = true
    })
  },
  methods: {
    getFormTitle () {
      if (this.modelInput1 === '') {
        return 'Карточка без названия'
      } else {
        return this.modelInput1
      }
    },
    submitForm () {
      this.validateForm()
      if (this.inputsValidateError) return
      const comment = `${this.item.inputs.input2}: ${this.modelInput2}\n ${this.item.inputs.input3}: ${this.modelInput3}\n ${this.item.inputs.input4}: ${this.modelInput4}`
      const data = {
        board_uid: this.$route.params.board_id,
        title: this.getFormTitle(),
        comment
      }
      this.$store.dispatch(BOARD.SEND_BOARD_FORM_REQUEST, data).then(() => {
        console.log('send success')
        if (this.item.redirectLink.length > 0) {
          this.showFormSended = true
          if (!this.linkIsText && !this.isFrame) {
            setTimeout(() => {
              window.location.href = this.item.redirectLink
            }, 5000)
          }
        } else {
          this.showFormSended = true
        }
      })
    },
    validateForm () {
      this.inputsValidateError = false
      if (this.modelInput1.length < 1 && this.boardForm.info?.name.visible === true) {
        this.inputsValidateError = true
        return
      }
      if (this.modelInput2.length < 1 && this.boardForm.info?.email.visible === true) {
        this.inputsValidateError = true
        return
      }
      if (this.modelInput3.length < 1 && this.boardForm.info?.phone.visible === true) {
        this.inputsValidateError = true
        return
      }
      if (this.modelInput4.length < 1 && this.boardForm.info?.comment.visible === true) {
        this.inputsValidateError = true
      }
    }
  }
}
</script>
