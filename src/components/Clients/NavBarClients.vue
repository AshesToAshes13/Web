<template>
  <NavBar
    id="NavBarClients"
    title="Контакты"
    :route="getBreadCrumbs?.length ? '/clients' : ''"
    :breadcrumbs="getBreadCrumbs"
  >
    <ReglamentSmallButton
      class="flex items-center px-[10px] py-[5px]"
      @click="clickAddClient"
    >
      <svg
        class="flex-none ml-[3px] mt-[5px] "
        width="17"
        height="17"
        viewBox="0 0 14 14"
        fill="#7E7E80"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M4.935 0.00388887L5 0C5.13607 1.79503e-05 5.26741 0.0499757 5.3691 0.140397C5.47078 0.230819 5.53575 0.355416 5.55167 0.490556L5.55556 0.555556V4.44444H9.44444C9.58052 4.44446 9.71185 4.49442 9.81354 4.58484C9.91523 4.67526 9.98019 4.79986 9.99611 4.935L10 5C9.99998 5.13607 9.95002 5.26741 9.8596 5.3691C9.76918 5.47078 9.64458 5.53575 9.50945 5.55167L9.44444 5.55556H5.55556V9.44444C5.55554 9.58052 5.50558 9.71185 5.41516 9.81354C5.32474 9.91523 5.20014 9.98019 5.065 9.99611L5 10C4.86393 9.99998 4.73259 9.95002 4.6309 9.8596C4.52922 9.76918 4.46425 9.64458 4.44833 9.50945L4.44444 9.44444V5.55556H0.555556C0.419482 5.55554 0.288146 5.50558 0.18646 5.41516C0.084774 5.32474 0.0198095 5.20014 0.00388887 5.065L0 5C1.79503e-05 4.86393 0.0499757 4.73259 0.140397 4.6309C0.230819 4.52922 0.355416 4.46425 0.490556 4.44833L0.555556 4.44444H4.44444V0.555556C4.44446 0.419482 4.49442 0.288146 4.58484 0.18646C4.67526 0.084774 4.79986 0.0198095 4.935 0.00388887L5 0L4.935 0.00388887Z" />
      </svg>
      Добавить контакт
    </ReglamentSmallButton>
    <NavBarSearch
      @search="onSearch"
      @eraseSearch="onEraseSearch"
    />
  </NavBar>
</template>

<script>
import NavBarSearch from '@/components/Navbar/NavBarSearch.vue'
import ReglamentSmallButton from '@/components/Reglaments/ReglamentSmallButton.vue'
import NavBar from '@/components/Navbar/NavBar.vue'

export default {
  components: {
    ReglamentSmallButton,
    NavBarSearch,
    NavBar
  },
  emits: ['search', 'clickAddClient'],
  computed: {
    getBreadCrumbs () {
      const searchValue = this.$route.query.search || ''
      return searchValue
        ? [{
            name: 'Поиск: ' + searchValue,
            selected: true
          }]
        : []
    }
  },
  methods: {
    onSearch (text) {
      this.$emit('search', text)
    },
    onEraseSearch () {
      this.$router.push({ path: '/clients' })
    },
    clickAddClient () {
      this.$emit('clickAddClient')
    }
  }
}
</script>
