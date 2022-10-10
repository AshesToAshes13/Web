<template>
  <!-- TODO: Перенести MainMenu в Home.vue, здесь оставить чистую страницу для компонентов вроде TaskFile.vue, CardFile.vue, которым нужен чистый экран -->
  <component
    :is="$route.meta.layout || 'div'"
  >
    <router-view />
  </component>
</template>
<script>

import { setLocalStorageItem } from '@/store/helpers/functions'

export default {
  watch: {
    $route: {
      immediate: true,
      handler (to, from) {
        document.title = to.meta.title || 'Some Default Title'
      }
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
    }
  }
}
</script>
