<template>
  <FullScreenSection
    v-slot="{ cardClass, cardRounded }"
    bg="leadertask"
  >
    <img
      src="https://www.leadertask.ru/templates/default/img/logo.svg"
      class="mb-10"
    >
    <CardComponent
      :class="cardClass"
      :rounded="cardRounded"
      form
      @submit.prevent="submit"
    >
      <Icon
        v-if="form.showBackButton"
        :path="mdiChevronLeft"
        class="cursor-pointer"
        size="24"
        :box="'0 0 24 24'"
        @click="getBack"
      />
      <p class="pb-4 pt-5 text-center text-2xl font-bold dark:text-white">
        {{ form.startScreenText }}
      </p>
      <Field>
        <Control
          v-model="form.email"
          :icon="form.emailMdi"
          name="email"
          :icon-class="form.emailIconClass"
          placeholder="Email"
          autocomplete="email"
          type="email"
          required
          :disabled="form.emailControlDisabled"
          :is-valid="form.isEmailValid"
          @blur="checkEmailExistense"
          @keyup.enter="checkEmailExistense"
        />
      </Field>
      <p
        v-if="form.emailShowError"
        class="text-red-500 text-xs pb-3"
      >
        {{ form.emailErrorMessage }}
      </p>
      <jb-button
        v-if="form.showCheckButton"
        class="w-full rounded-lg text-sm"
        color="login"
        :icon="mdiArrowRight"
        label="Продолжить с Email"
        @click="checkEmailExistense"
      />
      <div
        class="mt-2 w-full"
      >
        <GoogleLogin
          v-if="form.showCheckButton"
          class="w-full"
          :callback="googleCallback"
          popup-type="TOKEN"
        >
          <jb-button
            class="w-full rounded-lg text-sm"
            color="white"
            :icon="'google'"
            label="Войти через Google"
          />
        </GoogleLogin>
      </div>
      <transition-group name="slide-fade">
        <div v-if="showValues.showLoginInputsValue">
          <Field>
            <Control
              v-model="form.password"
              name="password"
              autocomplete="current-password"
              placeholder="Пароль"
              icon-class="cursor-pointer"
              :show="showValues.showLoginInputsValue"
              :icon="form.showPassword ? mdiEyeOutline : mdiEyeOffOutline"
              :type="form.showPassword ? 'text' : 'password'"
              :valid="form.password.trim().length > 7"
              @icon-click="togglePasswordVisibility"
            />
          </Field>
          <p
            v-if="form.showError"
            class="text-red-500 text-xs pb-3"
          >
            {{ form.errorMessage }}
          </p>
          <jb-button
            type="submit"
            class="w-full rounded-lg text-sm"
            color="login"
            :icon="mdiArrowRight"
            label="Войти"
          />
          <a
            href="https://www.leadertask.ru/user?t=passrecovery"
            class="text-xs mt-5 text-blue-500 underline decoration-1"
            target="_blank"
          >
            Забыли пароль?
          </a>
        </div>
      </transition-group>

      <transition-group name="slide-fade">
        <div v-if="showValues.showRegisterInputsValue">
          <Field
            help="Пароль (не менее 8 символов)"
            :max-count="8"
            :actual-count="form.password.length"
          >
            <Control
              v-model="form.password"
              name="password"
              placeholder="Пароль"
              autocomplete="current-password"
              icon-class="cursor-pointer"
              :show="showValues.showRegisterInputsValue"
              :icon="form.showPassword ? mdiEyeOutline : mdiEyeOffOutline"
              :type="form.showPassword ? 'text' : 'password'"
              :valid="validatePassword"
              @icon-click="togglePasswordVisibility"
              @click="form.passwordTouched = true"
              @blur="validateAndShowMessage"
            />
          </Field>

          <Field
            help="Введите ваше имя"
            :max-count="3"
            :actual-count="form.username.length"
          >
            <Control
              v-model="form.username"
              type="text"
              :maxlength="'50'"
              :icon="mdiAccountOutline"
              name="username"
              autocomplete="username"
              placeholder="Имя пользователя"
              :valid="validateName"
              @click="form.usernameTouched = true"
              @blur="validateAndShowMessage"
            />
          </Field>

          <Field
            help="Введите ваш номер телефона"
          >
            <Control
              v-model="form.phone"
              v-maska="'+7 (###) ###-##-##'"
              type="text"
              :icon="mdiPhoneOutline"
              :valid="validatePhone"
              name="phone"
              autocomplete="phone"
              placeholder="Номер телефона"
              @click="form.phoneTouched = true"
              @blur="validateAndShowMessage"
            />
          </Field>

          <p
            v-if="form.showError"
            class="text-red-500 text-xs pb-3"
          >
            {{ form.errorMessage }}
          </p>

          <JbButton
            type="submit"
            color="login"
            class="w-full rounded-lg text-sm"
            :icon="mdiArrowRight"
            label="Создать аккаунт"
            :disabled="!allFieldsAreValid"
          />
        </div>
      </transition-group>
    </CardComponent>
  </FullScreenSection>
