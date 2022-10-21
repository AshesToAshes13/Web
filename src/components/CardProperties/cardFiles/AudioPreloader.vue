<template>
  <div
    v-if="!audioLoaded"
  >
    <svg
      class="inline mr-2 w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-orange-400"
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
    <span class="sr-only">Loading...</span>
  </div>
  <div v-if="audioLoaded">
    <figure>
      <audio
        class="w-[280px]"
        controls
        :src="audioSrc"
      >
        Your browser does not support the
        <code>audio</code> element.
      </audio>
    </figure>
  </div>
  <p class="text-[#7E7E80] font-[500] leading-[15px] text-[13px] text-right mt-[8px] truncate">
    {{ fileName }}
  </p>
  <p
    class="leading-[13px] text-[11px] font-[700] text-right mt-[8px] group-hover:hidden min-w-[30px]"
    style="color: rgba(0, 0, 0, 0.4);"
  >
    {{ fileDateCreate }}
  </p>
  <div class="group-hover:flex hidden justify-end">
    <card-chat-message-options-pop-menu
      :can-delete="canDelete"
      @onQuoteMessage="$emit('onQuoteMessage')"
      @onDeleteMessage="$emit('onDeleteMessage')"
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
    </card-chat-message-options-pop-menu>
  </div>
</template>
<script>
import { FILE_REQUEST } from '@/store/actions/cardfilesandmessages'
import { writeCache } from '@/store/helpers/functions'

import CardChatMessageOptionsPopMenu from '@/components/CardProperties/CardChatMessageOptionsPopMenu.vue'

export default {
  components: {
    CardChatMessageOptionsPopMenu
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
  emits: ['onQuoteMessage', 'onDeleteMessage'],
  data () {
    return {
      audioLoaded: false,
      audoSrc: ''
    }
  },

  mounted () {
    this.loadAudioFromInternet()
  },
  methods: {
    loadAudioFromInternet () {
      const action = this.fileAction || FILE_REQUEST
      this.$store.dispatch(action, this.fileUid).then((resp) => {
        const imageBlob = new Blob([resp.data], { type: 'audio/' + this.fileExtension })
        writeCache(this.fileUid, imageBlob)
        const urlCreator = window.URL || window.webkitURL
        const imageURL = urlCreator.createObjectURL(imageBlob)
        this.audioSrc = imageURL
        this.audioLoaded = true
      })
    }
  }
}
</script>
