<template>
  <ClientModal
    v-if="showClientModal"
    :client-uid="selectedCard.uid_client"
    @closeModal="showClientModal = false"
  />
  <BoardModalBoxDelete
    v-if="showDeleteCard"
    title="Удалить карточку"
    text="Вы действительно хотите удалить карточку?"
    @cancel="showDeleteCard = false"
    @yes="removeCard"
  />
  <CardMessagesModalBoxLimit
    v-if="showMessagesLimit"
    @cancel="showMessagesLimit = false"
    @ok="showMessagesLimit = false"
  />
  <CardModalBoxBudget
    v-if="showChangeCardBudget"
    :value="selectedCard?.cost / 100"
    :show="showChangeCardBudget"
    title="Бюджет карточки"
    @cancel="showChangeCardBudget = false"
    @save="changeCardBudget"
  />
  <TaskPropertiesModalBoxFileSizeLimit
    v-if="showFileSizeLimit"
    :files="tooBigFiles"
    @cancel="showFileSizeLimit = false"
  />
  <div
    v-if="selectedCard"
    class="break-words z-1"
  >
    <div class="flex items-center justify-between mb-[10px]">
      <CardOptions
        :date-create="selectedCard?.date_create"
        :can-edit="canEdit"
        :creator="selectedCard?.uid_creator"
        :show-files-only="showFilesOnly"
        @clickRemoveButton="showDeleteCard = true"
        @toggleShowOnlyFiles="showFilesOnly = !showFilesOnly"
      />
      <PropsButtonClose
        @click="closeProperties"
      />
    </div>
    <div
      id="generalscroll"
    >
      <CardCover
        :cover-color="
          selectedCard?.cover_color === '#A998B6' ? '' : selectedCard?.cover_color
        "
        :cover-link="selectedCard?.cover_link"
        :can-edit="canEdit"
        @onChangeCardColor="changeCardColor"
        @onChangeCardCover="changeCardCover"
        @onChangeCardClearCover="changeCardClearCover"
      />

      <CardName
        :card-name="selectedCard?.name"
        :can-edit="canEdit"
        @changeName="changeName"
        @onPasteFile="onPasteEvent"
      />

      <div
        v-if="canEdit"
        class="mb-[4px] w-full"
      >
        <PopMenu
          class="grow w-[calc(100%+24px)]"
        >
          <div
            class="group w-full flex items-center gap-[12px] px-[12px] min-h-[34px] border border-black/12 rounded-[6px] cursor-pointer"
          >
            <div class="grow font-roboto text-[#575758] text-[12px] font-[500] w-11/12 break-words">
              {{ selectedColumnName }}
            </div>
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M10.7603 3.56099C11.0027 3.80668 11.0001 4.2024 10.7544 4.44486L6.7011 8.44486C6.47139 8.67154 6.10687 8.68606 5.85986 8.47836L1.46875 4.78606C1.20456 4.56391 1.17047 4.16965 1.39262 3.90546C1.61477 3.64126 2.00903 3.60718 2.27322 3.82933L6.22845 7.15512L9.87642 3.55514C10.1221 3.31269 10.5178 3.31531 10.7603 3.56099Z"
                fill="#7E7E80"
              />
            </svg>
          </div>
          <template #menu>
            <div class="max-h-[220px] overflow-y-auto w-[322px] scroll-style">
              <PopMenuItem
                v-for="column in columnsUser"
                :key="column.UID"
                @click="setColumn(column.UID)"
              >
                <span class="truncate">
                  {{ column.Name }}
                </span>
              </PopMenuItem>
              <PopMenuDivider />
              <PopMenuItem
                v-for="column in columnsArchive"
                :key="column.UID"
                @click="setColumn(column.UID)"
              >
                <span class="truncate">
                  {{ column.Name }}
                </span>
              </PopMenuItem>
            </div>
          </template>
        </PopMenu>
      </div>

      <div class="flex flex-wrap justify-start items-center mb-[25px] gap-[4px]">
        <CardResponsibleUser
          :responsible="selectedCard?.user"
          :org-employees="orgEmployees"
          :can-edit="canEdit"
          @changeResponsible="changeResponsible"
        />
        <CardClient
          v-if="!isClientInCard"
          :client-uid="selectedCard?.uid_client"
          :client-name="selectedCard?.client_name"
          :card-name="selectedCard?.name"
          :card-comment="selectedCard?.comment"
          :can-edit="canEdit"
          @changeClient="onChangeClient"
        />
        <CardSetDate
          :date-time="selectedCard?.date_reminder"
          :date-text="cardDateReminderText"
          @changeDates="onChangeDates"
        />
        <CardBudget
          :budget="selectedCard?.cost"
          :can-edit="canEdit"
          @click="clickCardBudget"
          @onWipeBudget="changeCardBudget"
        />
      </div>
      <CardClientInfo
        v-if="isClientInCard && !showClientSkeleton"
        :current-client="clientInCard"
        @clickShowClientModalEmit="clickShowClientModal"
        @removeClientFromCardEmit="removeClientFromCard"
      />
      <ClientInfoSkeleton
        v-if="isClientInCard && showClientSkeleton"
      />
      <TaskPropsCommentEditor
        v-if="canEdit || selectedCard?.comment?.length > 0"
        class="mt-3 h-32 break-words"
        :comment="selectedCard?.comment"
        :can-edit="canEdit"
        @changeComment="changeComment"
        @onPasteFile="onPasteEvent"
      />

      <!-- Chat skeleton -->
      <MessageSkeleton v-if="status=='loading'" />
      <!-- Card chat -->
      <CardChat
        v-if="status=='success'"
        :messages="cardMessages"
        class="mt-[16px]"
        :current-user-uid="user.current_user_uid"
        :employees="employees"
        :show-files-only="showFilesOnly"
        @onQuote="setCurrentQuote"
        @onDeleteMessage="deleteCardMessage"
        @onDeleteFile="deleteCardFileMessage"
      />
    </div>

    <!-- Card chat input -->
    <div class="flex flex-col fixed bottom-[0px] w-[340px] bg-white pt-2 pb-5">
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
    </div>
  </div>
  <div v-else>
    <div class="flex justify-end items-center">
      <PropsButtonClose @click="closeProperties" />
    </div>
    <div
      class="mt-[25px] w-full font-roboto font-[18px] leading-[21px] text-[#424242] overflow-hidden text-ellipsis whitespace-nowrap"
    >
      Карточка не найдена
    </div>
  </div>
