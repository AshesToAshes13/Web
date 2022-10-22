
<template>
  <div
    v-if="errorMessage"
    class="text-red-500"
  >
    {{ errorMessage }}
  </div>
  <div
    v-if="!imageLoaded && !errorMessage"
    class="rounded-[6px] animate-pulse"
  >
    <ChatLoader
      width="250px"
      height="150px"
      align="center"
    />
  </div>
  <a
    :href="imageSrc"
    target="_blank"
  >
    <img
      v-if="imageLoaded"
      id="imageFromCardChat"
      class="rounded-[8px] max-h-[250px]"
      :src="imageSrc"
      alt="chat image"
    >
  </a>
  <a
    :href="imageSrc"
    target="_blank"
    class="text-[#7E7E80] font-[500] leading-[15px] text-[13px] text-right mt-[8px] inline-block truncate w-full"
    :title="fileName"
  >
    {{ fileName }}
  </a>
  <p
    class="leading-[13px] text-[11px] font-[700] text-right mt-[8px] group-hover:hidden min-w-[30px]"
    style="color: rgba(0, 0, 0, 0.4);"
  >
    {{ fileDateCreate }}
  </p>
  <div class="group-hover:flex hidden justify-end">
    <CardChatMessageOptionsPopMenu
      :can-delete="canDelete"
      :is-show-new-cover="true"
      @onQuoteMessage="onQuoteMessage"
      @onDeleteMessage="onDeleteMessage"
      @onNewCardCover="onNewCardCover"
    >
      <div class="min-w-[30px] mt-[5px] min-h-[16px] flex cursor-pointer items-end justify-center">
        <svg
          width="14"
          height="4"
          viewBox="0 0 14 4"
          class="mb-1"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.2004 2.0001C10.2004 1.11644 10.9167 0.400098 11.8004 0.400098C12.684 0.400098 13.4004 1.11644 13.4004 2.0001C13.4004 2.88375 12.684 3.6001 11.8004 3.6001C10.9167 3.6001 10.2004 2.88375 10.2004 2.0001Z"
            fill="#4C4C4D"
          />
          <path
            d="M5.40039 2.0001C5.40039 1.11644 6.11673 0.400098 7.00039 0.400098C7.88405 0.400098 8.60039 1.11644 8.60039 2.0001C8.60039 2.88375 7.88405 3.6001 7.00039 3.6001C6.11673 3.6001 5.40039 2.88375 5.40039 2.0001Z"
            fill="#4C4C4D"
          />
          <path
            d="M0.60039 2.0001C0.60039 1.11644 1.31674 0.400098 2.20039 0.400098C3.08405 0.400098 3.80039 1.11644 3.80039 2.0001C3.80039 2.88375 3.08405 3.6001 2.20039 3.6001C1.31674 3.6001 0.60039 2.88375 0.60039 2.0001Z"
            fill="#4C4C4D"
          />
        </svg>
      </div>
    </CardChatMessageOptionsPopMenu>
  </div>
</template>
<script>
import { FILE_REQUEST } from '@/store/actions/cardfilesandmessages'
import { writeCache } from '@/store/helpers/functions'

import CardChatMessageOptionsPopMenu from '@/components/CardProperties/CardChatMessageOptionsPopMenu.vue'
import * as CARDS from '@/store/actions/cards'
import * as CARDSFILESANDMESSAGES from '@/store/actions/cardfilesandmessages'
import ChatLoader from '../ChatLoader.vue'

export default {
  components: {
    CardChatMessageOptionsPopMenu,
    ChatLoader
  },
  props: {
    fileUid: {
      type: String,
      default: ''
    },
    fileName: {
      type: String,
      default: ''
    },
    fileSize: {
      type: Number,
      default: null
    },
    fileExtension: {
      type: String,
      default: ''
    },
    fileDateCreate: {
      type: String,
      default: ''
    },
    preloaderColor: {
      type: String,
      default: ''
    },
    canDelete: {
      type: Boolean,
      default: true
    },
    fileAction: {
      type: String,
      default: FILE_REQUEST
    }
  },

  emits: ['onQuoteMessage', 'onDeleteMessage', 'onNewCardCover'],

  data () {
    return {
      imageLoaded: false,
      imageSrc: '',
      blobImageForm: '',
      errorMessage: ''
    }
  },
  computed: {
    selectedCardUid () { return this.$store.state.cards.cards.selectedCardUid },
    selectedCard () { return this.$store.getters.selectedCard }

  },
  mounted () {
    if (this.isFileInCache()) {
      this.loadImageFromCache()
    } else {
      this.loadImageFromInternet()
    }
  },
  methods: {
    isFileInCache () {
      return !!localStorage.getItem(this.fileUid)
    },

    b64toBlob (base64) {
      return fetch(base64).then(res => res.blob())
    },
    onQuoteMessage () {
      this.$emit('onQuoteMessage')
    },
    onDeleteMessage () {
      this.$emit('onDeleteMessage')
    },
    onNewCardCover () {
      const formData = new FormData()
      formData.append('files[0]', this.blobImageForm)
      const data = {
        cardUid: this.selectedCard?.uid,
        file: formData
      }
      this.$store.dispatch(CARDS.CHANGE_CARD_COVER, data).then((resp) => {
        if (this.selectedCard) {
          this.selectedCard.cover_link = resp.data.card.cover_link
          this.selectedCard.cover_color = resp.data.card.cover_color
        }
        let messageBlob
        for (const message of resp.data.newfiles) {
          messageBlob = message
        }
        console.log(messageBlob)
        this.$store.dispatch(CARDSFILESANDMESSAGES.DELETE_FILE_REQUEST, messageBlob.uid)
      })
    },

    loadImageFromInternet () {
      const action = this.fileAction || FILE_REQUEST
      this.$store.dispatch(action, this.fileUid).then((resp) => {
        const imageBlob = new Blob([resp.data], { type: 'image/' + this.fileExtension })
        this.blobImageForm = imageBlob
        writeCache(this.fileUid, imageBlob)
        const urlCreator = window.URL || window.webkitURL
        const imageURL = urlCreator.createObjectURL(imageBlob)
        this.imageSrc = imageURL
        this.imageLoaded = true
      })
        .catch(err => {
          this.errorMessage = err.message
          this.imageLoaded = true
        })
    },

    loadImageFromCache () {
      const cachedImageBase64 = localStorage.getItem(this.fileUid)
      this.b64toBlob(cachedImageBase64).then(imageBlob => {
        const urlCreator = window.URL || window.webkitURL
        const imageURL = urlCreator.createObjectURL(imageBlob)
        this.blobImageForm = imageBlob
        this.imageSrc = imageURL
        this.imageLoaded = true
      })
    }
  }
}
</script>
