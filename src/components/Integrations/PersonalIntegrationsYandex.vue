<template>
  <IntegrationsModalBoxYandex
    v-if="showIntegration"
    title="Интеграция с Яндекс.Почта"
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
    :breadcrumbs="[{ name: 'Яндекс.Почта', selected: true }]"
  />
  <IntegrationsLimit v-if="showLimitMessage" />
  <div
    v-else
    class="flex flex-col w-[60%] px-[50px] py-[50px] bg-white rounded-[8px] mb-[20px]"
  >
    <div
      class="flex justify-center flex-col w-[80%]"
    >
      <div class="flex items-center">
        <span class="font-[700] text-[21px] leading-[29px] text-[#424242]">Персональная интеграция через Яндекс.Почта</span>
      </div>
      <div
        v-if="!isPersonalIntegrated"
        class="flex flex-col"
      >
        <button
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
          v-if="!showPreviewPicture"
          :src="`https://www.youtube.com/embed/Jx-TBirC_Cc?${!showPreviewPicture ? 'autoplay=1' : ''}`"
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
          Интегрировано с: {{ persLogin }}
        </span>
        <button
          class="mt-[10px] rounded-[10px] w-[237px] h-[40px] text-[14px] bg-white border border-[#CD5C5C] text-[#4C4C4D]"
          @click="showRemoveIntegration(true)"
        >
          Разорвать интеграцию
        </button>
      </div>
    </div>
    <article
      v-if="!isPersonalIntegrated"
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
import * as PERSONAL_YANDEX from '@/store/actions/integrations/personalYandexInt.js'

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
    isPersonalIntegrated () {
      return this.$store.state.personalYandexIntegration.isIntegrated
    },
    persLogin () {
      return this.$store.state.personalYandexIntegration.login
    }
  },
  methods: {
    playVideo () {
      this.showPreviewPicture = false
    },
    changeShowIntegrationState (value) {
      this.showIntegration = value
    },
    showRemoveIntegration (value) {
      this.removeIntegrationModal = value
    },
    emailIntegrate (login, password) {
      this.$store.dispatch(PERSONAL_YANDEX.YANDEX_CREATE_PERSONAL_EMAIL_INTEGRATION, {
        ya_login: login,
        ya_password: password,
        user_email: this.user.current_user_email
      }).then(() => {
        this.changeShowIntegrationState(false)
      })
    },
    removeIntegration () {
      this.$store.dispatch(PERSONAL_YANDEX.YANDEX_REMOVE_PERSONAL_EMAIL_INTEGRATION, this.user.current_user_email)
        .then(() => {
          this.showRemoveIntegration(false)
        })
    }
  }
}
</script>
