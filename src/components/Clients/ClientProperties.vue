<template>
  <ModalBoxDelete
    v-if="showConfirm"
    title="Удалить контакт"
    class="break-words"
    :text="`Вы действительно хотите удалить контакт ${selectedClient.name}?`"
    @cancel="showConfirm = false"
    @yes="removeClient"
  />
  <div class="flex justify-between items-center">
    <PopMenu>
      <PropsButtonMenu />
      <template #menu>
        <PopMenuHeader
          v-if="selectedClient.date_create"
          title="Дата добавления:"
        >
          {{ selectedClient.date_create }}
        </PopMenuHeader>
        <PopMenuItem
          icon="delete"
          type="delete"
          @click="showConfirm = true"
        >
          Удалить
        </PopMenuItem>
      </template>
    </PopMenu>
    <PropsButtonClose @click="closeProperties" />
  </div>
  <div class="flex flex-col">
    <div
      class="md:mt-[15px] xl:mt-[20px] 2xl:mt-[30px] font-roboto xl:text-[13px] 2xl:text-[16px] leading-[19px] font-medium text-[#4c4c4d]"
    >
      Имя
    </div>
    <input
      v-model="currClient.name"
      type="text"
      maxlength="50"
      placeholder="Имя"
      class="md:mt-[8px] xl:mt-[10px] 2xl:mt-[15px] p-0 font-roboto font-bold xl:text-[15px] 2xl:text-[18px] leading-[21px] text-[#424242] w-full border-none focus:ring-0 focus:outline-none"
      @blur="updateClient"
    >
    <div
      class="md:mt-[15px] xl:mt-[20px] 2xl:mt-[30px] font-roboto xl:text-[13px] 2xl:text-[16px] leading-[19px] font-medium text-[#4c4c4d]"
    >
      Телефон
    </div>
    <input
      v-model="currClient.phone"
      type="text"
      maxlength="50"
      placeholder="Телефон"
      class="md:mt-[8px] xl:mt-[10px] 2xl:mt-[15px] p-0 font-roboto font-bold xl:text-[15px] 2xl:text-[18px] leading-[21px] text-[#424242] w-full border-none focus:ring-0 focus:outline-none"
      @blur="updateClient"
    >
    <button
      v-if="showCallButton"
      class="flex mt-[10px] gap-[5px] items-center justify-center p-3 border-[1px] border-[#6b6868] rounded-[10px] font-roboto xl:text-[13px] 2xl:text-[16px] leading-[19px] font-medium text-[#4c4c4d] w-5/12"
      @click="callClient"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 100 100"
      >
        <path
          d="M 38.789 51.211 l 10.876 10.876 c 0.974 0.974 2.471 1.194 3.684 0.543 l 13.034 -6.997 c 0.964 -0.518 2.129 -0.493 3.07 0.066 l 19.017 11.285 c 1.357 0.805 1.903 2.489 1.268 3.933 c -1.625 3.698 -4.583 10.476 -5.758 13.473 c -0.247 0.631 -0.615 1.209 -1.127 1.652 c -12.674 10.986 -37.89 -2.4 -57.191 -21.701 C 6.358 45.039 -7.028 19.823 3.958 7.149 c 0.444 -0.512 1.022 -0.88 1.652 -1.127 c 2.996 -1.175 9.775 -4.133 13.473 -5.758 c 1.444 -0.635 3.128 -0.089 3.933 1.268 l 11.285 19.017 c 0.558 0.941 0.583 2.106 0.066 3.07 L 27.37 36.651 c -0.651 1.213 -0.431 2.71 0.543 3.684 C 27.913 40.335 38.789 51.211 38.789 51.211 z"
          style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;"
          transform=" matrix(1 0 0 1 0 0) "
          stroke-linecap="round"
        />
        <path
          d="M 60.282 42.839 l 13.376 -13.376 l 5.134 5.134 c 0.843 0.843 2.284 0.458 2.592 -0.695 l 8.561 -31.95 C 90.254 0.8 89.2 -0.254 88.048 0.054 l -31.95 8.561 c -1.152 0.309 -1.538 1.749 -0.695 2.592 l 5.134 5.134 L 47.161 29.718 c -0.628 0.628 -0.628 1.646 0 2.274 l 10.847 10.847 C 58.636 43.467 59.654 43.467 60.282 42.839 z"
          style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;"
          transform=" matrix(1 0 0 1 0 0) "
          stroke-linecap="round"
        />
      </svg>
      <span>Позвонить</span>
    </button>
    <div
      v-if="!validateNumber"
      class="mt-2 text-[11px] text-[#dc2626]"
    >
      Телефон не должен содержать ничего кроме цифр и начинаться со знака +
    </div>
    <div
      class="md:mt-[15px] xl:mt-[20px] 2xl:mt-[30px] font-roboto xl:text-[13px] 2xl:text-[16px] leading-[19px] font-medium text-[#4c4c4d]"
    >
      Email
    </div>
    <input
      v-model="currClient.email"
      type="text"
      maxlength="50"
      placeholder="Email"
      class="md:mt-[8px] xl:mt-[10px] 2xl:mt-[15px] p-0 font-roboto font-bold xl:text-[15px] 2xl:text-[18px] leading-[21px] text-[#424242] w-full border-none focus:ring-0 focus:outline-none"
      @blur="updateClient"
    >
    <div
      v-if="!validateEmail"
      class="mt-2 text-[11px] text-[#dc2626]"
    >
      Поле содержит некоректные данные
    </div>
    <div
      class="md:mt-[15px] xl:mt-[20px] 2xl:mt-[30px] font-roboto xl:text-[13px] 2xl:text-[16px] leading-[19px] font-medium text-[#4c4c4d]"
    >
      Комментарий
    </div>
    <input
      v-model="currClient.comment"
      type="text"
      maxlength="50"
      placeholder="Комментарий"
      class="md:mt-[8px] xl:mt-[10px] 2xl:mt-[15px] p-0 font-roboto font-bold xl:text-[15px] 2xl:text-[18px] leading-[21px] text-[#424242] w-full border-none focus:ring-0 focus:outline-none"
      @blur="updateClient"
    >
  </div>

  <template v-if="cardMessages">
    <div
      v-for="(card, index) in cardMessages"
      :key="index"
    >
      <div
        class="mt-3 p-3 bg-[#f5f5f5] rounded-[10px] border font-roboto xl:text-[13px] 2xl:text-[16px] leading-[19px] font-medium text-[#4c4c4d]"
      >
        <ClientCardChatMessages
          v-if="card"
          :card-name="cards[index].name"
          :messages="card"
          :employees="employees"
          :current-user-uid="user.current_user_uid"
        />
      </div>
    </div>
  </template>
  <!-- Chat skeleton -->
  <YandexIntegrationSkeleton v-if="yandexIntegrationStatus" />
  <MessageSkeleton v-if="status=='loading'" />
  <ClientChat
    v-if="status=='success'"
    :messages="clientMessages"
    :current-user-uid="user.current_user_uid"
    :employees="employees"
    :show-files-only="showFilesOnly"
    @onQuote="setCurrentQuote"
    @onDeleteMessage="deleteClientMessage"
    @onDeleteFile="deleteClientFileMessage"
  />

  <div class="flex flex-col fixed bottom-[0px] w-[340px] bg-white pt-2 pb-5">
    <ClientMessageQuoteUnderInput
      v-if="currentQuote"
      class="quote-request border-l-2 border-[#7E7E80] h-[40px]"
      :quote-message="currentQuote"
      :employee="employees[currentQuote.uid_creator]"
      @onClearQuote="currentQuote = false"
    />
    <ClientMessageInput
      v-model="clientMessageInputValue"
      :can-add-files="canAddFiles"
      @createClientMessage="createClientMessage"
      @createClientFile="createClientFile"
      @onPaste="onPasteEvent"
    />
  </div>
