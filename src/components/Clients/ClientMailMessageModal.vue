<template>
  <ModalBox
    :title="subject"
    width="400"
    @cancel="$emit('closeModal')"
  >
    <div v-html="insideMessage" />
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
  emits: ['closeModal'],
  data (props) {
    return {
      insideMessage: props.message
    }
  }
}
</script>