</template>

<script>
import {
  CREATE_MESSAGE_REQUEST,
  DELETE_MESSAGE_REQUEST,
  CREATE_FILES_REQUEST,
  DELETE_FILE_REQUEST,
  ADD_MESSAGE_LOCALLY,
  REMOVE_MESSAGE_LOCALLY
} from '@/store/actions/cardfilesandmessages'
import {
  CHANGE_CARD_RESPONSIBLE_USER,
  CHANGE_CARD_BUDGET,
  CHANGE_CARD_NAME,
  CHANGE_CARD_COMMENT,
  CHANGE_CARD_COLOR,
  CHANGE_CARD_COVER,
  CHANGE_CARD_CLEAR_COVER,
  CHANGE_CARD_DATE_REMINDER,
  CHANGE_CARD_UID_CLIENT,
  DELETE_CARD
} from '@/store/actions/cards'

import PopMenu from '@/components/Common/PopMenu.vue'
import PopMenuItem from '@/components/Common/PopMenuItem.vue'
import PopMenuDivider from '@/components/Common/PopMenuDivider.vue'
import CardName from '@/components/CardProperties/CardName.vue'
import CardCover from '@/components/CardProperties/CardCover.vue'
import CardChat from '@/components/CardProperties/CardChat.vue'
import CardResponsibleUser from '@/components/CardProperties/CardResponsibleUser.vue'
import CardClient from '@/components/CardProperties/CardClient.vue'
import CardSetDate from '@/components/CardProperties/CardSetDate.vue'
import CardOptions from '@/components/CardProperties/CardOptions.vue'
import CardBudget from '@/components/CardProperties/CardBudget.vue'
import CardMessageInput from '@/components/CardProperties/CardMessageInput.vue'
import TaskPropsCommentEditor from '@/components/TaskProperties/TaskPropsCommentEditor.vue'
import BoardModalBoxDelete from '@/components/Board/modalboxes/BoardModalBoxDelete.vue'
import CardModalBoxBudget from '@/components/CardProperties/CardModalBoxBudget.vue'
import CardMessageQuoteUnderInput from '@/components/CardProperties/CardMessageQuoteUnderInput.vue'
import CardMessagesModalBoxLimit from '../CardProperties/CardMessagesModalBoxLimit.vue'
import MessageSkeleton from '@/components/TaskProperties/MessageSkeleton.vue'
import PropsButtonClose from '@/components/Common/PropsButtonClose.vue'
import * as CARD from '@/store/actions/cards'
import TaskPropertiesModalBoxFileSizeLimit from '@/components/TaskProperties/TaskPropertiesModalBoxFileSizeLimit.vue'
import { uuidv4 } from '@/helpers/functions'
import ClientModal from '@/components/Clients/ClientModal'
import * as CLIENTS from '@/store/actions/clients'
import CardClientInfo from '../CardProperties/CardClientInfo.vue'
import ClientInfoSkeleton from '../CardProperties/ClientInfoSkeleton.vue'

