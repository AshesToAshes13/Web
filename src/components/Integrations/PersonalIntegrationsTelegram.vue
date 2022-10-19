<template>
  <NavBar
    class="pt-[8px]"
    title="Интеграции"
    route="/settings/integrations"
    :breadcrumbs="[{ name: 'Телеграм', selected: true }]"
  />
  <div class="w-full px-10 py-5 h-auto bg-white rounded-[8px]">
    <div
      class="flex w-[450px] justify-center flex-col"
    >
      <div class="flex items-center">
        <img
          class="h-[30px] w-[30px]"
          src="@/assets/images/telegram.png"
        >
        <span class="ml-[10px] font-[500]">Персональная интеграция через Телеграм</span>
      </div>
      <span
        v-if="integration?.telegram_id"
        class="my-[20px]"
      >
        Интегрировано
      </span>
      <a
        v-if="!integration?.telegram_id"
        class="flex justify-center items-center mt-[10px] rounded-[10px] h-[40px] text-white bg-orange-300"
        :href="integrationLink"
        target="_blank"
      >
        <span>Интеграция</span>
      </a>
      <div
        v-else
        class="flex flex-col"
      >
        <button
          class="mt-[10px] rounded-[10px] h-[40px] text-white bg-[#CD5C5C]"
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
import * as PERSONAL_TELEGERAM from '@/store/actions/integrations/personalTelegramIntegration.js'

export default {
  components: {
    NavBar
  },
  computed: {
    user () {
      return this.$store.state.user.user
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
