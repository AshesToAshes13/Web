<template>
  <img
    v-if="getEmpPhotoByEmail(cardEmployee)"
    class="w-[22px] h-[22px] rounded-[5px] border border-black/10"
    :src="getEmpPhotoByEmail(cardEmployee)"
    alt="Avatar"
  >
  <span
    class="ml-1 text-[12px] leading-[14px] text-[#777777] font-['Roboto'] truncate"
  >
    {{ getEmpNameByEmail(cardEmployee) }}
  </span>
</template>

<script>
export default {
  props: {
    cardEmployee: {
      type: String,
      default: ''
    }
  },
  computed: {
    employeesByEmail () {
      return this.$store.state.employees.employeesByEmail
    }
  },
  methods: {
    getEmpPhotoByEmail (userEmail) {
      return this.employeesByEmail[userEmail.toLowerCase()]?.fotolink ?? ''
    },
    getEmpNameByEmail (userEmail) {
      return this.employeesByEmail[userEmail.toLowerCase()]?.name || userEmail
    }
  }
}
</script>
