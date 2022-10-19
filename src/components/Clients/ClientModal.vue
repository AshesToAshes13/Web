<template>
  <ModalBox
    title="Информация о клиенте"
    width="1000"
    @cancel="closeModal"
  >
    <div class="h-[70vh] w-full overflow-hidden scroll-y-auto">
      <ClientContent
        :client-uid="clientUid"
        class="w-full h-full"
      />
    </div>
  </ModalBox>
</template>
<script>
import ModalBox from '@/components/modals/ModalBox'
import ClientContent from '@/components/Clients/ClientContent'

export default {
  components: { ClientContent, ModalBox },
  props: {
    // Сейчас в clientUid временно приходит имя пользователя (пока ждем заливку инспектора с новым api)
    clientUid: {
      type: String,
      default: ''
    }
  },
  emits: ['closeModal'],
  methods: {
    closeModal () {
      this.$emit('closeModal')
    }
  }
}
</script>
