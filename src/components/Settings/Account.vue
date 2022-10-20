<template>
  <UploadAvatar
    v-if="changeAvatar"
    :img="uploadedAvatar"
    :image-type="avatarType"
    @close-window="changeAvatar = false"
  />
  <UsernameRename
    v-if="showEditname"
    :show="showEditname"
    title="Введите новое имя пользователя"
    :value="userName()"
    @cancel="showEditname = false"
    @save="changeUserName"
  />
  <PhoneModalBoxRename
    v-if="showEditphone"
    :show="showEditphone"
    title="Введите новый номер телефона"
    :value="userPhone()"
    @cancel="showEditphone = false"
    @save="changeUserPhone"
  />
  <ModalBox
    v-if="notAllowedImageType"
    :show="'fsd'"
    title="Недопустимый формат изображения"
    ok="Понятно"
    @ok="notAllowedImageType = false"
    @cancel="notAllowedImageType = false"
  >
    Попробуйте загрузить другое изображение. Допустимые форматы: png, jpeg, jpg.
  </ModalBox>
  <ModalBox
    v-if="showEditpassword"
    :show="showEditpassword"
    title="Изменение пароля"
    ok="Сохранить"
    @ok="changeUserPassword"
    @cancel="showEditpassword = false"
  >
    <div class="flex flex-col w-full">
      <div>
        <p class="mb-[10px] mt-[10px]">
          Введите старый пароль
        </p>
        <input
          v-model="oldPassword"
          type="text"
          style="-webkit-text-security: disc"
          autocomplete=""
          class="bg-[#f4f5f7]/50 rounded-[6px] focus:ring-0 border border-[#4c4c4d] focus:border-[#ff9123] w-full px-[14px] py-[11px] text-[14px] leading-[16px] text-[#4c4c4d] font-roboto"
        >
      </div>
      <p
        v-if="invalidOldPassword === 'old_password invalid'"
        class="text-red-500 text-xs mt-1 ml-1"
      >
        Корректно введите старый пароль
      </p>
      <p
        v-if="emptyOldPass"
        class="text-red-500 text-xs mt-1 ml-1"
      >
        Введите старый пароль
      </p>
      <div>
        <p class="mb-[10px] mt-[10px]">
          Введите новый пароль
        </p>
        <input
          v-model="newPassword"
          type="text"
          style="-webkit-text-security: disc"
          autocomplete=""
          class="bg-[#f4f5f7]/50 rounded-[6px] focus:ring-0 border border-[#4c4c4d] focus:border-[#ff9123] w-full px-[14px] py-[11px] text-[14px] leading-[16px] text-[#4c4c4d] font-roboto"
        >
      </div>
      <div>
        <p class="mb-[10px] mt-[10px]">
          Подтвердите новый пароль
        </p>
        <input
          v-model="confirmNewPassword"
          type="text"
          style="-webkit-text-security: disc"
          autocomplete=""
          class="bg-[#f4f5f7]/50 rounded-[6px] focus:ring-0 border border-[#4c4c4d] focus:border-[#ff9123] w-full px-[14px] py-[11px] text-[14px] leading-[16px] text-[#4c4c4d] font-roboto"
        >
      </div>
      <p
        v-if="emptyNewPasses"
        class="text-red-500 text-xs mt-1 ml-1"
      >
        Заполните все поля ввода нового пароля
      </p>
      <p
        v-if="newPassError"
        class="text-red-500 text-xs mt-1 ml-1"
      >
        Пароли не совпадают
      </p>
    </div>
  </ModalBox>
  <NavBar
    class="mt-[8px]"
    title="Аккаунт"
  />
  <div class="overscroll-auto bg-white p-2 rounded-lg mt-1 pt-6">
    <div class="flex pb-3">
      <form class="text-left w-40">
        <div class="text-center mb-3 mr-5">
          <div class="pr-2">
            <span class="circle-image">
              <img
                v-if="$store.state.user.user?.foto_link"
                :src="$store.state.user.user?.foto_link"
                class="rounded-[27px] content-center object-cover"
              >
            </span>
          </div>
          <div>
            <input
              id="iconfile"
              type="file"
              class="hidden"
              accept="image/png, image/jpeg"
              @change="changeUserPhoto"
            >
            <label
              for="iconfile"
              class="text-[14px] mr-3 justify-center cursor-pointer text-[#606061]"
            >
              Изменить фото
            </label>
            <br>
          </div>
        </div>
      </form>
      <div class="text-left">
        <div class="text-base font-medium mb-2 text-[#4C4C4D]">
          Тип аккаунта
        </div>
        <p class="text-sm landing-4 font-medium text-[#606061]">
          {{ tarifText }}
        </p>
        <p
          v-if="$store.state.user.user?.date_expired"
          class="text-sm landing-4 mt-1 font-normal text-[#606061]"
        >
          <a
            v-if="
              user.tarif !== 'free' &&
                user.tarif !== 'trial' &&
                !isLicenseExpired
            "
          >Лицензия истекает {{ getDateExpired() }} (дней:
            {{ $store.state.user.user?.days_left ?? 0 }})</a>
          <a
            v-if="user.tarif === 'free' || isLicenseExpired"
          >Обновите тарифный план ЛидерТаск для неограниченных возможностей</a>
          <a
            v-if="user.tarif === 'trial'"
          >Мы активировали Вам пробную версию, в которой доступны 100% функций
            ЛидерТаск (дней: {{ $store.state.user.user?.days_left ?? 0 }})</a>
        </p>
        <div class="mt-2">
          <router-link to="/settings/tarif">
            <button
              type="button"
              class="text-[14px] landing-[13px] text-[#007BE5]"
            >
              Управление тарифом
            </button>
          </router-link>
        </div>
        <div class="mt-6">
          <p class="text-base font-medium mb-2 text-[#4C4C4D]">
            Имя
          </p>
          <form class="mb-2">
            <div class="text-sm landing-4 font-normal text-[#606061]">
              {{ $store.state.user.user?.current_user_name ?? '' }}
            </div>
            <button
              type="button"
              class="mt-2 text-[14px] landing-[13px] text-[#007BE5]"
              @click="showEditname = true"
            >
              Изменить имя
            </button>
          </form>
          <div class="mt-6">
            <p class="text-base font-medium mb-2 text-[#4C4C4D]">
              Телефон
            </p>
            <form class="mb-2">
              <div class="text-sm landing-4 font-normal text-[#606061]">
                {{ userPhone() }}
              </div>
              <button
                type="button"
                class="mt-2 text-[14px] landing-[13px] text-[#007BE5]"
                @click="showEditphone = true"
              >
                {{
                  userPhone().length
                    ? 'Изменить номер телефона'
                    : 'Добавить номер телефона'
                }}
              </button>
            </form>
          </div>
          <div class="mb-2 mt-6">
            <p class="text-base font-medium mb-2 text-[#4C4C4D]">
              Email
            </p>
            <div
              contenteditable="false"
              class="text-[14px] landing-[13px] text-[#606061]"
            >
              {{ $store.state.user.user?.current_user_email }}
            </div>
          </div>
          <div class="mb-2 mt-6">
            <form>
              <p class="text-base font-medium mb-2 text-[#4C4C4D]">
                Пароль
              </p>
              <button
                type="button"
                class="mt-2 text-[14px] landing-[13px] text-[#007BE5]"
                @click="showPasswordModalBox"
              >
                Изменить пароль
              </button>
            </form>
          </div>
          <div class="mb-2 mt-6">
            <button
              class="bg-[#F4F5F7] px-[16px] py-[12px] rounded-[6px] text-[14px] text-[#606061]"
              @click="logout"
            >
              Выйти из аккаунта
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { USER_CHANGE_PHONE } from '@/store/actions/user.js'
import { AUTH_CHANGE_PASSWORD, AUTH_LOGOUT } from '@/store/actions/auth.js'
import { CHANGE_EMPLOYEE_NAME } from '@/store/actions/employees.js'
import { USER_START_ONBOARDING } from '@/store/actions/onboarding.js'
import UsernameRename from '@/components/Settings/UsernameRename.vue'
import PhoneModalBoxRename from './PhoneModalBoxRename.vue'
import ModalBox from '@/components/modals/ModalBox.vue'
import NavBar from '@/components/Navbar/NavBar.vue'
import UploadAvatar from '@/components/UploadAvatar'
import * as TASK from '@/store/actions/tasks.js'
import * as DOITNOW from '@/store/actions/doitnow.js'