</template>
<script>
import YandexIntegrationSkeleton from '@/components/TaskProperties/YandexIntegrationSkeleton.vue'
import PropsButtonClose from '@/components/Common/PropsButtonClose.vue'
import PopMenuHeader from '@/components/Common/PopMenuHeader.vue'
import PopMenu from '@/components/Common/PopMenu.vue'
import PopMenuItem from '@/components/Common/PopMenuItem.vue'
import ModalBoxDelete from '@/components/Common/ModalBoxDelete.vue'
import PropsButtonMenu from '@/components/Common/PropsButtonMenu.vue'
import ClientChat from '@/components/Clients/ClientChat.vue'
import ClientMessageQuoteUnderInput from '@/components/Clients/ClientMessageQuoteUnderInput.vue'
import ClientMessageInput from '@/components/Clients/ClientMessageInput.vue'
import MessageSkeleton from '@/components/TaskProperties/MessageSkeleton.vue'
import * as CLIENTS from '@/store/actions/clients'
import * as CLIENT_FILES_AND_MESSAGES from '@/store/actions/clientfilesandmessages'
import * as CORP_MEGAFON from '@/store/actions/integrations/corpoMegafonInt'
import { uuidv4, stripPhoneNumber } from '@/helpers/functions'
import ClientCardChatMessages from '@/components/Clients/ClientCardChatMessages.vue'

