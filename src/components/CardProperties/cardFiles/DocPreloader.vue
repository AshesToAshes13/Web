<template>
  <div class="flex space-x-[11px]">
    <div
      v-if="isFileUploading"
      class="self-center"
      role="status"
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
    <svg
      v-else
      width="26"
      height="30"
      style="min-width: 26px; min-height: 30px"
      viewBox="0 0 26 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M25.267 8.63331L25.267 8.63333C25.3003 8.73333 25.3337 8.86667 25.3337 9V27.3333C25.3337 28.6333 24.3003 29.6667 23.0003 29.6667H3.00033C1.70033 29.6667 0.666992 28.6333 0.666992 27.3333V2.33333C0.666992 1.03333 1.70033 0 3.00033 0H16.3337C16.467 0 16.6003 0.0333333 16.667 0.0666667H16.7003C16.7337 0.0833333 16.7587 0.1 16.7837 0.116667C16.8087 0.133333 16.8337 0.15 16.867 0.166667C16.9337 0.2 17.0003 0.266667 17.0337 0.3L25.0337 8.3L25.0337 8.30001C25.1003 8.36667 25.1337 8.4 25.167 8.46667C25.2003 8.5 25.2337 8.56665 25.267 8.63331ZM3.00033 2C2.80033 2 2.66699 2.13333 2.66699 2.33333V27.3333C2.66699 27.5333 2.80033 27.6667 3.00033 27.6667H23.0003C23.2003 27.6667 23.3337 27.5333 23.3337 27.3333V10H17.667C16.367 10 15.3337 8.96667 15.3337 7.66667V2H3.00033ZM17.3337 7.66667C17.3337 7.86667 17.467 8 17.667 8H21.9337L17.3337 3.4V7.66667ZM6.40033 12C5.81122 12 5.33366 12.4776 5.33366 13.0667C5.33366 13.6558 5.81122 14.1333 6.40033 14.1333H19.267C19.8561 14.1333 20.3337 13.6558 20.3337 13.0667C20.3337 12.4776 19.8561 12 19.267 12H6.40033ZM5.33366 9.4C5.33366 8.8109 5.81122 8.33333 6.40033 8.33333H12.6003C13.1894 8.33333 13.667 8.8109 13.667 9.4C13.667 9.9891 13.1894 10.4667 12.6003 10.4667H6.40033C5.81122 10.4667 5.33366 9.9891 5.33366 9.4ZM6.40033 15.6667C5.81122 15.6667 5.33366 16.1442 5.33366 16.7333C5.33366 17.3224 5.81122 17.8 6.40033 17.8H19.267C19.8561 17.8 20.3337 17.3224 20.3337 16.7333C20.3337 16.1442 19.8561 15.6667 19.267 15.6667H6.40033ZM5.33366 20.4C5.33366 19.8109 5.81122 19.3333 6.40033 19.3333H19.267C19.8561 19.3333 20.3337 19.8109 20.3337 20.4C20.3337 20.9891 19.8561 21.4667 19.267 21.4667H6.40033C5.81122 21.4667 5.33366 20.9891 5.33366 20.4ZM6.40033 23C5.81122 23 5.33366 23.4776 5.33366 24.0667C5.33366 24.6558 5.81122 25.1333 6.40033 25.1333H19.267C19.8561 25.1333 20.3337 24.6558 20.3337 24.0667C20.3337 23.4776 19.8561 23 19.267 23H6.40033Z"
        fill="black"
        fill-opacity="0.5"
      />
    </svg>
    <div class="flex flex-col space-y-[2px]">
      <p
        v-if="!fileIsDownloaded"
        class="text-[#4C4C4D] max-w-[100px] truncate text-[13px] leading-[15px] font-[700] cursor-pointer"
        style="word-break: break-word"
        @click.stop="loadFileFromInternet"
      >
        {{ fileName }}
      </p>
      <a
        v-if="fileIsDownloaded"
        ref="fileLink"
        :href="fileURL"
        target="_blank"
        :download="fileName"
        style="word-break: break-word"
        class="text-[#4C4C4D] max-w-[100px] truncate text-[13px] leading-[15px] font-[700]"
      >
        {{ fileName }}
      </a>
      <div class="flex justify-between items-center">
        <p class="text-[#7E7E80] text-[12px] leading-[14px] font-[400]">
          {{ fileSize }}
        </p>
        <p
          class="font-[700] ml-2 text-[11px] leading-[13px] group-hover:hidden min-w-[30px]"
          style="color: rgba(0, 0, 0, 0.4);"
        >
          {{ fileDateCreate }}
        </p>
        <div
          :ref="`message-file-icon-${fileUid}`"
          class="group-hover:flex justify-end"
          :class="{'hidden': !isShowMenu}"
        >
          <CardChatMessageOptionsPopMenu
            :can-delete="canDelete"
            @onQuoteMessage="$emit('onQuoteMessage')"
            @onDeleteMessage="$emit('onDeleteMessage')"
            @openMenu="lockVisibility(fileUid)"
            @closeMenu="unlockVisibility(fileUid)"
          >
            <div class="min-w-[30px] ml-2 min-h-[14px] flex cursor-pointer items-end justify-center">
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
      </div>
    </div>
  </div>
</template>
<script>
import { FILE_REQUEST } from '@/store/actions/cardfilesandmessages'

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
    fileSize: {
      type: String,
      default: ''
    },
    fileDateCreate: {
      type: String,
      default: ''
    },
    isFileUploading: {
      type: Boolean,
      default: false
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
      fileURL: '',
      isShowMenu: false,
      fileIsDownloaded: false
    }
  },
  methods: {
    loadFileFromInternet () {
      const action = this.fileAction || FILE_REQUEST
      this.$store.dispatch(action, this.fileUid).then((resp) => {
        const imageBlob = new Blob([resp.data], { type: 'text/plain' })
        const urlCreator = window.URL || window.webkitURL
        this.fileURL = urlCreator.createObjectURL(imageBlob)
        this.fileIsDownloaded = true
        this.$nextTick(() => {
          this.$refs.fileLink.click()
        })
      })
    },
    lockVisibility (messageUid) {
      const icon = this.$refs[`message-file-icon-${messageUid}`]
      icon.style.visibility = 'visible'
      this.isShowMenu = true
    },
    unlockVisibility (messageUid) {
      const icon = this.$refs[`message-file-icon-${messageUid}`]
      icon.style.visibility = null
      this.isShowMenu = false
    }
  }
}
</script>
