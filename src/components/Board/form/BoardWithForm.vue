<template>
  <NavBar
    class="pt-[8px]"
    title="Настройка формы"
  >
    <router-link :to="'/board/' + currentBoardId">
      <BoardSmallButton
        class="flex items-center px-[10px] py-[5px]"
        :icon="'back'"
      >
        Назад
      </BoardSmallButton>
    </router-link>
  </NavBar>
  <div class="flex flex-row">
    <BoardWithFormSkeleton v-if="!formIsLoaded" />
    <form
      v-else
      class="p-5 bg-white rounded-xl w-[30%] shrink-0 self-start"
    >
      <input
        v-model="form.title"
        class="bg-[#f4f5f7]/50 rounded-[6px] border border-[#4c4c4d] focus:ring-0 focus:border-[#ff9123] w-full px-[14px] py-[11px] text-[14px] leading-[16px] text-[#4c4c4d] font-roboto"
        name="title"
        placeholder="Заголовок формы"
        type="text"
        maxlength="100"
      >
      <div class="flex items-center my-[10px]">
        <FormCheckbox
          :is-checked="form.name.visible"
          class="mr-[10px]"
          @click="changeFiledVisible(form.name)"
        />
        <input
          v-model="form.name.text"
          class="bg-[#f4f5f7]/50 rounded-[6px] border focus:ring-0 focus:border-[#ff9123] w-full px-[14px] py-[11px] text-[14px] leading-[16px] text-[#4c4c4d] font-roboto"
          :class="errors.inputs.includes('name') ? 'border-red-500' : 'border-[#4c4c4d]'"
          name="name"
          placeholder="Имя"
          type="text"
        >
      </div>
      <div class="md:flex md:items-center my-[10px]">
        <FormCheckbox
          :is-checked="form.email.visible"
          class="mr-[10px]"
          @click="changeFiledVisible(form.email)"
        />
        <input
          v-model="form.email.text"
          class="bg-[#f4f5f7]/50 rounded-[6px] border focus:ring-0 focus:border-[#ff9123] w-full px-[14px] py-[11px] text-[14px] leading-[16px] text-[#4c4c4d] font-roboto"
          :class="errors.inputs.includes('email') ? 'border-red-500' : 'border-[#4c4c4d]'"
          name="email"
          placeholder="Емайл"
          type="text"
        >
      </div>
      <div class="md:flex md:items-center my-[10px]">
        <FormCheckbox
          :is-checked="form.phone.visible"
          class="mr-[10px]"
          @click="changeFiledVisible(form.phone)"
        />
        <input
          v-model="form.phone.text"
          class="bg-[#f4f5f7]/50 rounded-[6px] border focus:ring-0 focus:border-[#ff9123] w-full px-[14px] py-[11px] text-[14px] leading-[16px] text-[#4c4c4d] font-roboto"
          :class="errors.inputs.includes('phone') ? 'border-red-500' : 'border-[#4c4c4d]'"
          name="phone"
          placeholder="Телефон"
          type="text"
        >
      </div>
      <div class="md:flex md:items-center my-[10px]">
        <FormCheckbox
          :is-checked="form.comment.visible"
          class="mr-[10px]"
          @click="changeFiledVisible(form.comment)"
        />
        <input
          v-model="form.comment.text"
          class="bg-[#f4f5f7]/50 rounded-[6px] focus:ring-0 focus:border-[#ff9123] w-full px-[14px] py-[11px] text-[14px] leading-[16px] text-[#4c4c4d] font-roboto"
          :class="errors.inputs.includes('comment') ? 'border-red-500' : 'border-[#4c4c4d]'"
          name="comment"
          placeholder="Комментарий"
          type="text"
        >
      </div>
      <input
        v-model="form.button_text"
        class="bg-[#f4f5f7]/50 mb-[10px] rounded-[6px] border border-[#4c4c4d] focus:ring-0 focus:border-[#ff9123] w-full px-[14px] py-[11px] text-[14px] leading-[16px] text-[#4c4c4d] font-roboto"
        :class="errors.inputs.includes('button_text') ? 'border-red-500' : 'border-[#4c4c4d]'"
        name="button_text"
        placeholder="Надпись на кнопке"
        type="text"
      >
      <input
        v-model="form.redirect_link"
        class="bg-[#f4f5f7]/50 rounded-[6px] border border-[#4c4c4d] focus:ring-0 focus:border-[#ff9123] w-full px-[14px] py-[11px] text-[14px] leading-[16px] text-[#4c4c4d] font-roboto"
        name="redirect_link"
        placeholder="Ссылка для редиректа"
        type="text"
      >
      <p class="text-gray-500 text-[11px] mb-3">
        * если ввести ссылку (начинается с http), то вместо вывода уведомления будет произведён редирект
      </p>
      <input
        v-model="form.privacy_policy_href"
        class="bg-[#f4f5f7]/50 rounded-[6px] border border-[#4c4c4d] focus:ring-0 focus:border-[#ff9123] w-full px-[14px] py-[11px] text-[14px] leading-[16px] text-[#4c4c4d] font-roboto mb-3"
        name="privacy_policy_href"
        placeholder="Ссылка на политику конфиденциальности"
        type="text"
      >
      <template v-if="errors.messages">
        <p
          v-for="error in errors.messages"
          :key="error"
          class="text-red-500 text-xs mb-3"
        >
          {{ error }}
        </p>
      </template>
      <JbButton
        color="login"
        class="w-full rounded-lg text-sm"
        label="Сохранить форму"
        @click="clickSaveForm"
      />
    </form>
    <div
      v-if="showParams"
      class="ml-10 mt-2"
    >
      <div class="mb-10">
        <p>HTML-код:</p>
        <span
          class="bg-white p-3 leading-[50px] rounded-[8px]"
          v-text="iframeHtml"
        />
        <button
          class="mt-3 focus:ring min-w-[90px] focus:outline-none flex cursor-pointer whitespace-nowrap justify-center items-center duration-150 px-[12px] py-[10px] rounded-md bg-[#ff9123] text-white text-[13px] leading-[15px] font-medium font-roboto"
          @click="copyIframeHtml"
        >
          Копировать HTML код
        </button>
      </div>
      <div class="mb-10">
        <span>Ссылка на форму: </span>
        <router-link
          target="_blank"
          :to="'/form/' + currentBoardId"
        >
          <span class="underline text-blue-500 hover:text-blue-800">{{ currentLocation }}/form/{{ currentBoardId }}</span>
        </router-link>
        <button
          class="mt-3 focus:ring min-w-[90px] focus:outline-none flex cursor-pointer whitespace-nowrap justify-center items-center duration-150 px-[12px] py-[10px] rounded-md bg-[#ff9123] text-white text-[13px] leading-[15px] font-medium font-roboto"
          @click="copyFormLink"
        >
          Копировать ссылку
        </button>
      </div>
      <div class="mb-10">
        <span>JSON API: </span>
        <a
          class="underline text-blue-500 hover:text-blue-800"
          :href="'https://web.leadertask.com/api/boardsforms/addboardleadbyjson?uid_board=' + currentBoardId"
        >https://web.leadertask.com/api/boardsforms/addboardleadbyjson?uid_board={{ currentBoardId }}</a>
        <button
          class="mt-3 focus:ring min-w-[90px] focus:outline-none flex cursor-pointer whitespace-nowrap justify-center items-center duration-150 px-[12px] py-[10px] rounded-md bg-[#ff9123] text-white text-[13px] leading-[15px] font-medium font-roboto"
          @click="copyJson"
        >
          Копировать ссылку
        </button>
      </div>
      <div class="mb-10">
        <span>JSON-запрос: </span>
        <span class="bg-white p-3 rounded-[8px]">{"title":"Заголовок карточки","сomment":"Заметка карточки"}</span>
      </div>
      <div class="mb-10">
        <span>JSON-ответ при успешном результате: </span>
        <span class="bg-white p-3 rounded-[8px]">{"code":200,"message":""}</span>
        <p class="text-gray-500 mt-3">
          где "code" равен 200 при успехе, при другом значении ошибка, в поле "message" будет причина ошибки
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/Navbar/NavBar'
import JbButton from '@/components/JbButton.vue'
import FormCheckbox from '@/components/Board/form/FormCheckbox.vue'

