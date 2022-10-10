<template>
  <section
    class="px-0 overflow-hidden"
    :class="[ isFullScreen ? 'flex min-h-screen h-full justify-center' : '', lastRoute === '/login' ? 'items-center' : '']"
  >
    <slot />
  </section>
</template>

<script>
export default {
  computed: {
    lastRoute () {
      return this.$route.path
    },
    isFullScreen () {
      return this.$store.state.isFullScreen
    }
  }
}
</script>
