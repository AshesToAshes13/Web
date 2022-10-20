<template>
  <ModalBox
    :title="subject"
    width="400"
    @cancel="$emit('closeModal')"
  >
    <div
      v-linkified:options="{ className: 'text-blue-600', tagName: 'a' }"
      class="h-[70vh] w-full overflow-y-scroll scroll-style pr-[20px]"
    >
      <contenteditable
        v-model="insideMessage"
        tag="div"
        class="ring-0 outline-none text-[#424242] break-words"
        style="word-break: break-word"
        :contenteditable="false"
        :no-nl="false"
        :no-html="false"
      />
    </div>
  </ModalBox>
</template>
<script>
import ModalBox from '@/components/modals/ModalBox'
import contenteditable from 'vue-contenteditable'

export default {
  components: { ModalBox, contenteditable },
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