import * as BOARD_FORMS from '@/store/actions/boardforms.js'
import BoardWithFormSkeleton from '@/components/Board/form/BoardWithFormSkeleton'
import BoardSmallButton from '@/components/Board/buttons/BoardSmallButton.vue'

export default {
  components: {
    BoardWithFormSkeleton,
    BoardSmallButton,
    NavBar,
    JbButton,
    FormCheckbox
  },
  data () {
    return {
      form: {
        title: '',
        name: {
          text: '',
          visible: true
        },
        email: {
          text: '',
          visible: true
        },
        phone: {
          text: '',
          visible: true
        },
        comment: {
          text: '',
          visible: true
        },
        button_text: '',
        redirect_link: '',
        privacy_policy_href: ''
      },
      showParams: false,
      formIsLoaded: false,
      errors: {
        inputs: [],
        messages: []
      },
      totalIframeHeight: 390
    }
  },
  computed: {
    boardForm () {
      return this.$store.state.boardforms.boardForm
    },
    currentBoardId () {
      return this.$route.params.board_id
    },
    iframeHtml () {
      return `<iframe src="${this.currentLocation}/form/${this.currentBoardId}?frame=true" title="Контакт" width="400" height="${this.totalIframeHeight}" scrolling="no" frameBorder="0"></iframe>`
    },
    currentLocation () {
      return window.location.origin
    }
  },
  mounted () {
    this.$store.dispatch(BOARD_FORMS.GET_BOARD_FORM_REQUEST, this.currentBoardId).then((res) => {
      const data = {
        uid_board: this.currentBoardId,
        info: res.data[0]?.info
      }
      this.$store.state.boardforms.boardForm = data
      if (data.info) {
        this.form = data.info
        this.findIframeHeight()
        this.showParams = true
      }
      this.formIsLoaded = true
      console.log(this.form)
    })
  },
  methods: {
    changeFiledVisible (field) {
      field.visible = !field.visible
    },
    validateForm () {
      this.errors.inputs = []
      this.errors.messages = []
      let inputsValidateError = false
      // Массив инпутов которые валидируем
      const inputs = ['name', 'phone', 'email', 'comment', 'button_text']
      // Цикл, который проходит по всем инпутам для валидации и генерирует ошибку, если поля с галочкой, но пустые
      inputs.forEach(inputName => {
        if (this.form[inputName].visible && !this.form[inputName].text) {
          this.errors.inputs.push(inputName)
          inputsValidateError = true
        }
        if (!this.form[inputName]) {
          this.errors.inputs.push(inputName)
          inputsValidateError = true
        }
      })
      // Общий текст ошибки для пустых инпутов
      if (inputsValidateError) {
        this.errors.messages.push('Форма не сохранена')
        this.errors.messages.push('Поля должны быть обязательно заполнены')
        console.log(this.form.redirect_link.length)
      }
    },
    clickSaveForm () {
      this.validateForm()
      if (this.errors.messages.length) {
        return
      }

      const data = {
        uid_board: this.currentBoardId,
        info: this.form
      }
      this.$store.dispatch(BOARD_FORMS.CREATE_OR_UPDATE_BOARD_FORM_REQUEST, data)
      this.$store.state.boardforms.boardForm = data
      console.log(this.$store.state.boardforms.boardForm)
      this.findIframeHeight()
      this.showParams = true
    },
    copyIframeHtml () {
      navigator.clipboard.writeText(this.iframeHtml)
    },
    copyFormLink () {
      navigator.clipboard.writeText(this.currentLocation + '/form/' + this.currentBoardId)
    },
    copyJson () {
      navigator.clipboard.writeText('https://web.leadertask.com/api/boardsforms/addboardleadbyjson?uid_board=' + this.currentBoardId)
    },
    findIframeHeight () {
      const inputs = ['name', 'phone', 'email', 'comment']
      let totalHeight = 420
      inputs.forEach(input => {
        if (!this.form[input].visible) {
          totalHeight -= 45
        }
      })
      this.totalIframeHeight = totalHeight
    }
  }
}
</script>

<style scoped></style>
