<template>
  <ModalBox
    title="Информация о клиенте"
    @cancel="closeModal"
  >
    <ClientProperties />
  </ModalBox>
</template>
<script>
import ModalBox from '@/components/modals/ModalBox'
import ClientProperties from '@/components/Clients/ClientProperties'
import { GET_CLIENT } from '@/store/actions/clients'
export default {
  components: { ClientProperties, ModalBox },
  props: {
    // Сейчас в clientUid временно приходит имя пользователя (пока ждем заливку инспектора с новым api)
    clientUid: {
      type: String,
      default: ''
    }
  },
  emits: ['closeModal'],
  mounted () {
    // Сейчас формируется объект с полями
    // {organization: string, search: string}
    this.$store.dispatch(GET_CLIENT, { organization: this.$store.state.user.user.owner_email, search: this.clientUid }).then(res => {
      console.log('res -->', res)
    })
  },
  methods: {
    closeModal () {
      this.$emit('closeModal')
    }
  }
}
</script>
