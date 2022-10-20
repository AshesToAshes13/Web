<template>
  <PopMenuItem
    style="padding-left: 8px;"
    class="!h-auto py-[5px] pl-[6px]"
  >
    <div class="flex items-center max-w-[205px]">
      <img
        v-if="photo"
        :src="photo"
        class="flex-none rounded-[7px] mr-[6px]"
        width="30"
        height="30"
      >
      <div class="grow overflow-hidden ml-[2px]">
        <div class="truncate">
          {{ name }}
        </div>
        <div class="truncate">
          {{ userEmail }}
        </div>
      </div>
    </div>
  </PopMenuItem>
</template>

<script>
import PopMenuItem from '@/components/Common/PopMenuItem.vue'

export default {
  components: {
    PopMenuItem
  },
  props: {
    userEmail: {
      type: String,
      default: ''
    }
  },
  computed: {
    employeesByEmail () {
      return this.$store.state.employees.employeesByEmail
    },
    photo () {
      return this.employeesByEmail[this.userEmail.toLowerCase()]?.fotolink || ''
    },
    name () {
      return this.employeesByEmail[this.userEmail.toLowerCase()]?.name || this.userEmail
    }
  }
}
</script>

<style scoped>
</style>
