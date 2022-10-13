<template>
  <ModalBoxAddClient
    v-if="showAddClient"
    title="Добавить контакт"
    @cancel="showAddClient = false"
    @save="onAddNewClient"
  />
  <div class="flex flex-col h-full">
    <NavBarClients
      title="Контакты"
      class="pt-[8px]"
      @search="requestClients"
      @clickAddClient="clickAddClient"
    />
    <div class="h-[calc(100%-120px)] bg-white rounded-xl">
      <div
        class="my-[40px] h-[calc(100%-60px)] overflow-y-auto grow scroll-style"
      >
        <div
          v-if="clientUndefined"
        >
          <h1 class="text-3xl text-gray-600 font-bold m-5">
            Клиент не найден
          </h1>
        </div>
        <div
          v-else
        >
          <table class="pb-[40px] px-[20px] relative">
            <tr class="table-header">
              <th>Имя</th>
              <th>Номер телефона</th>
              <th>Email</th>
              <th>Комментарий</th>
            </tr>
            <ClientsSkeleton v-if="status === 'loading' && !wasLoaded" />
            <template v-if="status === 'success' || wasLoaded">
              <tr
                v-for="client in clients"
                :key="client?.uid"
                :class="client?.uid === selectedClient?.uid ? 'bg-[#F4F5F7]' : ''"
                @click.stop="showClientProperties(client)"
              >
                <td>
                  <div class="content max-w-[150px] xl:max-w-[250px]">
                    <span class="truncate">
                      {{ client.name }}
                    </span>
                  </div>
                </td>
                <td>
                  <div class="content max-w-[150px] xl:max-w-[250px]">
                    <span class="truncate">
                      {{ client.phone }}
                    </span>
                  </div>
                </td>
                <td>
                  <div class="content max-w-[150px] xl:max-w-[250px]">
                    <span class="truncate">
                      {{ client.email }}
                    </span>
                  </div>
                </td>
                <td>
                  <div class="content max-w-[150px] xl:max-w-[250px]">
                    <span class="truncate">
                      {{ client.comment }}
                    </span>
                  </div>
                </td>
              </tr>
            </template>
          </table>
        </div>
      </div>
      <Pagination
        v-model="currentPage"
        class="my-3 flex justify-center shrink-0"
        :disabled="status === 'loading'"
        :total="paging.pages"
        :max-visible-buttons="6"
        @update:modelValue="changePage"
      />
    </div>
  </div>
</template>
<script>
import * as CLIENTS from '@/store/actions/clients'
import * as CLIENTS_CHAT from '@/store/actions/clientfilesandmessages.js'
import { GET_CLIENT_CARDS, REFRESH_CARDS } from '@/store/actions/clientfilesandmessages.js'
import { REFRESH_FILES, REFRESH_MESSAGES } from '@/store/actions/cardfilesandmessages'

import NavBarClients from '@/components/Clients/NavBarClients.vue'
import ModalBoxAddClient from './ModalBoxAddClient.vue'
import ClientsSkeleton from '@/components/Clients/ClientsSkeleton.vue'
import Pagination from '../Pagination.vue'

