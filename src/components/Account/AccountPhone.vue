<template>
  <div class="mt-6">
    <p class="text-base font-medium mb-2 text-[#4C4C4D]">
      Телефон
    </p>
    <form class="mb-2">
      <div class="text-sm landing-4 font-normal text-[#606061]">
        {{ userPhone }}
      </div>
      <button
        type="button"
        class="mt-2 text-[14px] landing-[13px] text-[#007BE5]"
        @click="showEditPhoneModal"
      >
        {{
          userPhone.length
            ? 'Изменить номер телефона'
            : 'Добавить номер телефона'
        }}
      </button>
    </form>
  </div>
</template>
<script>
export default {
  props: {
    userPhone: {
      type: String,
      default: ''
    }
  },
  emits: ['showEditPhoneModalEmit'],
  methods: {
    showEditPhoneModal () {
      this.$emit('showEditPhoneModalEmit')
    }
  }
}
</script>