export default {
  components: {
    PropsButtonClose,
    PopMenuItem,
    PropsButtonMenu,
    PopMenuHeader,
    ModalBoxDelete,
    PopMenu,
    YandexIntegrationSkeleton,
    ClientChat,
    ClientMessageQuoteUnderInput,
    ClientMessageInput,
    ClientCardChatMessages,
    MessageSkeleton
  },
  data () {
    return {
      currClient: {
        name: '',
        phone: '',
        email: '',
        comment: ''
      },
      showConfirm: false,
      showFilesOnly: false,
      currentQuote: false,
      clientMessageInputValue: ''
    }
  },
  computed: {
    selectedClient () {
      return this.$store.state.clients.selectedClient ?? ''
    },
    corpYandexIntegration () {
      return this.$store.state.corpYandexIntegration.isIntegrated
    },
    corpMsgsLoading () {
      return this.$store.state.corpYandexIntegration.isLoading
    },
    personalYandexIntegration () {
      return this.$store.state.personalYandexIntegration.isIntegrated
    },
    personalMsgsLoading () {
      return this.$store.state.personalYandexIntegration.isLoading
    },
    yandexIntegrationStatus () {
      return (this.corpYandexIntegration || this.personalYandexIntegration) && (this.corpMsgsLoading || this.personalMsgsLoading)
    },
    status () {
      return this.$store.state.clientfilesandmessages.status
    },
    user () {
      return this.$store.state.user.user
    },
    employees () {
      return this.$store.state.employees.employees
    },
    canAddFiles () {
      return !this.$store.getters.isLicenseExpired
    },
    clientMessages () {
      return [...this.$store.state.clientfilesandmessages.cards.messages, ...this.$store.state.clientfilesandmessages.messages]
    },
    cards () {
      return this.$store.state.clientfilesandmessages.cards.cards
    },
    cardMessages () {
      return this.$store.state.clientfilesandmessages.cards.messages
    },
    validateNumber () {
      const phone = this.currClient.phone
      if (phone.length < 10) return false
      const number = phone.slice(-10)
      if (isNaN(+number)) return false
      const code = phone.slice(0, -10)
      if (!code.startsWith('+')) return false
      if (isNaN(+code.slice(1))) return false
      return code === '+7' || code === '+37'
    },
    validateEmail () {
      return String(this.currClient.email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    },
    showCallButton () {
      return (
        this.$store.state.corpMegafonIntegration.isIntegrated &&
        this.currClient.phone &&
        this.$store.state.corpMegafonIntegration.megafonUsers.findIndex((megafonUser) => megafonUser.uidUser === this.user.current_user_uid) !== -1
      )
    }
  },
  watch: {
    selectedClient (newval) {
      if (newval) {
        this.currClient = { ...newval }
      }
    }
  },
  mounted () {
    this.currClient = { ...this.selectedClient }
  },
  methods: {
    closeProperties () {
      this.$store.commit(CLIENTS.SELECT_CLIENT, null)
      this.$store.commit(CLIENT_FILES_AND_MESSAGES.REFRESH_FILES)
      this.$store.commit(CLIENT_FILES_AND_MESSAGES.REFRESH_MESSAGES)
      this.$store.commit(CLIENT_FILES_AND_MESSAGES.REFRESH_CARDS)
      this.$store.dispatch('asidePropertiesToggle', false)
    },
    removeClient () {
      this.$store.dispatch(CLIENTS.REMOVE_CLIENT, this.selectedClient).then(() => {
        this.showConfirm = false
        this.$store.dispatch('asidePropertiesToggle', false)
      })
    },
    updateClient () {
      if (this.checkForm()) {
        this.$store.dispatch(CLIENTS.UPDATE_CLIENT, this.currClient)
      }
    },
    checkForm () {
      const { name } = this.currClient
      return name.length && this.validateNumber && this.validateEmail
    },
    createClientMessage () {
      // если лицензия истекла
      if (!this.canAddFiles) {
        this.showMessagesLimit = true
        return
      }
      if (this.clientMessageInputValue <= 0) {
        return
      }
      let msgclient = this.clientMessageInputValue
      msgclient = msgclient.trim()
      msgclient = msgclient.replaceAll('&', '&amp;')
      msgclient = msgclient.replaceAll('>', '&gt;')
      msgclient = msgclient.replaceAll('<', '&lt;')
      const uid = uuidv4()
      const data = {
        uid_message: uid,
        date_create: new Date().toISOString(),
        uid_creator: this.user.current_user_uid,
        uid_client: this.selectedClient.uid,
        organization: this.user.owner_email,
        uid_quote: this.currentQuote.uid_message,
        deleted: 0,
        msg: msgclient
      }
      this.$store.commit(CLIENT_FILES_AND_MESSAGES.CREATE_MESSAGE_REQUEST, data)
      this.clientMessageInputValue = ''
      this.scrollDown()
      this.currentQuote = false
      this.$store.dispatch(CLIENT_FILES_AND_MESSAGES.CREATE_MESSAGE_REQUEST, data).then(() => {
        if (this.selectedClient) this.selectedClient.has_msgs = true
      })
    },
    scrollDown () {
      const asideRight = document.getElementById('aside-right')
      asideRight.scroll({ top: asideRight.scrollHeight + 100000 })
    },
    isFilePreloadable (fileExtension) {
      const preloadableFiles = ['jpg', 'png', 'jpeg', 'git', 'bmp', 'gif', 'mov', 'mp4', 'mp3', 'wav']
      return preloadableFiles.includes(fileExtension)
    },
    createClientFile (event) {
      if (event === false) {
        this.showMessagesLimit = true
        return
      }
      const uploadingFiles = []

      const files = event.target.files ? event.target.files : event.dataTransfer.files
      const formData = new FormData()
      for (let i = 0; i < files?.length; i++) {
        const file = files[i]
        const fileSizeInMB = file.size / 1024 / 1024

        if (fileSizeInMB > 50) {
          this.showFileSizeLimit = true
          this.tooBigFiles.push(file)
          continue
        }

        formData.append('files[' + i + ']', file)

        // проверяем если файл не нуждается в прелоуде, тогда добавляем его псевдоданные
        // чтобы отобразить, что файл / файлы загружаются
        const fileExtension = file?.name?.split('.')?.pop()?.toLowerCase()
        if (!this.isFilePreloadable(fileExtension)) {
          uploadingFiles.push({
            uid: uuidv4(),
            uid_creator: this.user.current_user_uid,
            uid_file: uuidv4(),
            date_create: new Date().toISOString(),
            order: 0,
            file_name: file.name,
            file_size: file.size,
            file_version: 1,
            is_uploading: true
          })
        }
      }
      const data = {
        uid_client: this.selectedClient?.uid,
        // к сожалению не могу найти пользователя по token'y
        uid_creator: this.user.current_user_uid,
        name: formData
      }
      console.log(data)
      this.$store.commit('addClientMessages', uploadingFiles)
      this.$store.dispatch(CLIENT_FILES_AND_MESSAGES.CREATE_FILES_REQUEST, data).then(() => {
        if (this.selectedClient) this.selectedClient.has_files = true
        this.scrollDown()
      })
    },
    onPasteEvent (e) {
      const items = (e.clipboardData || e.originalEvent.clipboardData).items
      for (const index in items) {
        const item = items[index]
        if (item.kind === 'file') {
          const blob = item.getAsFile()
          const formData = new FormData()
          formData.append('files', blob)
          const data = {
            uid_client: this.selectedClient?.uid,
            name: formData,
            uid_creator: this.user.current_user_uid
          }
          this.$store.dispatch(CLIENT_FILES_AND_MESSAGES.CREATE_FILES_REQUEST, data).then(() => {
            this.selectedClient.has_files = true
            this.scrollDown()
          })
        }
      }
    },
    focusMessageInput () {
      const messageInput = document.getElementById('client-message-textarea')
      messageInput.focus()
    },
    setCurrentQuote (quote) {
      this.currentQuote = quote
      console.log(quote)
      this.focusMessageInput()
    },
    deleteClientMessage (uid) {
      this.$store.dispatch(CLIENT_FILES_AND_MESSAGES.DELETE_MESSAGE_REQUEST, uid)
    },
    deleteClientFileMessage (uid) {
      this.$store.dispatch(CLIENT_FILES_AND_MESSAGES.DELETE_FILE_REQUEST, uid)
    },
    callClient () {
      const phone = stripPhoneNumber(this.currClient.phone)
      this.$store.dispatch(CORP_MEGAFON.CALL_CLIENT, {
        phone: phone,
        atsKey: this.$store.state.corpMegafonIntegration.atsKey,
        login: this.$store.state.corpMegafonIntegration.megafonUsers.find((megafonUser) => megafonUser.uidUser === this.user.current_user_uid).megafonUserLogin,
        atsLink: this.$store.state.corpMegafonIntegration.atsLink
      })
    }
  }
}
</script>
