<template>
  <IntegrationsModalBoxYandex
    v-if="showIntegration"
    title="Корпоративная Интеграция с Яндекс.Почта"
    @cancel="changeShowIntegrationState(false)"
    @onSave="emailIntegrate"
  />
  <ModalBoxDelete
    v-if="removeIntegrationModal"
    title="Разорвать интеграцию"
    :text="'Вы уверены, что хотите разорвать интеграцию?'"
    @cancel="showRemoveIntegration(false)"
    @yes="removeIntegration"
  />
  <NavBar
    class="pt-[8px]"
    title="Интеграции"
    route="/settings/integrations"
    :breadcrumbs="[{ name: 'Корпоративная Яндекс.Почта', selected: true }]"
  />
  <IntegrationsLimit v-if="showLimitMessage" />

  <div
    v-else
    class="flex flex-col w-[60%] mr-auto px-[50px] py-[50px] bg-white rounded-[8px] mb-[20px]"
  >
    <div
      class="flex justify-center flex-col w-[80%]"
    >
      <div class="flex items-center">
        <span class="font-[700] text-[21px] leading-[29px] text-[#424242]">Корпоративная интеграция через Яндекс.Почта</span>
      </div>
      <div
        v-if="!isOrganizationIntegrated"
        class="flex flex-col"
      >
        <button
          v-if="shouldShowIntegrate"
          class="mt-[25px] rounded-[10px] w-[170px] h-[40px] font-[500] bg-orange-300 text-[#2E2E2E]"
          @click="changeShowIntegrationState(true)"
        >
          Интеграция
        </button>
        <span
          class="mt-[35px] font-[400] text-[16px] leading-[25px] text-[#4C4C4D]"
        >
          Чтобы получить полную картину всех взаимодействий с контактом по электронной почте
        </span>
        <img
          v-if="showPreviewPicture"
          src="@/assets/images/megafon/video-container.png"
          class="cursor-pointer mt-[35px] w-[650px] h-[360px]"
          @click="playVideo"
        >
        <iframe
          v-else
          :src="`https://www.youtube.com/embed/Jx-TBirC_Cc?autoplay=1`"
          title="YouTube video player"
          allow="accelerometer;clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          class="border-[3px] rounded-xl border-[#2E2E2E] mt-[35px] w-[650px] h-[360px]"
        />
      </div>
      <div
        v-else
        class="flex flex-col"
      >
        <span
          class="my-[20px] text-[16px] leading-[25px] text-[#4C4C4D]"
        >
          Интегрировано с: {{ corpLogin }}
        </span>
        <button
          v-if="shouldShowIntegrate"
          class="mt-[10px] rounded-[10px] w-[237px] h-[40px] text-[14px] bg-white border border-[#CD5C5C] text-[#4C4C4D]"
          @click="showRemoveIntegration(true)"
        >
          Разорвать интеграцию
        </button>
      </div>
    </div>
    <article
      v-if="!isOrganizationIntegrated"
      class="w-[80%]"
    >
      <p class="mt-[40px] font-[700] text-[22px] leading-[31px]">
        Шаг 1. Настройте почтовый ящик
      </p>
      <p class="mt-[25px]">
        <ul class="list-inside text-[#4C4C4D] list-decimal font-[400] text-[16px] leading-[22px]">
          <li class="my-[30px]">
            Откройте
            <a
              class="text-[#04b] underline"
              href="https://mail.yandex.ru/?dpda=yes#setup/client"
              target="_blank"
            >
              раздел «Почтовые программы»
            </a>
            в настройках Яндекс Почты.
          </li>
          <li class="my-[30px]">
            Выберите опции
            <span class="font-[500]">С сервера imap.yandex.ru по протоколу IMAP</span>
            и
            <span class="font-[500]">Пароли приложений и OAuth-токены.</span>
          </li>
          <li class="my-[30px]">
            Сохраните изменения.
          </li>
        </ul>
      </p>
      <p class="mt-[40px] font-[700] text-[22px] leading-[31px]">
        Шаг 2. Создайте пароль приложения
      </p>
      <p class="mt-[10px]">
        <ul class="ml-[15px] text-[#4C4C4D] list-decimal font-[400] text-[16px]">
          <li class="my-[30px]">
            Откройте страницу
            <a
              class="text-[#04b] underline"
              href="https://passport.yandex.ru/profile/"
              target="_blank"
            >
              Управление аккаунтом.
            </a>
          </li>
          <li class="my-[30px]">
            В разделе
            <span class="font-[500]">Пароли и авторизация</span>
            выберите
            <span class="font-[500]">Включить пароли приложений.</span>
            Подтвердите действие и нажмите
            <span class="font-[500]">Создать новый пароль.</span>
          </li>
          <li class="my-[30px]">
            Выберите тип приложения <span class="font-[500]">Почта.</span>
          </li>
          <li class="my-[30px]">
            Придумайте название пароля, например укажите название приложения, для которого вы создаете пароль. С этим названием пароль будет отображаться в списке.
          </li>
          <li class="my-[30px]">
            Нажмите кнопку Создать. Пароль приложения отобразится во всплывающем окне.
          </li>
        </ul>
      </p>
    </article>
  </div>
</template>
<script>
import * as CORP_YANDEX from '@/store/actions/integrations/corpoYandexInt.js'

import IntegrationsModalBoxYandex from '@/components/Integrations/IntegrationsModalBoxYandex.vue'
import IntegrationsLimit from '@/components/Integrations/IntegrationsLimit.vue'
import ModalBoxDelete from '@/components/Common/ModalBoxDelete.vue'
import NavBar from '../Navbar/NavBar.vue'

export default {
  components: {
    NavBar,
    IntegrationsModalBoxYandex,
    ModalBoxDelete,
    IntegrationsLimit
  },
  data () {
    return {
      showIntegration: false,
      removeIntegrationModal: false,
      showPreviewPicture: true
    }
  },
  computed: {
    user () {
      return this.$store.state.user.user
    },
    showLimitMessage () {
      const tarif = this.$store.state.user.user.tarif
      return (tarif !== 'alpha' && tarif !== 'trial') || this.$store.getters.isLicenseExpired
    },
    shouldShowIntegrate () {
      const userType = this.employees[this.user.current_user_uid].type
      return userType === 1 || userType === 2
    },
    corpLogin () {
      return this.$store.state.corpYandexIntegration.login
    },
    isOrganizationIntegrated () {
      return this.$store.state.corpYandexIntegration.isIntegrated
    },
    employees () {
      return this.$store.state.employees.employees
    },
    canEdit () {
      return this.employees[this.user.current_user_uid].type === 1 || this.employees[this.user.current_user_uid].type === 2
    }
  },
  methods: {
    changeShowIntegrationState (value) {
      if (this.canEdit) {
        this.showIntegration = value
      }
    },
    showRemoveIntegration (value) {
      if (this.canEdit) {
        this.removeIntegrationModal = value
      }
    },
    emailIntegrate (login, password) {
      this.$store.dispatch(CORP_YANDEX.YANDEX_CREATE_CORP_EMAIL_INTEGRATION, {
        ya_login: login,
        ya_password: password,
        organization: this.user.owner_email
      }).then(() => {
        this.changeShowIntegrationState(false)
      })
    },
    removeIntegration () {
      this.$store.dispatch(CORP_YANDEX.YANDEX_REMOVE_CORP_EMAIL_INTEGRATION, this.user.owner_email)
        .then(() => {
          this.showRemoveIntegration(false)
        })
    },
    playVideo () {
      this.showPreviewPicture = false
    }
  }
}
</script>