</template>

<script>
import axios from 'axios'
import { mdiEmailOutline, mdiEyeOutline, mdiEyeOffOutline, mdiAccountOutline, mdiArrowRight, mdiCheckBold, mdiChevronLeft, mdiPhoneOutline } from '@mdi/js'
import FullScreenSection from '@/components/FullScreenSection.vue'
import CardComponent from '@/components/CardComponent.vue'
import Field from '@/components/Field.vue'
import Icon from '@/components/Icon.vue'
import { uuidv4 } from '@/helpers/functions'
import Control from '@/components/Control.vue'
import JbButton from '@/components/JbButton.vue'
import { USER_START_ONBOARDING } from '@/store/actions/onboarding.js'
import { AUTH_REQUEST, GOOGLE_AUTH_REQUEST, AUTH_REGISTER } from '@/store/actions/auth'
// import { decodeCredential } from 'vue3-google-login'
import { maska } from 'maska'
import * as SLIDES from '@/store/actions/slides.js'
import * as TASK from '@/store/actions/tasks'
import { CREATE_COLOR_REQUEST } from '@/store/actions/colors'

export default {
  directives: {
    maska
  },
  components: {
    FullScreenSection,
    CardComponent,
    Field,
    Icon,
    Control,
    JbButton
  },
  data () {
    return {
      mdiEmailOutline,
      mdiEyeOffOutline,
      mdiAccountOutline,
      mdiArrowRight,
      mdiChevronLeft,
      mdiEyeOutline,
      mdiPhoneOutline,
      date: new Date(),
      form: {
        email: '',
        password: '',
        username: '',
        phone: '',
        emailShowError: false,
        emailErrorMessage: 'Некорректный Email',
        showError: false,
        errorMessage: '',
        isEmailValid: true,
        isPasswordInvalid: false,
        emailMdi: mdiEmailOutline,
        emailIconClass: '',
        emailControlDisabled: false,
        startScreenText: 'ЛидерТаск',
        showCheckButton: true,
        showBackButton: false,
        showPassword: false,
        passwordTouched: false,
        usernameTouched: false,
        phoneTouched: false
      },
      showValues: {
        showRegisterInputsValue: false,
        showLoginInputsValue: false
      }
    }
  },
  computed: {
    validatePassword () {
      return this.form.password.trim().length > 7
    },
    user () {
      return this.$store.state.user.user
    },
    validateName () {
      return this.form.username.trim().length > 2
    },
    validatePhone () {
      return !(this.form.phone.length > 0 && this.form.phone.length < 18)
    },
    ifSpaceInPassword () {
      return this.form.password[0] === ' ' || this.form.password[this.form.password.length - 1] === ' '
    },
    ifEmptyFields () {
      return (!this.form.username && this.form.usernameTouched) || (!this.form.password && this.form.passwordTouched)
    },
    allFieldsAreValid () {
      return !this.ifSpaceInPassword && !this.ifEmptyFields && this.validatePassword && this.validatePhone && this.validateName
    }
  },
  methods: {
    login () {
      const uri = process.env.VUE_APP_LEADERTASK_API + 'api/v1/users/auth?login=' + this.form.email + '&password=' + encodeURIComponent(this.form.password) + '&system=' + this.getOSName() + '&type_device=' + this.getSysType()
      this.$store.dispatch(AUTH_REQUEST, uri)
        .then(() => {
          this.$router.push('/doitnow')
          const slideNames = [
            'addAvatar',
            'addEmployees',
            'addReglaments',
            'delegateTasks',
            'welcome'
          ]
          slideNames.forEach(slideName => {
            this.$store.commit(SLIDES.CHANGE_VISIBLE, {
              name: slideName,
              visible: false
            })
          })
        })
        .catch(() => {
          this.form.showError = true
          this.form.errorMessage = 'Неверный email пользователя или пароль'
        })
    },
    register () {
      if (!this.form.password || !this.form.username) { return }
      const date = new Date()
      const timezone = date.getTimezoneOffset() / 60 * (-1)
      const cid = localStorage.getItem('cid') ?? 'webnew'
      const data = {
        email: this.form.email,
        password: this.form.password,
        name: this.form.username,
        phone: this.form.phone.replace(/[^a-zA-Z0-9+]/g, ''),
        timezone: timezone,
        system: 'web',
        cid: cid,
        language: 'russian',
        type_device: 'mobile'
      }
      this.$store.dispatch(AUTH_REGISTER, data)
        .then(() => {
          window.ym(89796698, 'reachGoal', 'signup-new-web')
          localStorage.removeItem('slides')
          this.$router.push('/doitnow')
          const slideNames = [
            'addAvatar',
            'addEmployees',
            'addReglaments',
            'delegateTasks',
            'welcome'
          ]
          slideNames.forEach(slideName => {
            this.$store.commit(SLIDES.CHANGE_VISIBLE, {
              name: slideName,
              visible: true
            })
          })
          this.$store.dispatch(USER_START_ONBOARDING)

          // демо-метки
          const firstTag = {
            back_color: '#4AC7BF',
            uid: uuidv4(),
            name: 'Внимание!'
          }
          const secondTag = {
            back_color: '#FA3865',
            uid: uuidv4(),
            name: 'Срочно!'
          }
          const thirdTag = {
            back_color: '#FFCC00',
            uid: uuidv4(),
            name: 'Важно!'
          }
          this.$store.dispatch(TASK.CREATE_TAG_REQUEST, firstTag)
          this.$store.dispatch(TASK.CREATE_TAG_REQUEST, secondTag)
          this.$store.dispatch(TASK.CREATE_TAG_REQUEST, thirdTag)

          // демо-цвета
          const firstColor = {
            back_color: '#62A5F9',
            fore_color: '',
            uppercase: 0,
            order: 0,
            default: 0,
            email_creator: this.user.current_user_email,
            uid: uuidv4(),
            name: 'Синий',
            bold: 0,
            parentID: 'ed8039ae-f3de-4369-8f32-829d401056e9'
          }
          this.$store.dispatch(CREATE_COLOR_REQUEST, firstColor)
          const secondColor = {
            back_color: '#FFF38B',
            fore_color: '',
            uppercase: 0,
            order: 0,
            default: 0,
            email_creator: this.user.current_user_email,
            uid: uuidv4(),
            name: 'Желтый',
            bold: 0,
            parentID: 'ed8039ae-f3de-4369-8f32-829d401056e9'
          }
          this.$store.dispatch(CREATE_COLOR_REQUEST, secondColor)

          const thirdColor = {
            back_color: '#93FFB9',
            fore_color: '',
            uppercase: 0,
            order: 0,
            default: 0,
            email_creator: this.user.current_user_email,
            uid: uuidv4(),
            name: 'Зеленый',
            bold: 0,
            parentID: 'ed8039ae-f3de-4369-8f32-829d401056e9'
          }
          this.$store.dispatch(CREATE_COLOR_REQUEST, thirdColor)

          // демо-задача в Сегодня
          const tags = [firstTag.uid]
          const todayTask = {
            uid: uuidv4(),
            uid_parent: this.user.current_user_uid,
            uid_customer: this.user.current_user_uid,
            uid_project: '00000000-0000-0000-0000-000000000000',
            status: 0,
            email_performer: '',
            type: 1,
            date_begin: this.getDateString(this.date) + 'T00:00:00',
            date_end: this.getDateString(this.date) + 'T23:59:59',
            tags: tags,
            name: 'Прочитайте задачу и завершите ее',
            comment: 'Сюда можно вносить все детали по задаче - заметки и ссылки.\n\nА еще к задачам можно прикреплять файлы, вести переписку с коллегами в чате, создавать чек-листы.\n\nСоздавайте задачи для себя и сотрудников в разделе Задачи в Навигаторе.',
            _addToList: true
          }
          this.$store.dispatch(TASK.CREATE_TASK, todayTask)
        })
        .catch(() => {
          this.form.showError = true
          this.form.errorMessage = 'Unknown error'
        })
    },
    pad2 (n) {
      return (n < 10 ? '0' : '') + n
    },
    getDateString (date) {
      const month = this.pad2(date.getMonth() + 1)
      const day = this.pad2(date.getDate())
      const year = this.pad2(date.getFullYear())
      return year + '-' + month + '-' + day
    },
    submit () {
      if (this.showValues.showLoginInputsValue) {
        this.login()
      } else if (this.showValues.showRegisterInputsValue) {
        this.validateAndShowMessage()
        if (this.form.showError) {
          return
        }
        this.register()
      }
    },
    getOSName () {
      let detectOS = 'web'

      if (navigator.appVersion.indexOf('Mac') !== -1) {
        detectOS = 'mac'
      } else if (navigator.appVersion.indexOf('Win') !== -1) {
        detectOS = 'windows'
      } else if (navigator.appVersion.indexOf('Android') !== -1) {
        detectOS = 'android'
      } else if (navigator.appVersion.indexOf('iPhone') !== -1) {
        detectOS = 'ios'
      }

      return detectOS
    },
    isMobile () {
      return navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i)
    },
    getSysType () {
      return this.isMobile() ? 'mobile' : 'desktop'
    },
    hideLoginInputs () {
      this.showValues.showLoginInputsValue = false
    },
    hideRegisterInputs () {
      this.showValues.showRegisterInputsValue = false
    },
    showLoginInputs () {
      this.showValues.showLoginInputsValue = true
      this.hideRegisterInputs()
    },
    showRegisterInputs () {
      this.showValues.showRegisterInputsValue = true
      this.hideLoginInputs()
    },
    getBack () {
      this.hideLoginInputs()
      this.hideRegisterInputs()
      this.form.emailControlDisabled = false
      this.form.email = ''
      this.form.password = ''
      this.form.username = ''
      this.form.phone = ''
      this.form.startScreenText = 'ЛидерТаск'
      this.form.emailMdi = mdiEmailOutline
      this.form.emailIconClass = ''
      this.form.showCheckButton = true
      this.form.showBackButton = false
      this.form.showError = false
      this.form.showPassword = false
      this.form.errorMessage = ''
    },
    validateEmail () {
      if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/.test(this.form.email)) {
        return true
      }
      return false
    },
    checkEmailExistense () {
      if (this.validateEmail()) {
        this.form.isEmailValid = true
        this.form.emailShowError = false

        const uri = process.env.VUE_APP_LEADERTASK_API + 'api/v1/users/exists?email=' + this.form.email
        axios.get(uri)
          .then(() => {
            this.showLoginInputs()
            this.form.emailMdi = mdiCheckBold
            this.form.startScreenText = 'Войти в ЛидерТаск'
            this.form.emailIconClass = 'text-lime-500'
            this.form.emailControlDisabled = true
            this.form.showCheckButton = false
            this.form.showBackButton = true
          })
          .catch(() => {
            this.showRegisterInputs()
            this.form.emailMdi = mdiCheckBold
            this.form.startScreenText = 'Создать аккаунт'
            this.form.emailIconClass = 'text-lime-500'
            this.form.emailControlDisabled = true
            this.form.showCheckButton = false
            this.form.showBackButton = true
          })
      } else {
        this.form.isEmailValid = false
        this.form.emailShowError = true
      }
    },
    togglePasswordVisibility () {
      this.form.showPassword = !this.form.showPassword
    },
    validateAndShowMessage () {
      if (this.ifSpaceInPassword && this.form.passwordTouched) {
        this.form.showError = true
        this.form.errorMessage = 'Символ пробела в начале и в конце пароля недопустим'
      } else if (!this.validatePassword && this.form.passwordTouched) {
        this.form.showError = true
        this.form.errorMessage = 'Длина пароля не может быть меньше 8 символов'
      } else if (!this.validateName && this.form.usernameTouched) {
        this.form.showError = true
        this.form.errorMessage = 'Длина имени не может быть меньше 3 символов'
      } else if (!this.validatePhone && this.form.phoneTouched) {
        this.form.showError = true
        this.form.errorMessage = 'Некорректный номер телефона'
      } else if (this.ifEmptyFields) {
        this.form.showError = true
        this.form.errorMessage = 'Для успешной регистрации заполните все поля'
      } else if (this.form.showError) {
        this.form.showError = false
        this.form.errorMessage = ''
      }
    },
    googleCallback (response) {
      localStorage.removeItem('slides')
      console.log('Handle the response', response)
      const cid = localStorage.getItem('cid') ?? 'webnew'
      const data = {
        token: response.access_token,
        system: 'web',
        language: 'russian',
        type_device: 'mobile',
        cid: cid
      }
      this.$store.dispatch(GOOGLE_AUTH_REQUEST, data)
        .then((resp) => {
          if (resp?.data?.is_new_user) {
            window.ym(89796698, 'reachGoal', 'signup-new-web')
          }
          this.$router.push('/')
          this.$store.dispatch(USER_START_ONBOARDING)
        })
        .catch(() => {
          this.form.showError = true
          this.form.errorMessage = 'Unknown error'
        })
    }
  }
}
</script>

<style>
.error-message {
  color: #8D021F;
  font-size: 14px;
}

.slide-fade-enter-active {
  transition: all 0.2s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(45px);
  opacity: 0;
}
</style>
