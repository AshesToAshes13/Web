<template>
  <div class="flex overflow-hidden">
    <div class="w-[420px] shrink-0 overflow-y-auto scroll-style p-[25px]">
      <ClientProperties
        :client="selectedClient"
        :cards="cards"
      />
    </div>
    <div class="grow flex flex-col px-[25px] pt-[30px] pb-[10px] border-l border-[rgba(0,0,0,.1)]">
      <p class="font-[700] font-[18px] text-[#424242] mb-[30px]">
        Коментарии
      </p>
      <div
        id="chat-component"
        class="grow relative overflow-hidden scroll-style overflow-y-auto"
      >
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
        <MessageSkeleton v-if="showSkeletonMsg" />
        <ClientChat
          v-else
          class="!pb-[20px]"
          :messages="clientMessages"
          :current-user-uid="user.current_user_uid"
          :employees="employees"
          :show-files-only="showFilesOnly"
          @onQuote="setCurrentQuote"
          @onDeleteMessage="deleteClientMessage"
          @onDeleteFile="deleteClientFileMessage"
        />
      </div>
      <div
        v-if="messagesStatus === 'success'"
        class="flex flex-col bg-white"
      >
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
    </div>
  </div>
</template>

<script>
import ClientMessageInput from '@/components/Clients/ClientMessageInput'
import ClientMessageQuoteUnderInput from '@/components/Clients/ClientMessageQuoteUnderInput'
import ClientChat from '@/components/Clients/ClientChat'
import MessageSkeleton from '@/components/TaskProperties/MessageSkeleton'
import ClientCardChatMessages from '@/components/Clients/ClientCardChatMessages'
import ClientProperties from '@/components/Clients/ClientProperties'
import * as CLIENTS from '@/store/actions/clients'
import * as CLIENT_FILES_AND_MESSAGES from '@/store/actions/clientfilesandmessages'
import { uuidv4 } from '@/helpers/functions'
import { REFRESH_FILES } from '@/store/actions/cardfilesandmessages'
import { GET_CLIENT_CARDS, REFRESH_CARDS } from '@/store/actions/clientfilesandmessages'
import { GET_CLIENT } from '@/store/actions/clients'

export default {
  components: { ClientMessageInput, ClientMessageQuoteUnderInput, ClientChat, MessageSkeleton, ClientCardChatMessages, ClientProperties },
  props: {
    clientUid: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      showFilesOnly: false,
      currentQuote: false,
      clientMessageInputValue: ''
    }
  },
  computed: {
    selectedClient () {
      return this.$store.state.clients.selectedClient ?? ''
    },
    cards () { return this.$store.state.clientfilesandmessages.cards.cards },
    cardMessages () { return this.$store.state.clientfilesandmessages.cards.messages },
    user () { return this.$store.state.user.user },
    employees () { return this.$store.state.employees.employees },
    messagesStatus () { return this.$store.state.clientfilesandmessages.status },
    cardsStatus () { return this.$store.state.clientfilesandmessages.cards.status },
    corpYandexIntegration () {
      return this.$store.state.corpYandexIntegration.isIntegrated
    },
    showSkeletonMsg () {
      return this.cardsStatus === 'loading' && this.messagesStatus === 'loading' && this.yandexIntegrationStatus
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
    clientMessages () { return this.$store.state.clientfilesandmessages.messages },
    canAddFiles () { return !this.$store.getters.isLicenseExpired },
    isCorpMegafonIntegrated () {
      return this.$store.state.corpMegafonIntegration.isIntegrated
    }
  },
  mounted () {
    this.loadMessages()
  },
  unmounted () {
    this.$store.commit(CLIENTS.SELECT_CLIENT, null)
  },
  methods: {
    setCurrentQuote (quote) {
      this.currentQuote = quote
      console.log(quote)
      this.focusMessageInput()
    },
    focusMessageInput () {
      const messageInput = document.getElementById('client-message-textarea')
      messageInput.focus()
    },
    deleteClientMessage (uid) {
      this.$store.dispatch(CLIENT_FILES_AND_MESSAGES.DELETE_MESSAGE_REQUEST, uid)
    },
    deleteClientFileMessage (uid) {
      this.$store.dispatch(CLIENT_FILES_AND_MESSAGES.DELETE_FILE_REQUEST, uid)
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
    isFilePreloadable (fileExtension) {
      const preloadableFiles = ['jpg', 'png', 'jpeg', 'git', 'bmp', 'gif', 'mov', 'mp4', 'mp3', 'wav']
      return preloadableFiles.includes(fileExtension)
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
    scrollDown () {
      this.$nextTick(() => {
        const asideRight = document.getElementById('chat-component')
        asideRight.scrollTop = asideRight.scrollHeight
      })
    },
    async loadMessages () {
      this.$store.commit(CLIENT_FILES_AND_MESSAGES.REFRESH_MESSAGES)
      this.$store.commit(CLIENT_FILES_AND_MESSAGES.REFRESH_FILES)
      this.$store.commit(REFRESH_FILES, [])
      this.$store.commit(REFRESH_CARDS)

      if (!this.selectedClient) {
        await this.$store.dispatch(GET_CLIENT, this.clientUid)
      }

      const data = {
        clientUid: this.selectedClient.uid,
        clientEmail: this.selectedClient.email,
        clientPhone: this.selectedClient.phone,
        crmKey: this.$store.state.corpMegafonIntegration.crmKey,
        corpYandexInt: this.corpYandexIntegration,
        personalYandexInt: this.personalYandexIntegration,
        megafonIntegration: this.isCorpMegafonIntegrated
      }

      this.$store.dispatch(CLIENT_FILES_AND_MESSAGES.FETCH_FILES_AND_MESSAGES, data)
      this.$store.dispatch(GET_CLIENT_CARDS, this.selectedClient.uid)
    }
  }
}
</script>
