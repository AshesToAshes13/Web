<template>
  <ClientNavbar
    :breadcrumbs="breadcrumbs"
    :client="selectedClient"
    @deleteClient="deleteClient"
  />
  <ClientContent
    :client-uid="selectedClient.name"
    class="h-[calc(100%-70px)] bg-white rounded-xl"
  />
</template>

<script>
import ClientNavbar from '@/components/Clients/ClientNavbar'
import * as CLIENTS from '@/store/actions/clients'
import ClientContent from '@/components/Clients/ClientContent'

export default {
  components: { ClientContent, ClientNavbar },
  computed: {
    selectedClient () {
      return this.$store.state.clients.selectedClient ?? ''
    },
    breadcrumbs () {
      return [{ name: this.selectedClient?.name, selected: true }]
    }
  },
  mounted () {
    if (!this.selectedClient) {
      // Ждем когда зальется новый инспектор, пока работаем только по сторе
      // this.$store.dispatch(GET_CLIENT, this.$route.params.client_id)

      this.$router.push('/clients')
    }
  },
  unmounted () {
    this.$store.commit(CLIENTS.SELECT_CLIENT, null)
  },
  methods: {
    deleteClient () {
      this.$store.dispatch(CLIENTS.REMOVE_CLIENT, this.selectedClient).then(() => {
        this.$router.push('/clients')
      })
    }
  }
}
</script>
