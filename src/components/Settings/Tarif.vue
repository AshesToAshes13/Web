<template>
  <NavBar
    class="pt-[8px]"
    title="Тариф"
  />
  <form class="px-5 text-lg bg-white p-2 rounded-xl">
    <div class="font-medium text-[roboto] mb-4 text-base landing-[19px] text-[#4C4C4D]">
      Тип аккаунта
    </div>
    <p
      class="text-sm landing-4 font-medium text-[#606061]"
    >
      {{ tarifText }}
    </p>
    <p
      v-if="user?.date_expired"
      class="text-sm landing-5 font-[Roboto] mt-1 font-normal text-[#606061]"
    >
      <a v-if="user.tarif !== 'free' && user.tarif !== 'trial' && !isLicenseExpired">Лицензия истекает {{ getDateExpired() }} (дней: {{ user?.days_left ?? 0 }})</a>

      <a v-if="user.tarif === 'free' || isLicenseExpired">Обновите тарифный план ЛидерТаск для неограниченных возможностей</a>

      <a v-if="user.tarif === 'trial'">Мы активировали Вам пробную версию, в которой доступны 100% функций ЛидерТаск (дней: {{ user?.days_left ?? 0 }})</a>
    </p>
    <!-- Владелец тарифа -->
    <TarifOwner
      :owner-email="user?.owner_email"
      :owner-title="user?.owner_title"
    />
    <div class="mt-[36px]">
      <p class="text-base font-medium text-[#4C4C4D]">
        Количество рабочих мест
      </p>
      <div class="flex mt-[17px] text-[#606061]">
        <span class="relative mr-1.5">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M7.91667 12.5C7.91667 12.5 7.29292 11.6241 7.08333 11.6721C4.83167 12.1846 2.5 13.6646 2.5 15.2375V17.5H17.5V15.2375C17.5 13.6646 15.1683 12.1846 12.9167 11.6721C12.7071 11.6241 12.0833 12.5 12.0833 12.5H7.91667ZM10.7021 13.3333H7.4875L7.23833 12.9833L7.23417 12.9779L7.2175 12.955C7.12136 12.8241 7.02032 12.697 6.91458 12.5737C6.00417 12.825 5.11292 13.2383 4.43875 13.7304C3.6375 14.3146 3.33333 14.8612 3.33333 15.2375V16.6666H16.6667V15.2375C16.6667 14.8612 16.3625 14.3146 15.5617 13.7304C14.8875 13.2387 13.9963 12.825 13.0858 12.5737L13.0546 12.6096C12.9598 12.7211 12.8691 12.8362 12.7829 12.9546L12.7662 12.9779L12.7621 12.9829V12.9833L12.5129 13.3333H10.7021Z"
              fill="#606061"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M9.99992 10C10.884 10 11.7318 9.64881 12.3569 9.02369C12.9821 8.39857 13.3333 7.55072 13.3333 6.66667C13.3333 5.78261 12.9821 4.93477 12.3569 4.30964C11.7318 3.68452 10.884 3.33333 9.99992 3.33333C9.11586 3.33333 8.26802 3.68452 7.6429 4.30964C7.01777 4.93477 6.66659 5.78261 6.66659 6.66667C6.66659 7.55072 7.01777 8.39857 7.6429 9.02369C8.26802 9.64881 9.11586 10 9.99992 10ZM9.99992 10.8333C12.3012 10.8333 14.1666 8.96792 14.1666 6.66667C14.1666 4.36542 12.3012 2.5 9.99992 2.5C7.69867 2.5 5.83325 4.36542 5.83325 6.66667C5.83325 8.96792 7.69867 10.8333 9.99992 10.8333Z"
              fill="#606061"
            />
          </svg>
        </span>
        <span class="text-sm">{{ user?.count_workplaces }}</span>
      </div>
    </div>
    <div class="mt-[36px]">
      <p class="text-base font-medium text-[#4C4C4D]">
        Занято места на сервере
      </p>
      <div class="flex mt-[17px] text-[#606061]">
        <span class="relative mr-1.5">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M4.16667 3.83325C3.85725 3.83325 3.5605 3.95617 3.34171 4.17496C3.12292 4.39375 3 4.6905 3 4.99992V8.33325C3 8.64267 3.12292 8.93942 3.34171 9.15821C3.5605 9.377 3.85725 9.49992 4.16667 9.49992H15.8333C16.1428 9.49992 16.4395 9.377 16.6583 9.15821C16.8771 8.93942 17 8.64267 17 8.33325V4.99992C17 4.6905 16.8771 4.39375 16.6583 4.17496C16.4395 3.95617 16.1428 3.83325 15.8333 3.83325H4.16667ZM17.2178 9.99992C17.2688 9.95752 17.3181 9.91262 17.3654 9.86532C17.7717 9.45899 18 8.90789 18 8.33325V4.99992C18 4.42528 17.7717 3.87418 17.3654 3.46785C16.9591 3.06153 16.408 2.83325 15.8333 2.83325H4.16667C3.59203 2.83325 3.04093 3.06152 2.6346 3.46785C2.22827 3.87418 2 4.42528 2 4.99992V8.33325C2 8.90789 2.22827 9.45899 2.6346 9.86532C2.68191 9.91262 2.73118 9.95752 2.78222 9.99992C2.73118 10.0423 2.68191 10.0872 2.6346 10.1345C2.22827 10.5409 2 11.0919 2 11.6666V14.9999C2 15.5746 2.22827 16.1257 2.6346 16.532C3.04093 16.9383 3.59203 17.1666 4.16667 17.1666H15.8333C16.408 17.1666 16.9591 16.9383 17.3654 16.532C17.7717 16.1257 18 15.5746 18 14.9999V11.6666C18 11.0919 17.7717 10.5408 17.3654 10.1345C17.3181 10.0872 17.2688 10.0423 17.2178 9.99992ZM15.8333 10.4999H4.16667C3.85725 10.4999 3.5605 10.6228 3.34171 10.8416C3.12292 11.0604 3 11.3572 3 11.6666V14.9999C3 15.3093 3.12292 15.6061 3.34171 15.8249C3.5605 16.0437 3.85725 16.1666 4.16667 16.1666H15.8333C16.1428 16.1666 16.4395 16.0437 16.6583 15.8249C16.8771 15.6061 17 15.3093 17 14.9999V11.6666C17 11.3572 16.8771 11.0604 16.6583 10.8416C16.4395 10.6228 16.1428 10.4999 15.8333 10.4999ZM13.6667 6.66659C13.6667 6.39044 13.8905 6.16659 14.1667 6.16659H14.175C14.4511 6.16659 14.675 6.39044 14.675 6.66659C14.675 6.94273 14.4511 7.16659 14.175 7.16659H14.1667C13.8905 7.16659 13.6667 6.94273 13.6667 6.66659ZM13.6667 13.3333C13.6667 13.0571 13.8905 12.8333 14.1667 12.8333H14.175C14.4511 12.8333 14.675 13.0571 14.675 13.3333C14.675 13.6094 14.4511 13.8333 14.175 13.8333H14.1667C13.8905 13.8333 13.6667 13.6094 13.6667 13.3333Z"
              fill="#606061"
            />
          </svg>

        </span>
        <span class="text-sm">{{ user?.total_mb }} MB ({{ user?.percent_mb }}%)</span>
      </div>
    </div>
    <a
      :href="`https://www.leadertask.ru/alpha?luid=${user.owner_uid}`"
      class="text-[14px] text-[#606061] py-[12px] px-[16px] rounded-[6px] border-[1px] border-[#FF9123]"
    >
      {{ tarifButtonTitle }}
    </a>
  </form>
