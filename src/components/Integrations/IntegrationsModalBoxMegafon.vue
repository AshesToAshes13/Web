<template>
  <ModalBox
    :title="title"
    @cancel="onCancel"
  >
    <form
      class="flex flex-col"
      @submit="onSave"
    >
      <span
        v-if="error"
        class="red-500"
      >
        {{ error }}
      </span>
      <div class="mb-3 flex flex-col">
        <label for="atsKey">
          <span class="mb-1">Ключ для авторизации в АТС</span>
          <span class="mb-1 text-[11px] block">(генерируется автоматически в Личном Кабинете Мегафон)</span>
        </label>
        <input
          id="atsKey"
          v-model="atsKey"
          name="atsKey"
          type="text"
          class="bg-[#f4f5f7]/50 rounded-[6px] focus:ring-0 border w-full px-[14px] py-[11px] text-[14px] leading-[16px] text-[#4c4c4d] font-roboto"
        >
      </div>
      <div class="mb-3 flex flex-col">
        <span class="mb-1">Ссылка на АТС</span>
        <input
          v-model="atsLink"
          type="text"
          class="bg-[#f4f5f7]/50 rounded-[6px] focus:ring-0 border w-full px-[14px] py-[11px] text-[14px] leading-[16px] text-[#4c4c4d] font-roboto"
        >
      </div>
      <button
        type="submit"
        class="focus:ring min-w-[90px] focus:outline-none inline-flex cursor-pointer whitespace-nowrap justify-center items-center duration-150 px-[12px] py-[10px] rounded-md bg-[#ff9123] text-white text-[13px] leading-[15px] font-medium font-roboto disabled:opacity-70 disabled:cursor-default"
      >
        Сохранить
      </button>
    </form>
  </ModalBox>
</template>
<script>
import ModalBox from '@/components/modals/ModalBox.vue'

export default {
  components: {
    ModalBox
  },
  props: {
    error: {
      type: String,
      default: ''
    }
  },
  emits: ['onSave', 'onCancel'],
  data () {
    return {
      atsKey: this.$store.state.corpMegafonIntegration.atsKey,
      atsLink: this.$store.state.corpMegafonIntegration.atsLink
    }
  },
  methods: {
    onSave (event) {
      event.preventDefault()
      this.$emit('onSave', {
        atsKey: this.atsKey,
        atsLink: this.atsLink
      })
    },
    onCancel () {
      this.$emit('onCancel')
    }
  }
}
</script>
