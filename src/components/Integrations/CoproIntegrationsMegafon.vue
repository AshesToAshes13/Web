<template>
  <IntegrationsModalBoxMegafon
    v-if="showIntegration"
    title="Интеграция с Мегафон"
    :error="error"
    @cancel="changeShowIntegrationState(false)"
    @onSave="phoneIntegrate"
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
    :breadcrumbs="[{ name: 'Мегафон', selected: true }]"
  />
  <div class="w-full px-10 py-5 h-auto bg-white rounded-[8px]">
    <div
      class="flex w-[450px] justify-center flex-col"
    >
      <div class="flex items-center">
        <img
          class="h-[30px] w-[30px]"
          src="@/assets/images/megafon/megafon_logo.png"
        >
        <span class="ml-[10px] font-[500]">Корпоративная интеграция через Мегафон</span>
      </div>
      <button
        class="mt-[10px] rounded-[10px] h-[40px] text-white bg-orange-300"
        @click="changeShowIntegrationState(true)"
      >
        {{ isOrganizationIntegrated ? 'Редактировать' : 'Интеграция' }}
      </button>
      <div
        v-if="isOrganizationIntegrated"
        class="flex flex-col"
      >
        <button
          class="mt-[10px] rounded-[10px] h-[40px] text-white bg-[#CD5C5C]"
          @click="showRemoveIntegration(true)"
        >
          Разорвать интеграцию
        </button>
      </div>
    </div>
    <article class="mt-[30px]">
      <p class="font-[500]">
        Инструкция по интеграции:
      </p>
      <p class="mt-[10px] font-[600] text-[18px]">
        Шаг 1. Добавьте ЛидерТаск в ЛК Мегафона
      </p>
      <p class="mt-[10px]">
        <ul class="list-inside list-decimal">
          <li class="mb-3">
            Зарегистрируйтесь на сайте
            <a
              class="text-[#04b]"
              href="https://id.megafon.ru/sso/login-b2b"
              target="_blank"
            >
              Мегафон
            </a>
            и войдите в личный кабинет.
          </li>
          <li class="mb-3">
            Зайдите в раздел "Настройки" и выберите "Интеграция с CRM" в правом верхнем углу.
            <img
              class="block max-w-[800px]"
              src="@/assets/images/megafon/step_1.png"
              alt="Интерфейс личного кабинета"
            >
          </li>
          <li class="mb-3">
            Найдите пункт "Ваша CRM" в списке и нажмите подключить.
            <img
              class="block max-w-[800px]"
              src="@/assets/images/megafon/step_2.png"
              alt="Список CRM в ЛК"
            >
          </li>
          <li class="mb-3">
            Заполните поля в соответствии со скриншотом:
            <ul class="list-inside list-disc">
              <li>В поле "Имя вашей CRM" введите "LeaderTask CRM"</li>
              <li>В поле "Адрес вашей CRM" введите "https://api.leadertask.ru/megafon"</li>
              <li>В поле "Ключ для авторизации в вашей CRM" введите строку "{{ ownerKey }}"</li>
            </ul>
            <img
              class="block max-w-[800px]"
              src="@/assets/images/megafon/step_3.png"
              alt="Параметры CRM в ЛК"
            >
          </li>
        </ul>
      </p>
      <p class="mt-[10px] font-[600] text-[18px]">
        Шаг 2. Заполните интеграцию в ЛидерТаск
      </p>
      <p class="mt-[10px]">
        <ul class="list-inside list-decimal">
          <li>
            Откройте страницу
            <a
              class="text-[#04b]"
              href="https://passport.yandex.ru/profile/"
              target="_blank"
            >
              Управление аккаунтом.
            </a>
          </li>
          <li>
            В разделе
            <span class="font-[500]">Пароли и авторизация</span>
            выберите
            <span class="font-[500]">Включить пароли приложений.</span>
            Подтвердите действие и нажмите
            <span class="font-[500]">Создать новый пароль.</span>
          </li>
          <li>
            Выберите тип приложения <span class="font-[500]">Почта.</span>
          </li>
          <li>
            Придумайте название пароля, например укажите название приложения, для которого вы создаете пароль. С этим названием пароль будет отображаться в списке.
          </li>
          <li>
            Нажмите кнопку Создать. Пароль приложения отобразится во всплывающем окне.
          </li>
        </ul>
      </p>
    </article>
  </div>
</template>
<script>
import * as CORP_MEGAFON from '@/store/actions/integrations/corpoMegafonInt'

import IntegrationsModalBoxMegafon from '@/components/Integrations/IntegrationsModalBoxMegafon.vue'
import ModalBoxDelete from '@/components/Common/ModalBoxDelete.vue'
import NavBar from '../Navbar/NavBar.vue'

export default {
  components: {
    NavBar,
    IntegrationsModalBoxMegafon,
    ModalBoxDelete
  },
  data () {
    return {
      error: '',
      showIntegration: false,
      removeIntegrationModal: false
    }
  },
  computed: {
    user () {
      return this.$store.state.user.user
    },
    isOrganizationIntegrated () {
      return this.$store.state.corpMegafonIntegration.isIntegrated
    },
    employees () {
      return this.$store.state.employees.employees
    },
    canEdit () {
      return this.employees[this.user.current_user_uid].type === 1 || this.employees[this.user.current_user_uid].type === 2 || true
    },
    ownerKey () {
      return this.$store.getters.getOwnerEmployee?.uid || ''
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
    async phoneIntegrate (integrationData) {
      const data = {
        ...integrationData,
        organizationEmail: this.user.owner_email,
        crmKey: this.ownerKey
      }

      try {
        const action = !this.isOrganizationIntegrated ? CORP_MEGAFON.MEGAFON_CREATE_INTEGRATION : CORP_MEGAFON.MEGAFON_UPDATE_INTEGRATION
        await this.$store.dispatch(action, data)
        this.changeShowIntegrationState(false)
      } catch (ex) {
        this.error = ex
      }
    },
    removeIntegration () {
      this.$store.dispatch(CORP_MEGAFON.MEGAFON_REMOVE_CORP_INTEGRATION, this.user.owner_email)
        .then(() => {
          this.showRemoveIntegration(false)
        })
    }
  }
}
</script>
