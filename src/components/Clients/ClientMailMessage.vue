<template>
  <div
    class="flex w-full"
  >
    <ClientMailMessageModal
      v-if="showModal"
      :subject="message.subject"
      :message="message.msg"
      @closeModal="showModal = false"
    />
    <div class="flex flex-col max-w-[800px] mr-[10px]">
      <div class="flex w-full items-center gap-x-[10px] mb-[13px]">
        <svg
          class="shrink-0"
          width="14"
          height="11"
          viewBox="0 0 14 11"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13 0.5H1C0.734784 0.5 0.48043 0.605357 0.292893 0.792893C0.105357 0.98043 0 1.23478 0 1.5V9.5C0 9.76522 0.105357 10.0196 0.292893 10.2071C0.48043 10.3946 0.734784 10.5 1 10.5H13C13.2652 10.5 13.5196 10.3946 13.7071 10.2071C13.8946 10.0196 14 9.76522 14 9.5V1.5C14 1.23478 13.8946 0.98043 13.7071 0.792893C13.5196 0.605357 13.2652 0.5 13 0.5V0.5ZM11.9 1.5L7 4.89L2.1 1.5H11.9ZM1 9.5V1.955L6.715 5.91C6.7987 5.96806 6.89813 5.99918 7 5.99918C7.10187 5.99918 7.2013 5.96806 7.285 5.91L13 1.955V9.5H1Z"
            fill="#747476"
          />
        </svg>

        <p
          class="text-[14px] text-[#747476] font-[400]"
          :title="message.subject"
        >
          Тема: {{ message.subject }}
        </p>
      </div>
      <span
        v-if="true"
        class="w-full break-words py-[10px] px-[17px] text-[#4C4C4D] mb-[14px] min-h-[60px]"
        v-html="croppedMessage"
      />
      <button
        class="bg-white px-[10px] py-[5px] self-end rounded-[4px] font-[#4C4C4D] font-[500] text-[12px] hover:bg-slate-300"
        @click="showModal = true"
      >
        Открыть
      </button>
    </div>
    <p
      class="text-right font-[700] leading-[14px] text-[11px] self-end min-w-[30px] text-[rgba(0,0,0,.5)] grow"
    >
      {{ time }}
    </p>
  </div>
</template>

<script>
import ClientMailMessageModal from '@/components/Clients/ClientMailMessageModal'
export default {
  components: { ClientMailMessageModal },
  props: {
    message: {
      type: Object,
      default: () => ({})
    },
    time: {
      type: String,
      default: ''
    }
  },
  emits: ['openModalMessage'],
  data () {
    return {
      showModal: false
    }
  },
  computed: {
    messageWithOutTags () {
      return this.message?.msg?.replace(/( |<([^>]+)>)/ig, ' ')
    },
    croppedMessage () {
      const firstSentence = this.messageWithOutTags.match(/^(.*?)[.?!]\s/)
      return firstSentence?.length ? firstSentence[0].trim() : this.messageWithOutTags
    }
  }
}
</script>