export default {
  components: {
    ClientModal,
    PopMenu,
    PopMenuItem,
    PopMenuDivider,
    CardName,
    CardCover,
    CardChat,
    CardResponsibleUser,
    CardClient,
    CardOptions,
    CardBudget,
    CardMessageInput,
    TaskPropsCommentEditor,
    BoardModalBoxDelete,
    CardModalBoxBudget,
    CardMessageQuoteUnderInput,
    CardMessagesModalBoxLimit,
    MessageSkeleton,
    PropsButtonClose,
    TaskPropertiesModalBoxFileSizeLimit,
    CardSetDate,
    CardClientInfo,
    ClientInfoSkeleton
  },
  data () {
    return {
      showMessagesLimit: false,
      showChangeCardBudget: false,
      showFilesOnly: false,
      showFileSizeLimit: false,
      showClientModal: false,
      currentQuote: false,
      showDeleteCard: false,
      cardMessageInputValue: '',
      currentCard: null,
      tooBigFiles: [],
      clientInCard: {},
      showClientSkeleton: false
    }
  },
  computed: {
    status () { return this.$store.state.cardfilesandmessages.status },
    selectedCard () { return this.$store.getters.selectedCard },
    selectedCardUid () {
      return this.$store.state.cards.selectedCardUid
    },
    isClientInCard () {
      return this.selectedCard?.uid_client !== '00000000-0000-0000-0000-000000000000' && this.selectedCard?.uid_client
    },
    user () { return this.$store.state.user.user },
    selectedCardBoard () { return this.$store.state.boards.boards[this.selectedCard?.uid_board] || null },
    employees () { return this.$store.state.employees.employees },
    orgEmployees () { return this.$store.state.navigator.navigator.emps.items },
    cardMessages () {
      if (this.selectedCard?.uid_client !== '00000000-0000-0000-0000-000000000000' && this.selectedCard?.uid_client) {
        const clientMessages = [...this.$store.state.clientfilesandmessages.messages].filter(message => !message.clientFile)
        return [...clientMessages, ...this.$store.state.cardfilesandmessages.messages]
      }
      return this.$store.state.cardfilesandmessages.messages
    },
    canAddFiles () { return !this.$store.getters.isLicenseExpired },
    canEdit () { return this.selectedCardBoard && this.selectedCardBoard.type_access !== 0 },
    selectedColumnName () {
      const columnUid = this.selectedCard?.uid_stage
      const column = this.columns.find(col => col.UID === columnUid)
      const columnName = column?.Name ?? 'Неразобранное'
      return columnName
    },
    columnsUser () {
      const columns = [...this.selectedCardBoard?.stages]
      columns.sort((col1, col2) => {
      // сначала по порядку
        if (col1.Order > col2.Order) return 1
        if (col1.Order < col2.Order) return -1
        // если одинаковый, то по имени
        if (col1.Name > col2.Name) return 1
        if (col1.Name < col2.Name) return -1
        return 0
      })
      return columns
    },
    columnsArchive () {
      const columns = []
      columns.push({
        UID: 'f98d6979-70ad-4dd5-b3f8-8cd95cb46c67', // успех захардкорено на сервере
        Name: 'Успех',
        Order: Number.MAX_SAFE_INTEGER - 1,
        Color: ''
      })
      columns.push({
        UID: 'e70af5e2-6108-4c02-9a7d-f4efee78d28c', // отказ захардкорено на сервере
        Name: 'Отказ',
        Order: Number.MAX_SAFE_INTEGER,
        Color: ''
      })
      return columns
    },
    columns () {
      return [...this.columnsUser, ...this.columnsArchive]
    },
    cardDateReminderText () {
      if (!this.selectedCard?.date_reminder) {
        return ''
      } else {
        return this.dateToLabelFormat(new Date(this.selectedCard?.date_reminder))
      }
    }
  },
  watch: {
    selectedCardUid: {
      immediate: true,
      handler: function () {
        this.currentQuote = false
        this.cardMessageInputValue = ''
        if (this.isClientInCard) {
          this.showClientSkeleton = true
          this.$store.dispatch(CLIENTS.GET_CLIENT, this.selectedCard?.uid_client).then(resp => {
            this.clientInCard = resp.data
            this.showClientSkeleton = false
          })
        } else {
          this.isClientInCard = {}
        }
      }

    }
  },
  mounted () {
    if (this.isClientInCard) {
      this.showClientSkeleton = true
      this.$store.dispatch(CLIENTS.GET_CLIENT, this.selectedCard?.uid_client).then(resp => {
        this.clientInCard = resp.data
        this.showClientSkeleton = false
      })
    }
  },
  methods: {
    dateToLabelFormat (calendarDate) {
      const day = calendarDate.getDate()
      const month = calendarDate.toLocaleString('default', { month: 'short' })
      return day + ' ' + month
    },
    clickShowClientModal () {
      this.showClientModal = true
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
            uid_card: this.selectedCard?.uid,
            name: formData
          }
          this.$store.dispatch(CREATE_FILES_REQUEST, data).then(() => {
            if (this.selectedCard) this.selectedCard.has_files = true
            this.scrollDown()
          })
        }
      }
    },
    scrollDown () {
      const asideRight = document.getElementById('aside-right')
      asideRight.scroll({ top: asideRight.scrollHeight + 100000 })
    },
    focusMessageInput () {
      const messageInput = document.getElementById('card-message-textarea')
      messageInput.focus()
    },
    changeResponsible (userEmail) {
      if (this.selectedCard) this.selectedCard.user = userEmail
      this.$store
        .dispatch(CHANGE_CARD_RESPONSIBLE_USER, {
          cardUid: this.selectedCard?.uid,
          email: userEmail
        })
    },
    changeName (arg) {
      const data = { cardUid: this.selectedCard?.uid, name: arg.target.innerText.trim() }
      if (data.name === '') {
        data.name = 'Карточка без названия'
      }
      this.$store.dispatch(CHANGE_CARD_NAME, data)
    },
    clickCardBudget () {
      if (!this.canEdit) return
      this.showChangeCardBudget = true
    },
    changeCardBudget (budget) {
      const data = { cardUid: this.selectedCard?.uid, budget: budget * 100 }
      this.$store.dispatch(CHANGE_CARD_BUDGET, data).then((resp) => {
        if (this.selectedCard) this.selectedCard.cost = resp.data.cost
        this.showChangeCardBudget = false
      })
    },
    closeProperties () {
      this.$store.dispatch('asidePropertiesToggle', false)
    },
    changeComment (text) {
      if (!this.selectedCard) return
      const data = { cardUid: this.selectedCard.uid, comment: text }
      this.$store.dispatch(CHANGE_CARD_COMMENT, data)
      this.selectedCard.comment = text
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
        uid_card: this.selectedCard?.uid,
        name: formData
      }
      this.$store.commit('addCardMessages', uploadingFiles)
      this.$store.dispatch(CREATE_FILES_REQUEST, data).then(() => {
        if (this.selectedCard) this.selectedCard.has_files = true
        this.scrollDown()
      })
    },
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
        uid_card: this.selectedCard?.uid,
        uid: uid,
        uid_msg: uid,
        date_create: new Date().toISOString(),
        uid_creator: this.user.current_user_uid,
        uid_quote: this.currentQuote?.uid ?? '',
        text: this.cardMessageInputValue,
        msg: this.cardMessageInputValue,
        order: 0,
        deleted: 0
      }
      this.$store.dispatch(CREATE_MESSAGE_REQUEST, data).then(() => {
        if (this.selectedCard) this.selectedCard.has_msgs = true
        this.cardMessageInputValue = ''
        this.currentQuote = false
        this.scrollDown()
      })
    },
    changeCardClearCover () {
      if (this.selectedCard) this.selectedCard.cover_color = '#A998B6'
      this.$store
        .dispatch(CHANGE_CARD_CLEAR_COVER, { cardUid: this.selectedCard?.uid })
        .then((resp) => {
          if (this.selectedCard) {
            this.selectedCard.cover_link = ''
          }
          // Replacing old cover file with new cover file
          for (const message of resp.data.deletefiles) {
            this.$store.commit(REMOVE_MESSAGE_LOCALLY, message)
          }
          // Here I use nextTick because if we instantly start adding new files,
          // then onMounted hook won't be triggered, MAGIC but works
          this.$nextTick(() => {
            for (const message of resp.data.newfiles) {
              this.$store.commit(ADD_MESSAGE_LOCALLY, message)
            }
          })
        })
    },
    changeCardColor (color) {
      if (color) {
        if (this.selectedCard) this.selectedCard.cover_color = color
        this.$store
          .dispatch(CHANGE_CARD_COLOR, {
            cardUid: this.selectedCard?.uid,
            color: color
          })
          .then((resp) => {
            if (this.selectedCard) {
              this.selectedCard.cover_link = ''
            }
            // Replacing old cover file with new cover file
            for (const message of resp.data.deletefiles) {
              this.$store.commit(REMOVE_MESSAGE_LOCALLY, message)
            }
            // Here I use nextTick because if we instantly start adding new files,
            // then onMounted hook won't be triggered, MAGIC but works
            this.$nextTick(() => {
              for (const message of resp.data.newfiles) {
                this.$store.commit(ADD_MESSAGE_LOCALLY, message)
              }
            })
          })
      } else {
        this.changeCardClearCover()
      }
    },
    changeCardCover (event) {
      const files = event.target.files
      const formData = new FormData()
      for (let i = 0; i < files?.length; i++) {
        const file = files[i]
        formData.append('files[' + i + ']', file)
      }
      const data = {
        cardUid: this.selectedCard?.uid,
        file: formData
      }
      this.$store.dispatch(CHANGE_CARD_COVER, data).then((resp) => {
        if (this.selectedCard) {
          this.selectedCard.cover_color = resp.data.card.cover_color
          this.selectedCard.cover_link = resp.data.card.cover_link
        }
        // Replacing old cover file with new cover file
        for (const message of resp.data.deletefiles) {
          this.$store.commit(REMOVE_MESSAGE_LOCALLY, message)
        }
        // Here I use nextTick because if we instantly start adding new files,
        // then onMounted hook won't be triggered, MAGIC but works
        this.$nextTick(() => {
          for (const message of resp.data.newfiles) {
            this.$store.commit(ADD_MESSAGE_LOCALLY, message)
          }
        })
      })
    },
    removeCard () {
      this.$store.dispatch(DELETE_CARD, { uid: this.selectedCard?.uid })
        .then(() => {
          this.closeProperties()
          this.showDeleteCard = false
        })
    },
    setColumn (stageTo) {
      this.closeProperties()
      this.$store
        .dispatch(CARD.MOVE_ALL_CARDS, {
          cards: [{ uid: this.selectedCard?.uid }], stageTo, boardTo: this.selectedCardBoard?.uid
        })
        .then((resp) => {
          console.log('Card is moved')
        })
    },
    async onChangeClient (payload) {
      const [uid, name] = payload
      if (this.selectedCard) {
        this.showClientSkeleton = true
        this.selectedCard.uid_client = uid
        this.selectedCard.client_name = name
        await this.$store.dispatch(CHANGE_CARD_UID_CLIENT, this.selectedCard)
        const clientResponse = await this.$store.dispatch(CLIENTS.GET_CLIENT, this.selectedCard?.uid_client)
        this.clientInCard = clientResponse.data
        this.showClientSkeleton = false
      }
    },
    removeClientFromCard () {
      this.selectedCard.uid_client = ''
      this.selectedCard.client_name = ''
      this.$store.dispatch(CHANGE_CARD_UID_CLIENT, this.selectedCard)
    },
    onChangeDates: function (dateTimeString) {
      if (!this.selectedCard) return
      console.log(dateTimeString)
      if (!dateTimeString || dateTimeString === '0001-01-01T00:00:00') {
        this.selectedCard.date_reminder = null
      } else {
        this.selectedCard.date_reminder = dateTimeString
      }
      this.$store.dispatch(CHANGE_CARD_DATE_REMINDER, this.selectedCard)
    }
  }
}
</script>

<style scoped>
#generalscroll {
  height: calc(100vh - 126px);
  scrollbar-width: none;
  overflow-y: auto;
  width: 100%;
  overflow-x: hidden;
}
</style>
