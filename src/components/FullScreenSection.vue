<template>
  <MainSection
    :class="componentClass"
    class="flex flex-col"
  >
    <slot
      card-class="w-8/12 md:w-5/12 lg:w-4/12 xl:w-3/12 shadow bg-white dark:bg-white"
      card-rounded="rounded-3xl"
    />
  </MainSection>
</template>

<script>
import MainSection from '@/components/MainSection.vue'

export default {
  components: {
    MainSection
  },
  props: {
    bg: {
      type: String,
      required: true,
      default: '',
      validator: value => ['login', 'error', 'leadertask'].includes(value)
    }
  },
  computed: {
    darkMode () {
      return this.$store.state.darkMode
    },
    componentClass () {
      const bgs = {
        login: 'bg-gradient-to-tr from-purple-400 via-pink-500 to-red-500',
        loginDark: 'bg-gradient-to-tr from-purple-900 via-pink-900 to-red-900',
        error: 'bg-gradient-to-tr from-pink-400 via-red-500 to-yellow-500',
        errorDark: 'bg-gradient-to-tr from-pink-900 via-red-900 to-yellow-900',
        leadertask: 'bg-orange-100 bg-no-repeat bg-left-bottom md:bg-[url("@/assets/images/pic.png")]'
      }
      const bgKey = this.darkMode ? `${this.bg}Dark` : this.bg
      return bgs[bgKey] ?? ''
    }
  }
}
</script>
