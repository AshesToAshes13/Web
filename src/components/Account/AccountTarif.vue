<template>
  <div>
    <div class="text-base font-medium mb-2 text-[#4C4C4D]">
      Тип аккаунта
    </div>
    <p class="text-sm landing-4 font-medium text-[#606061]">
      {{ tarifText }}
    </p>
    <p
      v-if="user?.date_expired"
      class="text-sm landing-4 mt-1 font-normal text-[#606061]"
    >
      <a
        v-if="
          user.tarif !== 'free' &&
            user.tarif !== 'trial' &&
            !isLicenseExpired
        "
      >Лицензия истекает {{ getDateExpired }} (дней:
        {{ user?.days_left ?? 0 }})</a>
      <a
        v-if="user.tarif === 'free' || isLicenseExpired"
      >Обновите тарифный план ЛидерТаск для неограниченных возможностей</a>
      <a
        v-if="user.tarif === 'trial'"
      >Мы активировали Вам пробную версию, в которой доступны 100% функций
        ЛидерТаск (дней: {{ user?.days_left ?? 0 }})</a>
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
  </div>
</template>
<script>
export default {
  props: {
    tarifText: {
      type: String,
      default: ''
    },
    isLicenseExpired: {
      type: Boolean,
      default: false
    },
    user: {
      type: Object,
      default: () => {}
    },
    getDateExpired: {
      type: String,
      default: () => {}
    }
  }
}
</script>
