<template>
  <ModalBox
    :title="subject"
    width="400"
    @cancel="$emit('closeModal')"
  >
    <div
      class="text-[15px]"
      v-html="message"
    />
  </ModalBox>
</template>
<script>
import ModalBox from '@/components/modals/ModalBox'

export default {
  components: { ModalBox },
  props: {
    subject: {
      type: String,
      default: ''
    },
    message: {
      type: String,
      default: ''
    }
  },
  emits: ['closeModal']
}
</script>
