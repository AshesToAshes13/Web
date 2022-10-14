<template>
  <!-- TODO: Перенести MainMenu в Home.vue, здесь оставить чистую страницу для компонентов вроде TaskFile.vue, CardFile.vue, которым нужен чистый экран -->
  <MainOnboarding
    v-if="displayModal"
    @okToModal="okToModal"
  />
  <component
    :is="$route.meta.layout || 'div'"
    v-if="!displayModal"
  >
    <router-view />
  </component>
</template>
<script>

import { setLocalStorageItem } from '@/store/helpers/functions'
import { USER_VIEWED_MODAL } from '@/store/actions/onboarding.js'

import MainOnboarding from '@/components/MainOnboarding.vue'

export default {
  components: {
    MainOnboarding
  },
  computed: {
    displayModal () {
      return !this.$store.state.onboarding?.visitedModals?.includes('main') && this.$store.state.onboarding?.showModals
    }
  },
  mounted () {
    this.checkCidParam()
  },
  methods: {
    checkCidParam () {
      // здесь не использую this.$router, потому что не получилось нормально достать url param
      const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop)
      })
      if (params.cid) {
        setLocalStorageItem('cid', params.cid)
      }
    },
    okToModal () {
      this.$store.commit(USER_VIEWED_MODAL, 'main')
    }
  }
}
</script>
