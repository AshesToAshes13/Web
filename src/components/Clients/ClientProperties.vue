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
    <div
      v-if="!validateNumber"
      class="mt-2 text-[11px] text-[#dc2626]"
    >
      Поле содержит некоректные данные
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

  <ClientCardSelectCardMessages
    v-if="cards.length"
    :cards="cards"
    @selectCard="selectCard"
    @clearCardChat="clearCardChat"
  />

  <CardChat
    v-if="cardMessages.length"
    :card-name="cards[0]?.name"
    :messages="cardMessages"
    :current-user-uid="user.current_user_uid"
    :employees="employees"
    :show-files-only="showFilesOnly"
  />

  <!-- Chat skeleton -->
  <MessageSkeleton v-if="status=='loading'" />
  <ClientChat
    v-if="status=='success' && !cardMessages.length"
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
      v-if="!cardMessages.length"
      v-model="clientMessageInputValue"
      :can-add-files="canAddFiles"
      @createClientMessage="createClientMessage"
      @createClientFile="createClientFile"
      @onPaste="onPasteEvent"
    />
  </div>
</template>
<script>
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
import ClientCardSelectCardMessages from './ClientCardSelectCardMessages.vue'
import CardChat from '../CardProperties/CardChat.vue'
import * as CLIENTS from '@/store/actions/clients'
import * as CLIENT_FILES_AND_MESSAGES from '@/store/actions/clientfilesandmessages'
import { MESSAGES_REQUEST, REFRESH_FILES, REFRESH_MESSAGES } from '@/store/actions/cardfilesandmessages'
import { uuidv4 } from '@/helpers/functions'

export default {
  components: {
    PropsButtonClose,
    PopMenuItem,
    PropsButtonMenu,
    PopMenuHeader,
    ModalBoxDelete,
    PopMenu,
    ClientChat,
    ClientMessageQuoteUnderInput,
    ClientCardSelectCardMessages,
    ClientMessageInput,
    CardChat,
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
    status () { return this.$store.state.clientfilesandmessages.status },
    user () { return this.$store.state.user.user },
    employees () { return this.$store.state.employees.employees },
    canAddFiles () { return !this.$store.getters.isLicenseExpired },
    clientMessages () { return [...this.$store.state.clientfilesandmessages.cards.messages, ...this.$store.state.clientfilesandmessages.messages] },
    cards () { return this.$store.state.clientfilesandmessages.cards.cards },
    cardMessages () { return this.$store.state.cardfilesandmessages.messages },
    validateNumber () {
      const phone = this.currClient.phone
      return !isNaN(+phone.slice(1)) && phone.length === 12 && phone.startsWith('+7')
    },
    validateEmail () {
      return String(this.currClient.email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
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
      this.$store.commit(CLIENT_FILES_AND_MESSAGES.REFRESH_CARDS, [])
      this.clearCardChat()
      this.$store.dispatch('asidePropertiesToggle', false)
    },
    removeClient () {
      this.showConfirm = false
      this.$store.dispatch(CLIENTS.REMOVE_CLIENT, this.selectedClient)
      this.$store.dispatch('asidePropertiesToggle', false)
    },
    updateClient () {
      if (this.checkForm()) {
        this.$store.dispatch(CLIENTS.UPDATE_CLIENT, this.currClient)
      }
    },
    selectCard (uid) {
      this.$store.dispatch(MESSAGES_REQUEST, uid)
    },
    clearCardChat () {
      this.$store.commit(REFRESH_FILES, [])
      this.$store.commit(REFRESH_MESSAGES, [])
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
    }
  }
}
</script>