export default {
  components: {
    NavBarClients,
    ModalBoxAddClient,
    ClientsSkeleton,
    Pagination
  },
  data () {
    return {
      showAddClient: false,
      currentPage: 1,
      wasLoaded: false,
      clientUndefined: false
    }
  },
  computed: {
    clients () {
      return this.$store.state.clients.clients
    },
    selectedClient () {
      return this.$store.state.clients.selectedClient
    },
    paging () {
      return this.$store.state.clients.paging
    },
    status () {
      return this.$store.state.clients.status
    },
    user () {
      return this.$store.state.user.user
    },
    currentPageRouter () {
      return Number(this.$route.query.page) || 1
    },
    searchValue () {
      return this.$route.query.search || ''
    },
    isCorpYandexIntegrated () {
      return this.$store.state.corpYandexIntegration.isIntegrated
    },
    isPersonalYandexIntegrated () {
      return this.$store.state.personalYandexIntegration.isIntegrated
    },
    isCorpMegafonIntegrated () {
      return this.$store.state.corpMegafonIntegration.isIntegrated
    }
  },
  watch: {
    status (value) {
      value === 'loading' && (this.wasLoaded = true)
    },
    async clients () {
      if (!this.wasLoaded) await this.requestClients()
    },
    currentPageRouter () {
      this.requestClients()
    },
    searchValue (searchValue) {
      if (!searchValue) {
        this.requestClients()
      }
    }
  },
  mounted () {
    this.requestClients()
  },
  unmounted () {
    this.$store.commit(CLIENTS.SELECT_CLIENT, null)
    this.$store.dispatch('asidePropertiesToggle', false)
  },
  methods: {
    async requestClients () {
      this.clientUndefined = false
      if (this.$route.query.page < 1) {
        this.$router.push('/clients?page=1')
        this.$route.query.page = 1
      }
      this.currentPage = +this.$route.query.page || 1
      const data = {
        organization: this.user?.owner_email,
        page: this.currentPage
      }
      if (this.$route.query.search && !(this.$store.state.user.user.tarif === 'free' || this.$store.getters.isLicenseExpired)) {
        data.search = this.$route.query.search
      }
      await this.$store.dispatch(CLIENTS.GET_CLIENTS, data).then(() => {
        this.wasLoaded = true
      })
      if (this.currentPageRouter > this.paging.pages) {
        if (this.paging.pages === 0 && this.$route.query.search?.length > 1) {
          this.clientUndefined = true
          return
        }
        this.currentPage = this.paging.pages
        this.changePage()
      }
    },
    showClientProperties (client) {
      if (client.uid === this.selectedClient?.uid) {
        return
      }

      this.$store.commit(CLIENTS_CHAT.REFRESH_MESSAGES)
      this.$store.commit(CLIENTS_CHAT.REFRESH_FILES)
      this.$store.commit(REFRESH_FILES, [])
      this.$store.commit(REFRESH_MESSAGES, [])
      this.$store.commit(REFRESH_CARDS)

      const data = {
        clientUid: client.uid,
        clientEmail: client.email,
        clientPhone: client.phone,
        crmKey: this.$store.state.corpMegafonIntegration.crmKey,
        corpYandexInt: this.isCorpYandexIntegrated,
        personalYandexInt: this.isPersonalYandexIntegrated,
        megafonIntegration: this.isCorpMegafonIntegrated
      }
      this.$store.dispatch(CLIENTS_CHAT.FETCH_FILES_AND_MESSAGES, data)
      if (!this.isPropertiesMobileExpanded) {
        this.$store.dispatch('asidePropertiesToggle', true)
      }
      this.$store.commit('basic', { key: 'propertiesState', value: 'client' })
      this.$store.commit(CLIENTS.SELECT_CLIENT, client)
      this.$store.dispatch(GET_CLIENT_CARDS, client.uid)
      console.log('selected client', this.selectedClient)
    },
    clickAddClient () {
      this.showAddClient = true
    },
    async onAddNewClient (client) {
      const clientToSend = {
        uid: client.uid,
        organization: this.user?.owner_email,
        name: client.name,
        email: client.email,
        phone: client.phone,
        comment: client.comment,
        date_create: client.date_create
      }
      await this.$store.dispatch(CLIENTS.ADD_NEW_CLIENT, clientToSend)
      await this.requestClients().then(() => {
        this.showAddClient = false
      })
    },
    changePage () {
      this.$router.push({ path: '/clients', query: { page: this.currentPage } })
    }
  }
}
</script>

<style scoped>
table {
  @apply w-full border-separate;
  border-spacing: 0;
}

/*Стили для первой строки с заголовками*/

tr:first-child {
  @apply text-left h-[48px]
}

tr:first-child th {
  @apply pl-[20px] border-[#e6e6e6] border text-[14px] font-medium;
  border-spacing: 0 20px;
}

tr:first-child th:first-child {
  @apply rounded-l-[6px]
}

tr:first-child th:last-child {
  @apply rounded-r-[6px]
}

tr:first-child th:not(:last-child){
  border-right: 1px;
}

/*Стили для контентной части*/

tr:not(:first-child) {
  @apply min-h-[58px] align-top
}

tr:not(:first-child) td {
  @apply border-b-2 border-[#e6e6e6] pl-[14px] font-normal text-[13px] max-w-[400px]
}

.content {
  @apply min-h-[48px] flex items-center
}

/*Стили для первого контентного элемента (отступ сверху)*/
tr:nth-child(2) {
  @apply min-h-[74px]
}

/*Стили наведения курсора мыши*/
tr:not(:first-child):hover {
  @apply bg-[#f4f5f7] cursor-pointer
}

.table-header > th {
  @apply sticky top-0 bg-white
}
</style>
