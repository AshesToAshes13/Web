<template>
  <CardMessageQuoteUnderInput
    v-if="currentQuote"
    class="quote-request border-l-2 border-[#7E7E80] h-[40px]"
    :quote-message="currentQuote"
    :employee="employees[currentQuote.uid_creator]"
    @onClearQuote="currentQuote = false"
  />
  <CardMessageInput
    v-model="cardMessageInputValue"
    :can-add-files="canAddFiles"
    @createCardMessage="createCardMessage"
    @createCardFile="createCardFile"
    @onPaste="onPasteEvent"
  />
  <DoitnowChatInCard
    :messages="cardMessages"
    :current-user-uid="userUid"
    :employees="employees"
    :show-files-only="false"
    :in-doitnow="true"
    @onQuote="setCurrentQuote"
    @onDeleteMessage="deleteCardMessage"
    @onDeleteFile="deleteCardFileMessage"
  />
</template>

<script>
import {
  CREATE_FILES_REQUEST,
  CREATE_MESSAGE_REQUEST,
  DELETE_FILE_REQUEST,
  DELETE_MESSAGE_REQUEST
} from '@/store/actions/cardfilesandmessages'
import CardMessageInput from '@/components/CardProperties/CardMessageInput'
import { uuidv4, isFilePreloadable } from '@/helpers/functions'
import CardMessageQuoteUnderInput from '@/components/CardProperties/CardMessageQuoteUnderInput'
import DoitnowChatInCard from './DoitnowChatInCard.vue'

export default {
  components: {
    CardMessageQuoteUnderInput,
    CardMessageInput,
    DoitnowChatInCard
  },
  props: {
    cardMessages: {
      type: Array,
      default: () => ([]),
      required: true
    },
    userUid: {
      type: String,
      default: '',
      required: true
    },
    cardUid: {
      type: String,
      default: '',
      required: true
    }
  },
  data () {
    return {
      currentQuote: false,
      cardMessageInputValue: ''
    }
  },
  computed: {
    employees () {
      return this.$store.state.employees.employees
    },
    canAddFiles () {
      return !this.$store.getters.isLicenseExpired
    }
  },
  methods: {
    setCurrentQuote (quote) {
      this.currentQuote = quote
      this.focusMessageInput()
    },
    deleteCardMessage (uid) {
      this.$store.dispatch(DELETE_MESSAGE_REQUEST, uid)
    },
    deleteCardFileMessage (uid) {
      const messages = this.$store.state.cardfilesandmessages.messages
      let hasMessage = false

      this.$store.dispatch(DELETE_FILE_REQUEST, uid).then(() => {
        for (let i = 0; i < messages.length; i++) {
          if (messages[i].uid_file) {
            hasMessage = true
            break
          }
        }
        if (!hasMessage) {
          this.selectedCard.has_files = hasMessage
        }
      })
    },
    focusMessageInput () {
      const messageInput = document.getElementById('card-message-textarea')
      messageInput.focus()
    },
    createCardMessage () {
      // если лицензия истекла
      if (this.$store.getters.isLicenseExpired) {
        this.showMessagesLimit = true
        return
      }
      if (this.cardMessageInputValue <= 0) {
        return
      }
      const uid = uuidv4()
      const data = {
        uid_card: this.cardUid,
        uid: uid,
        uid_msg: uid,
        date_create: new Date().toISOString(),
        uid_creator: this.userUid,
        uid_quote: this.currentQuote?.uid ?? '',
        text: this.cardMessageInputValue,
        msg: this.cardMessageInputValue,
        order: 0,
        deleted: 0
      }
      this.$store.dispatch(CREATE_MESSAGE_REQUEST, data).then(() => {
        this.cardMessageInputValue = ''
        this.currentQuote = false
      })
    },
    createCardFile (event) {
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
          continue
        }

        formData.append('files[' + i + ']', file)

        // проверяем если файл не нуждается в прелоуде, тогда добавляем его псевдоданные
        // чтобы отобразить, что файл / файлы загружаются
        const fileExtension = file?.name?.split('.')?.pop()?.toLowerCase()
        if (!isFilePreloadable(fileExtension)) {
          uploadingFiles.push({
            uid: uuidv4(),
            uid_creator: this.userUid,
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
        uid_card: this.cardUid,
        name: formData
      }
      this.$store.commit('addCardMessages', uploadingFiles)
      this.$store.dispatch(CREATE_FILES_REQUEST, data)
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
            uid_card: this.cardUid,
            name: formData
          }
          this.$store.dispatch(CREATE_FILES_REQUEST, data)
        }
      }
    }
  }
}
</script>
