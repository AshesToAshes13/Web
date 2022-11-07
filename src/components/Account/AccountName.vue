<template>
  <div>
    <p class="text-base font-medium mb-2 text-[#4C4C4D]">
      Имя
    </p>
    <form class="mb-2">
      <div class="text-sm landing-4 font-normal text-[#606061]">
        {{ userName ?? '' }}
      </div>
      <button
        type="button"
        class="mt-2 text-[14px] landing-[13px] text-[#007BE5]"
        @click="showEditnameModal"
      >
        Изменить имя
      </button>
    </form>
  </div>
</template>
<script>
export default {
  props: {
    userName: {
      type: String,
      default: ''
    }
  },
  emits: ['showEditnameModalEmit'],
  methods: {
    showEditnameModal () {
      this.$emit('showEditnameModalEmit')
    }
  }
}
</script>
