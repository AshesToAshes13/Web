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
    <div
      v-if="isOrganizationIntegrated"
      class="mt-[30px] flex flex-col w-[450px]"
    >
      <span class="mb-1">Пользователи Мегафон</span>
      <span class="mb-1 text-[11px]">Установите пользователям ЛидерТаск их логины из ЛК Мегафон</span>
      <div
        v-for="(megafonUser, index) in megafonUsers"
        :key="index"
        class="mb-2.5 flex justify-start h-[34px]"
      >
        <div class="mr-2 flex-1">
          <EmployeesPopper
            v-model="megafonUser.uidUser"
            class="w-full"
            :can-edit="true"
            :org-employees="orgEmployees"
          />
        </div>

        <div class="flex-1">
          <Popper
            class="light w-full overflow-hidden"
            @open:popper="loadUsers"
          >
            <span class="block rounded text-[12px] bg-[#f4f5f7] px-[8px] py-[5px] truncate">{{ megafonUser.megafonUserLogin || 'Логин' }}</span>
            <template
              #content="{ close }"
            >
              <svg
                v-if="areAtsLoginsLoading"
                class="inline mr-2 w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-orange-400"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <template
                v-for="atsLogin in atsLogins"
                v-else
                :key="atsLogin.id"
              >
                <span
                  class="block mb-2 pointer py-2"
                  @click="setUserLogin(index, atsLogin.login), close()"
                >{{ atsLogin.login }}</span>
              </template>
            </template>
          </Popper>
        </div>
      </div>
      <button
        class="mb-3 text-[13px] text-[#4c4c4d]"
        type="button"
        @click="onAddNewMegafonUser"
      >
        + Добавить
      </button>
      <button
        class="mb-3 focus:ring min-w-[90px] focus:outline-none inline-flex cursor-pointer whitespace-nowrap justify-center items-center duration-150 px-[12px] py-[10px] rounded-md bg-[#ff9123] text-white text-[13px] leading-[15px] font-medium font-roboto disabled:opacity-70 disabled:cursor-default"

        type="button"
        @click="saveUsers"
      >
        Сохранить
      </button>
    </div>
    <article
      v-if="!isOrganizationIntegrated"
      class="mt-[30px]"
    >
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
            <ul class="list-inside list-disc gap-y-10px flex flex-col gap-y-[5px]">
              <li>
                <div class="inline-flex items-center gap-x-[5px]">
                  В поле "Имя вашей CRM" введите:
                  <ButtonCopy
                    text="LeaderTask CRM"
                  />
                </div>
              </li>
              <li>
                <div class="inline-flex items-center gap-x-[5px]">
                  В поле "Адрес вашей CRM" введите:
                  <ButtonCopy
                    text="https://api.leadertask.ru/megafon"
                  />
                </div>
              </li>
              <li>
                <div class="inline-flex items-center gap-x-[5px]">
                  В поле "Ключ для авторизации в вашей CRM":
                  <ButtonCopy
                    :text="ownerKey"
                  />
                </div>
              </li>
            </ul>
            <img
              class="block max-w-[800px]"
              src="@/assets/images/megafon/step_3.png"
              alt="Параметры CRM в ЛК"
            >
          </li>
        </ul>
      </p>
    </article>
  </div>
</template>
<script>
import Popper from 'vue3-popper'

import * as CORP_MEGAFON from '@/store/actions/integrations/corpoMegafonInt'

import IntegrationsModalBoxMegafon from '@/components/Integrations/IntegrationsModalBoxMegafon.vue'
import ModalBoxDelete from '@/components/Common/ModalBoxDelete.vue'
import NavBar from '../Navbar/NavBar.vue'
import EmployeesPopper from '../Employees/EmployeesPopper.vue'
import ButtonCopy from '@/components/ButtonCopy.vue'

export default {
  components: {
    NavBar,
    IntegrationsModalBoxMegafon,
    ModalBoxDelete,
    EmployeesPopper,
    Popper,
    ButtonCopy
  },
  data () {
    return {
      error: '',
      showIntegration: false,
      removeIntegrationModal: false,
      megafonUsers: this.$store.state.corpMegafonIntegration.megafonUsers,
      atsLogins: [],
      areAtsLoginsLoading: false
    }
  },
  computed: {
    user () {
      return this.$store.state.user.user
    },
    isOrganizationIntegrated () {
      return this.$store.state.corpMegafonIntegration.isIntegrated
    },
    orgEmployees () {
      return this.$store.state.navigator.navigator.emps.items
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
    },
    onAddNewMegafonUser () {
      this.megafonUsers.push({
        uidUser: '',
        megafonUserLogin: ''
      })
    },
    async loadUsers () {
      this.areAtsLoginsLoading = true
      const response = await this.$store.dispatch(CORP_MEGAFON.GET_ATS_LOGINS, {
        organizationEmail: this.user.owner_email,
        atsKey: this.$store.state.corpMegafonIntegration.atsKey
      })
      this.atsLogins = response.data.items

      this.areAtsLoginsLoading = false
    },
    setUserLogin (index, login) {
      this.megafonUsers[index].megafonUserLogin = login
    },
    async saveUsers () {
      this.megafonUsers = this.megafonUsers.filter(user => user.uidUser !== '' || user.megafonUserLogin !== '')
      await this.$store.dispatch(CORP_MEGAFON.MEGAFON_UPDATE_INTEGRATION, {
        atsKey: this.$store.state.corpMegafonIntegration.atsKey,
        atsLink: this.$store.state.corpMegafonIntegration.atsLink,
        megafonUsers: this.megafonUsers,
        organizationEmail: this.user.owner_email,
        crmKey: this.ownerKey
      })
    }
  }
}
</script>
<style scoped>
.light {
  --popper-theme-background-color: #ffffff;
  --popper-theme-background-color-hover: #ffffff;
  --popper-theme-text-color: #444444;
  --popper-theme-border-width: 0px;
  --popper-theme-border-style: solid;
  --popper-theme-border-radius: 8px;
  --popper-theme-padding: 10px 10px;
  --popper-theme-box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.1), 0px 3px 5px rgba(0, 0, 0, 0.12);
  margin: 0 !important;
  border: 0 !important;
}
</style>
