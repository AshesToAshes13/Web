<template>
  <ModalBoxAddClient
    v-if="showAddClient"
    title="Добавить клиента"
    :card-email="newEmail"
    :card-phone="newPhone"
    @cancel="showAddClient = false"
    @save="onAddNewClient"
  />
  <Popper
    class="light overflow-hidden"
    placement="left"
    @open:popper="onShowContactsMenu"
  >
    <DoitnowRightButton
      :title="title"
      icon="contact"
    />
    <template
      #content="{ close }"
    >
      <CardClientSearch
        ref="contactSearchBar"
        @search="searchClients"
        @eraseSearch="requestClients"
      />
      <div
        class="h-[156px] w-[300px] overflow-y-scroll scroll-style relative"
      >
        <svg
          v-if="clientsStatus === 'loading'"
          class="m-auto w-[20px] h-[20px] text-gray-200 animate-spin dark:text-gray-600 fill-orange-400"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <div
          v-else
        >
          <template
            v-if="!clients.length"
          >
            <div class="text-[#7e7e80] text-[13px] text-center leading-[14px] px-[36px] py-[12px] break-word">
              {{ searchResultNone }}
            </div>
          </template>
          <template
            v-for="contact in clients"
            v-else
            :key="contact.uid"
          >
            <div
              class="flex items-center px-[6px] py-[4px] hover:bg-[#F4F5F7] rounded-[6px] cursor-pointer"
              @click="$emit('changeContact', contact), close()"
            >
              <svg
                class="flex-none mr-[5px]"
                width="24"
                height="24"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  width="22"
                  height="22"
                  rx="7"
                  fill="black"
                  fill-opacity="0.1"
                />
                <path
                  d="M4.58504 17.3313C4.58552 17.3669 4.59281 17.402 4.6065 17.4347C4.62019 17.4674 4.64 17.4969 4.66481 17.5218C4.68961 17.5466 4.71893 17.5661 4.75107 17.5792C4.78322 17.5924 4.81757 17.5989 4.85217 17.5984H17.1473C17.1819 17.599 17.2163 17.5925 17.2485 17.5794C17.2807 17.5662 17.31 17.5467 17.3349 17.5219C17.3597 17.4971 17.3795 17.4675 17.3933 17.4348C17.407 17.4021 17.4143 17.3669 17.4148 17.3313V17.0124C17.4208 16.9162 17.4333 16.4368 17.126 15.9064C16.9322 15.5719 16.6508 15.2832 16.2898 15.0477C15.8532 14.7628 15.2976 14.5568 14.6256 14.4328C14.2844 14.3835 13.946 14.3157 13.6118 14.23C12.7229 13.9965 12.6452 13.7899 12.6446 13.7878C12.6394 13.7674 12.6319 13.7477 12.6223 13.7291C12.6148 13.6909 12.5969 13.5457 12.6314 13.157C12.7185 12.1694 13.2335 11.5858 13.6472 11.1169C13.7776 10.9692 13.9009 10.8292 13.9957 10.6924C14.4054 10.1018 14.4432 9.42969 14.4449 9.388C14.4465 9.31414 14.4365 9.2405 14.4155 9.16985C14.375 9.04133 14.2997 8.96143 14.2443 8.90238C14.2312 8.88886 14.2185 8.87496 14.2061 8.8607C14.2021 8.85583 14.1913 8.84263 14.2011 8.77629C14.2342 8.56255 14.2571 8.34727 14.2696 8.13122C14.2885 7.78316 14.3031 7.2628 14.2156 6.75599C14.2028 6.65919 14.1833 6.56343 14.1575 6.46941C14.0653 6.12065 13.9174 5.82261 13.7117 5.57667C13.6763 5.53673 12.8158 4.60404 10.3177 4.41299C9.97223 4.38659 9.63081 4.40083 9.29444 4.41855C9.19497 4.42082 9.09597 4.43339 8.99894 4.45606C8.74093 4.52449 8.67204 4.69262 8.65414 4.78676C8.62408 4.94307 8.67677 5.06396 8.71155 5.14455C8.71662 5.15601 8.72303 5.17025 8.71189 5.20777C8.65414 5.30017 8.56262 5.38354 8.46975 5.46239C8.44273 5.48566 7.81661 6.04145 7.78217 6.76711C7.68929 7.31907 7.69605 8.17881 7.80581 8.77316C7.81256 8.80616 7.82168 8.85479 7.80648 8.88779C7.68828 8.99652 7.55455 9.11983 7.55488 9.4012C7.55624 9.42969 7.5944 10.1015 8.00404 10.6924C8.0986 10.8292 8.22187 10.9689 8.35189 11.1165L8.35256 11.1169C8.76626 11.5858 9.28127 12.1694 9.3684 13.1566C9.40251 13.5457 9.38461 13.6905 9.37752 13.7291C9.36772 13.7476 9.36012 13.7673 9.35489 13.7878C9.35456 13.7899 9.27722 13.9958 8.39241 14.2289C7.88179 14.3634 7.37927 14.4321 7.36408 14.4339C6.71094 14.5475 6.15878 14.7486 5.72279 15.0317C5.36313 15.2655 5.08114 15.5552 4.88526 15.8921C4.57186 16.4306 4.58031 16.921 4.5847 17.0107V17.3313H4.58504Z"
                  fill="black"
                  fill-opacity="0.65"
                />
              </svg>
              <div class="my-[4px]">
                <div class="text-[#4C4C4D] text-[13px] leading-[14px] truncate">
                  {{ contact.name }}
                </div>
                <div
                  v-if="contact.phone || contact.email"
                  class="text-[#7e7e80] text-[11px] leading-[12px] truncate"
                >
                  {{ formatPhoneEmail(contact.phone, contact.email) }}
                </div>
              </div>
            </div>
          </template>
          <div
            v-if="!searchText && (newPhone || newEmail)"
            class="flex items-center px-[6px] py-[4px] hover:bg-[#F4F5F7] rounded-[6px] cursor-pointer"
            @click="showModalAddClient"
          >
            <svg
              class="flex-none mr-[5px]"
              width="24"
              height="24"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                width="22"
                height="22"
                rx="7"
                fill="black"
                fill-opacity="0.1"
              />
              <symbol
                id="plus"
                viewBox="0 0 16 16"
              >
                <path
                  d="M8.66824 7.3379L8.67295 3.28854C8.67295 3.111 8.60243 2.94074 8.47689 2.8152C8.35135 2.68967 8.18109 2.61914 8.00356 2.61914C7.82602 2.61914 7.65576 2.68967 7.53022 2.8152C7.40469 2.94074 7.33416 3.111 7.33416 3.28853L7.33888 7.3379L3.28951 7.33319C3.11198 7.33319 2.94171 7.40371 2.81618 7.52925C2.69064 7.65478 2.62012 7.82505 2.62012 8.00258C2.62012 8.18011 2.69064 8.35038 2.81618 8.47591C2.94171 8.60145 3.11198 8.67197 3.28951 8.67197L7.33888 8.66726L7.33416 12.7166C7.3338 12.8046 7.35087 12.8918 7.38438 12.9732C7.41789 13.0546 7.46719 13.1285 7.52942 13.1908C7.59165 13.253 7.66559 13.3023 7.74696 13.3358C7.82834 13.3693 7.91555 13.3864 8.00356 13.386C8.09156 13.3864 8.17877 13.3693 8.26015 13.3358C8.34153 13.3023 8.41546 13.253 8.47769 13.1908C8.53993 13.1285 8.58922 13.0546 8.62273 12.9732C8.65624 12.8918 8.67331 12.8046 8.67295 12.7166L8.66824 8.66726L12.7176 8.67197C12.8056 8.67233 12.8928 8.65527 12.9742 8.62176C13.0556 8.58824 13.1295 8.53895 13.1917 8.47672C13.254 8.41449 13.3033 8.34055 13.3368 8.25917C13.3703 8.17779 13.3874 8.09059 13.387 8.00258C13.3874 7.91457 13.3703 7.82736 13.3368 7.74599C13.3033 7.66461 13.254 7.59067 13.1917 7.52844C13.1295 7.46621 13.0556 7.41692 12.9742 7.3834C12.8928 7.34989 12.8056 7.33283 12.7176 7.33319L8.66824 7.3379Z"
                  fill="black"
                  fill-opacity="0.65"
                />
              </symbol>
              <use
                xlink:href="#plus"
                x="3"
                y="3"
                width="16"
                height="16"
              />

            </svg>
            <div class="my-[4px]">
              <div class="text-[#7e7e80] text-[13px] leading-[14px] truncate">
                Добавить новый контакт
              </div>
              <div
                v-if="newPhone || newEmail"
                class="text-[#7e7e80] text-[11px] leading-[12px] truncate"
              >
                {{ formatPhoneEmail(newPhone, newEmail) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </Popper>
</template>

<script>
import * as CLIENTS from '@/store/actions/clients'

import Popper from 'vue3-popper'
import CardClientSearch from '@/components/CardProperties/CardClientSearch.vue'
import ModalBoxAddClient from '@/components/Clients/ModalBoxAddClient.vue'
import DoitnowRightButton from '@/components/Doitnow/DoitnowRightButton.vue'

export default {
  components: {
    DoitnowRightButton,
    CardClientSearch,
    ModalBoxAddClient,
    Popper
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    newEmail: {
      type: String,
      default: ''
    },
    newPhone: {
      type: String,
      default: ''
    }
  },
  emits: ['changeContact'],
  data () {
    return {
      showAddClient: false,
      searchText: '',
      searchResultNone: ''
    }
  },
  computed: {
    clients () {
      return this.$store.state.clients.clients
    },
    clientsStatus () {
      return this.$store.state.clients.status
    },
    orgOwnerEmail () {
      return this.$store.state.user?.user?.owner_email
    }
  },
  methods: {
    onShowContactsMenu () {
      // закрыть поиск если открыт, также
      // он вызовет эммит eraseSearch которы вызовет requestClients
      this.$refs.contactSearchBar.closeSearch()
    },
    formatPhoneEmail (phone, email) {
      return `${phone} ${email ? ' <' + email + '>' : ''}`.trim()
    },
    showModalAddClient () {
      this.showAddClient = true
    },
    requestClients () {
      if (this.newEmail) {
        this.searchClients(this.newEmail)
      } else if (this.newPhone) {
        this.searchClients(this.newPhone)
      } else {
        this.$store.commit(CLIENTS.SET_CLIENTS, [])
      }
      this.searchText = ''
      this.searchResultNone = 'Найдите контакт по имени, email или номеру телефона'
    },
    searchClients (text) {
      const data = {
        organization: this.orgOwnerEmail,
        page: 1,
        search: text
      }
      this.$store.dispatch(CLIENTS.GET_CLIENTS, data)
      this.searchText = text
      this.searchResultNone = 'Контакт не найден'
    }
  }
}
</script>

<style scoped>
.light {
  --popper-theme-background-color: #ffffff;
  --popper-theme-background-color-hover: #ffffff;
  --popper-theme-text-color: #444444;
  --popper-theme-border-width: 0px;
  --popper-theme-border-style: solid;
  --popper-theme-border-radius: 8px;
  --popper-theme-padding: 10px 10px;
  --popper-theme-box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.1), 0px 3px 5px rgba(0, 0, 0, 0.12);
}
</style>