</template>

<script>
import NavBar from '../Navbar/NavBar.vue'
import TarifOwner from '../Tarif/TarifOwner.vue'
export default {
  components: { NavBar, TarifOwner },
  computed: {
    user () {
      return this.$store.state.user?.user
    },
    tarifText () {
      switch (this.$store.state.user.user?.tarif) {
        case 'trial':
          return 'Пробная версия'
        case 'free':
          return 'Лицензия истекла'
        case 'expert':
          return 'Премиум'
        case 'business':
          return 'Бизнес'
        case 'alpha':
          return 'Бизнес+'
        default:
          return this.$store.state.user.user?.tarif
      }
    },
    isLicenseExpired () {
      return this.$store.getters.isLicenseExpired
    },
    tarifButtonTitle () {
      if (this.user.tarif === 'trial' || this.user.tarif === 'free') {
        return 'Купить лицензию'
      } else {
        return 'Продлить лицензию'
      }
    }
  },
  methods: {
    getDateExpired () {
      if (!this.user?.date_expired) return true
      // добавляем Z в конец, чтобы он посчитал что это UTC время
      let dateExpiredString = this.user?.date_expired
      const [dateExp, timeExp] = dateExpiredString.split(' ')
      const [dayExp, monthExp, yearExp] = dateExp.split('.')
      dateExpiredString = `${yearExp}-${monthExp}-${dayExp}T${timeExp}Z`
      const dateExpired = new Date(dateExpiredString).toLocaleString('default', { year: 'numeric', month: 'numeric', day: 'numeric' })
      return dateExpired
    }
  }
}

</script>