export default {
  components: {
    UploadAvatar,
    ModalBox,
    UsernameRename,
    PhoneModalBoxRename,
    NavBar
  },
  emits: ['AccLogout'],
  data () {
    return {
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
      invalidOldPassword: '',
      showEditname: false,
      newPassError: false,
      emptyOldPass: false,
      emptyNewPasses: false,
      showEditphone: false,
      showEditpassword: false,
      changeAvatar: false,
      uploadedAvatar: '',
      notAllowedImageType: false,
      avatarType: ''
    }
  },
  computed: {
    user () {
      return this.$store.state.user.user
    },
    isLicenseExpired () {
      return this.$store.getters.isLicenseExpired
    },
    tarifText () {
      switch (this.user?.tarif) {
        case 'trial':
          return 'Пробная версия'
        case 'free':
          return '<Бесплатный тариф ЛидерТаск>'
        case 'expert':
          return 'Премиум'
        case 'business':
          return 'Бизнес'
        case 'alpha':
          return 'Бизнес+'
        default:
          return this.user?.tarif
      }
    }
  },
  methods: {
    logout () {
      this.$store.commit(TASK.REMOVE_ALL_TAGS)
      this.$store.dispatch(AUTH_LOGOUT)
    },
    getDateExpired () {
      if (!this.user?.date_expired) return true
      // добавляем Z в конец, чтобы он посчитал что это UTC время
      let dateExpiredString = this.user?.date_expired
      const [dateExp, timeExp] = dateExpiredString.split(' ')
      const [dayExp, monthExp, yearExp] = dateExp.split('.')
      dateExpiredString = `${yearExp}-${monthExp}-${dayExp}T${timeExp}Z`
      const dateExpired = new Date(dateExpiredString).toLocaleString(
        'default',
        { year: 'numeric', month: 'numeric', day: 'numeric' }
      )
      return dateExpired
    },
    startOnBoarding () {
      this.$store.dispatch(USER_START_ONBOARDING)
      this.$router.push('/doitnow')
      this.startSlides()
    },
    startSlides () {
      this.$store.commit(DOITNOW.SLIDES_CHANGE_VISIBLE, {
        name: 'doitnowstart',
        visible: true
      })
      this.$store.commit(DOITNOW.SLIDES_CHANGE_VISIBLE, {
        name: 'addEmployees',
        visible: true
      })
      this.$store.commit(DOITNOW.SLIDES_CHANGE_VISIBLE, {
        name: 'delegateTasks',
        visible: true
      })
      this.$store.commit(DOITNOW.SLIDES_CHANGE_VISIBLE, {
        name: 'addAvatar',
        visible: true
      })
    },
    changeUserPhoto (event) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']
      const file = event.target.files[0]
      if (!allowedTypes.includes(file.type)) {
        this.notAllowedImageType = true
        return
      }
      if (file) {
        const reader = new FileReader()
        reader.addEventListener('load', () => {
          this.uploadedAvatar = reader.result
          this.avatarType = file.type
          this.changeAvatar = true
        })
        reader.readAsDataURL(file)
      }
    },
    showPasswordModalBox () {
      this.emptyNewPasses = false
      this.emptyOldPass = false
      this.invalidOldPassword = false
      this.newPassError = false

      this.showEditpassword = true
    },
    changeUserPassword () {
      const oldPassword = this.oldPassword
      const newPassword = this.newPassword
      const isFieldNotEmptyAndRight =
        oldPassword &&
        this.newPassword &&
        this.confirmNewPassword &&
        this.newPassword === this.confirmNewPassword
      const data = {
        old_password: oldPassword,
        new_password: newPassword
      }
      if (isFieldNotEmptyAndRight) {
        this.$store.dispatch(AUTH_CHANGE_PASSWORD, data).then(() => {
          this.showEditpassword = false
          this.oldPassword = ''
          this.newPassword = ''
          this.confirmNewPassword = ''
        })

        this.$store.dispatch(AUTH_CHANGE_PASSWORD, data).catch((err) => {
          this.invalidOldPassword = err.error
          this.oldPassword = ''
          this.confirmNewPassword = ''
          this.showEditpassword = true
          this.emptyOldPass = false
        })
      } else if (this.newPassword !== this.confirmNewPassword) {
        this.newPassError = true
      }
      // проверяем пустое поле старого пароля
      oldPassword ? (this.emptyOldPass = false) : (this.emptyOldPass = true)
      // проверяем пустые поля нового пароля
      this.newPassword && this.confirmNewPassword
        ? (this.emptyNewPasses = false)
        : (this.emptyNewPasses = true)
    },

    changeUserPhone (phone) {
      this.showEditphone = false
      const date = new Date()
      const timezone = (date.getTimezoneOffset() / 60) * -1
      const data = {
        phone: phone,
        timezone: timezone
      }
      this.$store.dispatch(USER_CHANGE_PHONE, data)
    },

    changeUserName (name) {
      this.showEditname = false
      const data = {
        name: name,
        email: this.$store.state.user.user.current_user_email
      }
      this.$store.dispatch(CHANGE_EMPLOYEE_NAME, data)
    },

    userName () {
      const name = this.$store.state.user.user.current_user_name ?? ''
      return name
    },

    userPhone () {
      const phone = this.$store.state.user.user?.current_user_phone ?? ''
      const index = phone.lastIndexOf(' ("')
      if (index !== -1) {
        return phone.slice(0, index)
      }
      return phone
    }
  }
}
</script>

<style scoped>
.circle-image {
  display: inline-block;
  border-radius: 10px;
}
.circle-image img {
  width: 106px;
  height: 106px;
}
</style>
