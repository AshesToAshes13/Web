<template>
  <ClientsOnboarding
    v-if="displayModal"
    @okToModal="okToModal"
  />
  <ClientLimit v-else-if="showLimitMessage" />

  <template
    v-else
  >
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
        @search="searchClients"
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
              Контакт не найден
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
              <ClientsSkeleton v-if="status === 'loading'" />
              <template v-if="status === 'success' && wasLoaded">
                <router-link
                  v-for="client in clients"
                  :key="client?.uid"
                  class="link-row table-row"
                  :to="`/clients/${client?.uid}`"
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
                </router-link>
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
</template>
<script>
import * as CLIENTS from '@/store/actions/clients'
import { USER_VIEWED_MODAL } from '@/store/actions/onboarding.js'

import NavBarClients from '@/components/Clients/NavBarClients.vue'
import ModalBoxAddClient from './ModalBoxAddClient.vue'
import ClientsSkeleton from '@/components/Clients/ClientsSkeleton.vue'
import ClientsOnboarding from '@/components/Clients/ClientsOnboarding.vue'
import Pagination from '../Pagination.vue'
import ClientLimit from './ClientLimit.vue'

export default {
  components: {
    NavBarClients,
    ClientsOnboarding,
    ModalBoxAddClient,
    ClientsSkeleton,
    ClientLimit,
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
    paging () {
      return this.$store.state.clients.paging
    },
    displayModal () {
      return !this.$store.state.onboarding.visitedModals?.includes('clients') && this.$store.state.onboarding.showModals
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
    currentSearchRouter () {
      return this.$route.query.search || ''
    },
    showLimitMessage () {
      const tarif = this.$store.state.user.user.tarif
      return (tarif !== 'alpha' && tarif !== 'trial') || this.$store.getters.isLicenseExpired
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
    currentSearchRouter () {
      this.requestClients()
    }
  },
  mounted () {
    this.requestClients()
  },
  methods: {
    async requestClients () {
      this.clientUndefined = false
      this.currentPage = this.currentPageRouter < 1 ? 1 : this.currentPageRouter
      const data = {
        organization: this.user?.owner_email,
        page: this.currentPage
      }
      if (this.currentSearchRouter && !(this.$store.state.user.user.tarif === 'free' || this.$store.getters.isLicenseExpired)) {
        data.search = this.checkNumberAndTransform(this.currentSearchRouter)
      }
      await this.$store.dispatch(CLIENTS.GET_CLIENTS, data).then(() => {
        this.wasLoaded = true
      })
      if (this.currentPage > this.paging.pages) {
        if (this.paging.pages === 0 && this.currentSearchRouter.length > 1) {
          this.clientUndefined = true
          return
        }
        this.currentPage = this.paging.pages
        this.changePage()
      }
    },
    searchClients (text) {
      this.$router.push({ path: '/clients', query: { search: text } })
    },
    checkNumberAndTransform (text) {
      if (isNaN(+text)) return text
      if (text.length === 11 && (text.startsWith('7') || text.startsWith('8'))) {
        const num = text.split('')
        num[0] = '+7'
        text = num.join('')
      }
      if (text.length === 10) {
        text = '+7' + text
      }
      return text
    },
    showClientProperties (client) {
      this.$store.commit(CLIENTS.SELECT_CLIENT, client)
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
    },
    okToModal () {
      this.$store.commit(USER_VIEWED_MODAL, 'clients')
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

.link-row:not(:first-child) {
  @apply min-h-[58px] align-top
}

.link-row:not(:first-child) td {
  @apply border-b-2 border-[#e6e6e6] pl-[14px] font-normal text-[13px] max-w-[400px]
}

.content {
  @apply min-h-[48px] flex items-center
}

/*Стили для первого контентного элемента (отступ сверху)*/
.link-row:nth-child(2) {
  @apply min-h-[74px]
}

/*Стили наведения курсора мыши*/
.link-row:not(:first-child):hover {
  @apply bg-[#f4f5f7] cursor-pointer
}

.table-header > th {
  @apply sticky top-0 bg-white
}
</style>
