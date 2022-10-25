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
  <IntegrationsLimit v-if="showLimitMessage" />
  <div
    v-else
    class="flex items-center"
  >
    <div class="w-[60%] px-[50px] py-[50px] h-[calc(100%-64px)] bg-white rounded-[8px]">
      <div
        class="flex w-[450px] justify-center flex-col"
      >
        <div class="flex items-center">
          <span class="font-[700] text-[21px] leading-[29px] text-[#424242]">
            Корпоративная интеграция через Мегафон
          </span>
        </div>
        <span
          v-if="isOrganizationIntegrated"
          class="my-[20px] text-[16px] leading-[25px] text-[#4C4C4D]"
        >
          Интегрировано с: {{ atsLink }}
        </span>
        <button
          v-if="!isOrganizationIntegrated"
          class="mt-[25px] rounded-[10px] w-[170px] h-[40px] font-[500] bg-orange-300 text-[#2E2E2E]"
          @click="changeShowIntegrationState(true)"
        >
          Интеграция
        </button>
        <button
          v-else
          class="mt-[10px] rounded-[10px] w-[237px] h-[40px] text-[14px] bg-white border border-[#CD5C5C] text-[#4C4C4D]"
          @click="showRemoveIntegration(true)"
        >
          Разорвать интеграцию
        </button>
      </div>
      <div
        v-if="isOrganizationIntegrated"
        class="mt-[30px] flex flex-col w-full"
      >
        <span class="mb-[8px] font-[500] text-[18px] leading-[28px]">Пользователи Мегафон</span>
        <span class="mb-[30px] text-[14px] leading-[22px]">Установите пользователям ЛидерТаск их логины из ЛК Мегафон</span>
        <div class="flex flex-row w-[97%]">
          <span class="flex-1 flex text-[13px] leading-[15px] font-[700]">Сотрудник</span>
          <span class="flex-1 flex text-[13px] leading-[15px] font-[700]">Логин</span>
        </div>
        <div
          v-for="(megafonUser, index) in megafonUsers"
          :key="index"
          class="mb-[10px] flex h-[34px] my-[10px] gap-[8px]"
        >
          <div class="flex-1">
            <EmployeesPopper
              :uid-user="megafonUser.uidUser"
              class="w-full"
              @select="setUserUid(index, $event)"
            />
          </div>
          <div class="flex-1">
            <PopMenu
              class="w-full"
              @openMenu="loadUsers"
            >
              <div
                class="flex items-center w-[105%] rounded-[6px] border border-gray-200 px-[8px] py-[9px] bg-white text-[#575758] cursor-pointer"
              >
                <svg
                  width="15"
                  height="14"
                  viewBox="0 0 15 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.9508 11.4251C13.5996 10.6392 13.0899 9.92541 12.4502 9.32337C11.8125 8.71959 11.057 8.2382 10.2255 7.90578C10.2181 7.90226 10.2106 7.9005 10.2032 7.89698C11.363 7.10553 12.117 5.81633 12.117 4.36181C12.117 1.95226 10.0505 0 7.5 0C4.94949 0 2.88301 1.95226 2.88301 4.36181C2.88301 5.81633 3.63699 7.10553 4.79683 7.89874C4.78938 7.90226 4.78193 7.90402 4.77449 7.90754C3.94045 8.23995 3.19205 8.71658 2.54977 9.32513C1.91067 9.92763 1.40111 10.6414 1.04925 11.4269C0.703571 12.1959 0.51714 13.0204 0.500047 13.8558C0.49955 13.8745 0.503035 13.8932 0.510297 13.9107C0.517559 13.9282 0.52845 13.9441 0.54233 13.9576C0.55621 13.971 0.572797 13.9817 0.591113 13.989C0.60943 13.9963 0.629106 14 0.648982 14H1.766C1.84791 14 1.91307 13.9384 1.91493 13.8628C1.95216 12.505 2.52929 11.2334 3.54949 10.2696C4.60507 9.27236 6.00693 8.72362 7.5 8.72362C8.99308 8.72362 10.3949 9.27236 11.4505 10.2696C12.4707 11.2334 13.0478 12.505 13.0851 13.8628C13.0869 13.9402 13.1521 14 13.234 14H14.351C14.3709 14 14.3906 13.9963 14.4089 13.989C14.4272 13.9817 14.4438 13.971 14.4577 13.9576C14.4715 13.9441 14.4824 13.9282 14.4897 13.9107C14.497 13.8932 14.5005 13.8745 14.5 13.8558C14.4813 13.0151 14.297 12.1972 13.9508 11.4251ZM7.5 7.38693C6.64548 7.38693 5.84123 7.07211 5.23619 6.5005C4.63114 5.92889 4.29789 5.1691 4.29789 4.36181C4.29789 3.55452 4.63114 2.79472 5.23619 2.22312C5.84123 1.65151 6.64548 1.33668 7.5 1.33668C8.35452 1.33668 9.15877 1.65151 9.76381 2.22312C10.3689 2.79472 10.7021 3.55452 10.7021 4.36181C10.7021 5.1691 10.3689 5.92889 9.76381 6.5005C9.15877 7.07211 8.35452 7.38693 7.5 7.38693Z"
                    fill="#7E7E80"
                  />
                </svg>
                <span class="ml-[8px] text-[#4C4C4D] text-[14px] leadind-[16px] font-[400]"> {{ megafonUser.megafonUserLogin || 'Логин' }} </span>
                <svg
                  class="ml-auto"
                  width="13"
                  height="7"
                  viewBox="0 0 13 7"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.16602 1L6.49935 6.33333L11.8327 1"
                    stroke="#7E7E80"
                    stroke-width="1.33333"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <template #menu>
                <div class="w-[200px]">
                  <svg
                    v-if="areAtsLoginsLoading"
                    class="w-[24px] h-[24px] text-gray-200 animate-spin fill-orange-400"
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
                  <PopMenuItem
                    v-for="atsLogin in atsLogins"
                    v-else
                    :key="atsLogin.id"
                    @click="setUserLogin(index, atsLogin.login)"
                  >
                    {{ atsLogin.login }}
                  </PopMenuItem>
                </div>
              </template>
            </PopMenu>
          </div>
          <div
            class="flex-none w-[34px] h-[34px] flex justify-center items-center rounded-[6px] hover:bg-[#f4f5f7] cursor-pointer"
            @click="deleteUserLogin(index)"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.92308 3.14286H9.07692C9.07692 2.8587 8.96346 2.58617 8.7615 2.38524C8.55954 2.18431 8.28562 2.07143 8 2.07143C7.71438 2.07143 7.44046 2.18431 7.2385 2.38524C7.03654 2.58617 6.92308 2.8587 6.92308 3.14286ZM5.84615 3.14286C5.84615 2.57454 6.07308 2.02949 6.477 1.62763C6.88093 1.22576 7.42876 1 8 1C8.57124 1 9.11907 1.22576 9.523 1.62763C9.92692 2.02949 10.1538 2.57454 10.1538 3.14286H14.4615C14.6043 3.14286 14.7413 3.1993 14.8423 3.29976C14.9433 3.40023 15 3.53649 15 3.67857C15 3.82065 14.9433 3.95691 14.8423 4.05738C14.7413 4.15784 14.6043 4.21429 14.4615 4.21429H13.8542L12.5565 13.6836C12.4684 14.3253 12.1497 14.9135 11.6593 15.3394C11.1688 15.7653 10.5399 16 9.88892 16H6.11108C5.4601 16 4.83116 15.7653 4.34072 15.3394C3.85028 14.9135 3.53155 14.3253 3.44354 13.6836L2.14585 4.21429H1.53846C1.39565 4.21429 1.25869 4.15784 1.15771 4.05738C1.05673 3.95691 1 3.82065 1 3.67857C1 3.53649 1.05673 3.40023 1.15771 3.29976C1.25869 3.1993 1.39565 3.14286 1.53846 3.14286H5.84615ZM6.92308 6.89286C6.92308 6.75078 6.86635 6.61452 6.76537 6.51405C6.66438 6.41358 6.52742 6.35714 6.38462 6.35714C6.24181 6.35714 6.10485 6.41358 6.00387 6.51405C5.90288 6.61452 5.84615 6.75078 5.84615 6.89286V12.25C5.84615 12.3921 5.90288 12.5283 6.00387 12.6288C6.10485 12.7293 6.24181 12.7857 6.38462 12.7857C6.52742 12.7857 6.66438 12.7293 6.76537 12.6288C6.86635 12.5283 6.92308 12.3921 6.92308 12.25V6.89286ZM9.61539 6.35714C9.75819 6.35714 9.89515 6.41358 9.99614 6.51405C10.0971 6.61452 10.1538 6.75078 10.1538 6.89286V12.25C10.1538 12.3921 10.0971 12.5283 9.99614 12.6288C9.89515 12.7293 9.75819 12.7857 9.61539 12.7857C9.47258 12.7857 9.33562 12.7293 9.23463 12.6288C9.13365 12.5283 9.07692 12.3921 9.07692 12.25V6.89286C9.07692 6.75078 9.13365 6.61452 9.23463 6.51405C9.33562 6.41358 9.47258 6.35714 9.61539 6.35714ZM4.51077 13.5389C4.56362 13.9239 4.75485 14.2768 5.04906 14.5322C5.34328 14.7877 5.72056 14.9285 6.11108 14.9286H9.88892C10.2796 14.9288 10.6572 14.7881 10.9516 14.5326C11.246 14.2771 11.4374 13.9241 11.4903 13.5389L12.7675 4.21429H3.23246L4.51077 13.5389Z"
                fill="#7E7E80"
              />
            </svg>
          </div>
        </div>
        <button
          class="mb-3 flex items-center border w-[170px] rounded-[8px] border-gray-200 py-[10px] mt-[45px] text-[13px] text-[#4c4c4d] text-center px-[40px]"
          type="button"
          @click="onAddNewMegafonUser"
        >
          <svg
            width="13"
            height="12"
            viewBox="0 0 13 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.49935 11.3307V5.9974M6.49935 5.9974V0.664062M6.49935 5.9974H11.8327M6.49935 5.9974H1.16602"
              stroke="#4C4C4D"
              stroke-width="1.33333"
              stroke-linecap="round"
            />
          </svg>
          <span class="ml-[8px] text-[13px] leading-[15px]">Добавить</span>
        </button>
      </div>
      <article
        v-if="!isOrganizationIntegrated"
        class="mt-[40px]"
      >
        <span class="font-[400] text-[16px] leading-[25px] text-[#4C4C4D]">Чтобы звонить контакту прямо из LeaderTask и хранить историю звонков по клиентам (контакты)</span>
        <img
          v-if="showPreviewPicture"
          src="@/assets/images/megafon/video-container.png"
          class="cursor-pointer mt-[35px] w-[650px] h-[360px]"
          @click="playVideo"
        >
        <iframe
          v-if="!showPreviewPicture"
          :src="`https://www.youtube.com/embed/xM9vMQmNx5Q?${!showPreviewPicture ? 'autoplay=1' : ''}`"
          title="YouTube video player"
          allow="accelerometer;clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          class="border-[3px] rounded-xl border-[#2E2E2E] mt-[35px] w-[650px] h-[360px]"
        />
        <p class="mt-[40px] font-[700] text-[22px] leading-[31px]">
          Шаг 1. Добавьте ЛидерТаск в ЛК Мегафона
        </p>
        <p class="mt-[25px]">
          <ul class="ml-[15px] text-[#4C4C4D] list-decimal font-[400] text-[16px] leading-[22px]">
            <li class="my-[30px]">
              <span class="mb-[25px]">Зарегистрируйтесь на сайте</span>
              <a
                class="text-[#007BE5] underline"
                href="https://id.megafon.ru/sso/login-b2b"
                target="_blank"
              >
                Мегафон
              </a>
              и войдите в личный кабинет.
            </li>
            <li class="my-[30px]">
              <span class="mb-[25px]">Зайдите в раздел "Настройки" и выберите "Интеграция с CRM" в правом верхнем углу.</span>
              <img
                class="block max-w-[800px] mt-[50px]"
                src="@/assets/images/megafon/step_1.png"
                alt="Интерфейс личного кабинета"
              >
            </li>
            <li class="my-[50px]">
              <span class="mb-[25px]">Найдите пункт "Ваша CRM" в списке и нажмите подключить.</span>
              <img
                class="block max-w-[800px] mt-[50px]"
                src="@/assets/images/megafon/step_2.png"
                alt="Список CRM в ЛК"
              >
            </li>
            <li class="mt-[50px]">
              <span>Заполните поля в соответствии со скриншотом:</span>
              <ul class="list-none flex flex-col mt-[25px] gap-y-[25px]">
                <li>
                  <div class="max-w-[550px]">
                    <span class="font-[500] text-[#4C4C4D]">поле "Имя вашей CRM" введите:</span>
                    <ButtonCopy
                      class="ml-[10px] mt-[12px]"
                      text="LeaderTask CRM"
                    />
                  </div>
                </li>
                <li>
                  <div class="max-w-[550px]">
                    <span class="font-[500] text-[#4C4C4D]">В поле "Адрес вашей CRM" введите:</span>
                    <ButtonCopy
                      class="ml-[10px] mt-[12px]"
                      text="https://api.leadertask.ru/megafon"
                    />
                  </div>
                </li>
                <li>
                  <div class="max-w-[550px]">
                    <span class="font-[500] text-[#4C4C4D]">В поле "Ключ для авторизации в вашей CRM":</span>
                    <ButtonCopy
                      class="ml-[10px] mt-[12px]"
                      :text="ownerKey"
                    />
                  </div>
                </li>
              </ul>
              <img
                class="block max-w-[800px] mt-[50px]"
                src="@/assets/images/megafon/step_3.png"
                alt="Параметры CRM в ЛК"
              >
            </li>
          </ul>
        </p>
      </article>
    </div>
  </div>
</template>
<script>
import PopMenu from '@/components/Common/PopMenu.vue'
import PopMenuItem from '@/components/Common/PopMenuItem.vue'

import * as CORP_MEGAFON from '@/store/actions/integrations/corpoMegafonInt'

import IntegrationsModalBoxMegafon from '@/components/Integrations/IntegrationsModalBoxMegafon.vue'
import IntegrationsLimit from '@/components/Integrations/IntegrationsLimit.vue'
import ModalBoxDelete from '@/components/Common/ModalBoxDelete.vue'
import NavBar from '../Navbar/NavBar.vue'
import EmployeesPopper from './components/EmployeesPopper.vue'
import ButtonCopy from '@/components/ButtonCopy.vue'

export default {
  components: {
    NavBar,
    IntegrationsModalBoxMegafon,
    IntegrationsLimit,
    ModalBoxDelete,
    EmployeesPopper,
    ButtonCopy,
    PopMenu,
    PopMenuItem
  },
  data () {
    return {
      error: '',
      showIntegration: false,
      removeIntegrationModal: false,
      atsLogins: [],
      areAtsLoginsLoading: false,
      showPreviewPicture: true
    }
  },
  computed: {
    user () {
      return this.$store.state.user.user
    },
    megafonUsers () {
      return this.$store.state.corpMegafonIntegration.megafonUsers
    },
    showLimitMessage () {
      const tarif = this.$store.state.user.user.tarif
      return (tarif !== 'alpha' && tarif !== 'trial') || this.$store.getters.isLicenseExpired
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
    },
    atsLink () {
      return this.$store.state.corpMegafonIntegration.atsLink
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
      const newMegafonUsers = [...this.megafonUsers]
      newMegafonUsers.push({
        uidUser: '',
        megafonUserLogin: ''
      })
      this.$store.commit(CORP_MEGAFON.SET_MEGAFON_USERS, newMegafonUsers)
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
    setUserUid (index, uid) {
      const newMegafonUsers = [...this.megafonUsers]
      newMegafonUsers[index].uidUser = uid
      this.$store.commit(CORP_MEGAFON.SET_MEGAFON_USERS, newMegafonUsers)
      if (this.megafonUsers[index].megafonUserLogin !== '') {
        this.saveUsers()
      }
    },
    setUserLogin (index, login) {
      const newMegafonUsers = [...this.megafonUsers]
      newMegafonUsers[index].megafonUserLogin = login
      this.$store.commit(CORP_MEGAFON.SET_MEGAFON_USERS, newMegafonUsers)
      if (this.megafonUsers[index].uidUser !== '') {
        this.saveUsers()
      }
    },
    deleteUserLogin (index) {
      const newMegafonUsers = [...this.megafonUsers]
      newMegafonUsers.splice(index, 1)
      this.$store.commit(CORP_MEGAFON.SET_MEGAFON_USERS, newMegafonUsers)
      this.saveUsers()
    },
    async saveUsers () {
      const newMegafonUsers = this.megafonUsers.filter(user => user.uidUser !== '' && user.megafonUserLogin !== '')
      await this.$store.dispatch(CORP_MEGAFON.MEGAFON_UPDATE_INTEGRATION, {
        atsKey: this.$store.state.corpMegafonIntegration.atsKey,
        atsLink: this.$store.state.corpMegafonIntegration.atsLink,
        megafonUsers: newMegafonUsers,
        organizationEmail: this.user.owner_email,
        crmKey: this.ownerKey
      })
    },
    playVideo () {
      this.showPreviewPicture = false
    },
    beforeRouteLeave (to, from) {
      const newMegafonUsers = this.megafonUsers.filter(user => user.uidUser !== '' && user.megafonUserLogin !== '')
      this.$store.commit(CORP_MEGAFON.SET_MEGAFON_USERS, newMegafonUsers)
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
