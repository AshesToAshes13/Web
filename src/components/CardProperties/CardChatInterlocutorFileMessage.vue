<template>
  <div
    class="bg-[#FCEBEB] py-[12px] px-[12px] rounded-t-[12px] rounded-br-[12px] mb-[5px] float-left max-w-[300px] group"
  >
    <CardChatDeletedMessageContent v-if="message.deleted" />
    <ImagePreloader
      v-else-if="FileIsImage"
      :file-uid="message.uid"
      :file-extension="fileExtension"
      :file-name="message.file_name"
      :file-date-create="getMessageTimeString(message.date_create)"
      :can-delete="false"
      preloader-color="#FCEBEB"
      @onQuoteMessage="setCurrentQuote"
    />
    <AudioPreloader
      v-else-if="FileIsAudio"
      :file-uid="message.uid"
      :file-extension="fileExtension"
      :file-name="message.file_name"
      :file-date-create="getMessageTimeString(message.date_create)"
      :file-action="message.clientFile ? FILE_REQUEST : null"
      :can-delete="false"
      @onQuoteMessage="setCurrentQuote"
    />
    <DocPreloader
      v-else-if="FileIsDoc"
      :file-uid="message.uid"
      :file-name="message.file_name"
      :file-extension="fileExtension"
      :file-size="formatBytes(message.file_size)"
      :file-date-create="getMessageTimeString(message.date_create)"
      :can-delete="false"
      :file-action="message.clientFile ? FILE_REQUEST : null"
      @onQuoteMessage="setCurrentQuote"
    />
    <MoviePreloader
      v-else-if="FileIsMovie"
      :file-uid="message.uid"
      :file-name="message.file_name"
      :file-extension="fileExtension"
      :file-size="formatBytes(message.file_size)"
      :file-date-create="getMessageTimeString(message.date_create)"
      :can-delete="false"
      :route-file-name="message.clientFile ? 'clientfile' : null"
      @onQuoteMessage="setCurrentQuote"
    />
    <FilePreloader
      v-else
      :file-uid="message.uid"
      :file-name="message.file_name"
      :file-extension="fileExtension"
      :file-size="formatBytes(message.file_size)"
      :file-date-create="getMessageTimeString(message.date_create)"
      :can-delete="false"
      :file-action="message.clientFile ? FILE_REQUEST : null"
      @onQuoteMessage="setCurrentQuote"
    />
  </div>
</template>

<script>
import ImagePreloader from '@/components/CardProperties/cardFiles/ImagePreloader.vue'
import AudioPreloader from '@/components/CardProperties/cardFiles/AudioPreloader.vue'
import DocPreloader from '@/components/CardProperties/cardFiles/DocPreloader.vue'
import MoviePreloader from '@/components/CardProperties/cardFiles/MoviePreloader.vue'
import FilePreloader from '@/components/CardProperties/cardFiles/FilePreloader.vue'
import CardChatDeletedMessageContent from '@/components/CardProperties/CardChatDeletedMessageContent.vue'
import { FILE_REQUEST } from '@/store/actions/clientfilesandmessages'

export default {
  components: {
    ImagePreloader,
    AudioPreloader,
    DocPreloader,
    MoviePreloader,
    FilePreloader,
    CardChatDeletedMessageContent
  },
  props: {
    message: {
      type: Object,
      default: () => {}
    }
  },
  emits: ['onQuoteMessage'],
  data () {
    return {
      FILE_REQUEST
    }
  },
  computed: {
    fileExtension () {
      const splittedValue = this.message.file_name.split('.')
      return splittedValue[splittedValue.length - 1].toLowerCase()
    },
    FileIsImage () {
      return ['jpg', 'png', 'jpeg', 'git', 'bmp', 'gif'].includes(
        this.fileExtension
      )
    },
    FileIsMovie () {
      return ['mov', 'mp4'].includes(this.fileExtension)
    },
    FileIsDoc () {
      return ['doc', 'docx', 'xls', 'xlsx', 'txt', 'pdf'].includes(
        this.fileExtension
      )
    },
    FileIsAudio () {
      return ['mp3', 'wav'].includes(this.fileExtension)
    }
  },
  methods: {
    formatBytes (bytes, decimals = 2) {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const dm = decimals < 0 ? 0 : decimals
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
    },

    setCurrentQuote () {
      this.$emit('onQuoteMessage', this.message)
    },

    getMessageTimeString (dateCreate) {
      if (!dateCreate) return ''
      const date = new Date(dateCreate)
      return date.toLocaleString('default', {
        hour: 'numeric',
        minute: 'numeric'
      })
    }
  }
}
</script>

<style scoped></style>
