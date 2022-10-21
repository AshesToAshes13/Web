<template>
  <NavBar
    class="pt-[8px]"
    title="Интеграции"
    route="/settings/integrations"
    :breadcrumbs="[{ name: 'Телеграм', selected: true }]"
  />
  <IntegrationsLimit v-if="showLimitMessage" />
  <div
    v-else
    class="flex flex-col h-[calc(100%-64px)] w-[60%] ml-auto mr-auto px-[50px] py-[50px] bg-white rounded-[8px]"
  >
    <div
      class="flex w-[450px] justify-center flex-col"
    >
      <span class="font-[700] text-[21px] leading-[29px] text-[#424242]">Персональная интеграция через Телеграм</span>
      <span
        v-if="integration?.telegram_id"
        class="my-[20px]"
      >
        Интегрировано
      </span>
      <div
        v-if="!integration?.telegram_id"
        class="flex flex-col"
      >
        <a
          v-if="!integration?.telegram_id"
          class="flex justify-center items-center mt-[25px] rounded-[10px] w-[170px] h-[40px] font-[500] bg-orange-300 text-[#2E2E2E]"
          :href="integrationLink"
          target="_blank"
        >
          <span>Интеграция</span>
        </a>
        <span
          class="mt-[35px] font-[400] text-[16px] leading-[25px] text-[#4C4C4D]"
        >
          Чтобы получать уведомления о поручениях в реальном времени и выполнять их в срок
        </span>
      </div>
      <div
        v-else
        class="flex flex-col"
      >
        <button
          class="mt-[25px] rounded-[10px] w-[237px] h-[40px] text-[14px] text-gray-500 bg-white border border-[#CD5C5C] text-[#4C4C4D]"
          @click="deleteIntegration"
        >
          Разорвать интеграцию
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '../Navbar/NavBar.vue'
import IntegrationsLimit from '@/components/Integrations/IntegrationsLimit.vue'

import * as PERSONAL_TELEGERAM from '@/store/actions/integrations/personalTelegramIntegration.js'

export default {
  components: {
    NavBar,
    IntegrationsLimit
  },
  computed: {
    user () {
      return this.$store.state.user.user
    },
    showLimitMessage () {
      const tarif = this.$store.state.user.user.tarif
      return (tarif !== 'alpha' && tarif !== 'trial') || this.$store.getters.isLicenseExpired
    },
    integration () {
      return this.$store.state.telegramIntegration.integration
    },
    integrationLink () {
      return 'https://telegram.me/LeaderTaskNotificationBot?start=' + this.user.current_user_uid
    }
  },
  mounted () {
    this.$store.dispatch(PERSONAL_TELEGERAM.TELEGRAM_GET_PERSONAL_INTEGRATION, { uid: this.user.current_user_uid })
  },
  methods: {
    deleteIntegration () {
      this.$store.dispatch(PERSONAL_TELEGERAM.TELEGRAM_DELETE_PERSONAL_INTEGRATION, { uid: this.user.current_user_uid })
    }
  }
}
</script>
