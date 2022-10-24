<template>
  <span
    v-if="message.type === 'call'"
    class="flex p-[10px] rounded-t-[12px] mb-[5px] max-w-[300px] text-[#4C4C4D] text-[14px]"
    :class="{'float-left rounded-br-[12px] bg-[#FCEBEB]': message.direction === 'in', 'float-right rounded-bl-[12px] bg-[#F4F5F7]': message.direction === 'out'}"
  >
    <div
      class="flex flex-col content-start gap-[5px]"
    >
      <div class="flex flex-row align-left items-center px-2">
        <svg
          v-if="message.direction === 'in' && message.status === 'Success'"
          xmlns="http://www.w3.org/2000/svg"
          class="mr-2"
          width="12"
          height="12"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511zM15.854.146a.5.5 0 0 1 0 .708L11.707 5H14.5a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5v-4a.5.5 0 0 1 1 0v2.793L15.146.146a.5.5 0 0 1 .708 0z"
          />
        </svg>
        <svg
          v-else-if="message.direction === 'out' && message.status === 'Success'"
          xmlns="http://www.w3.org/2000/svg"
          class="mr-2"
          width="12"
          height="12"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511zM11 .5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V1.707l-4.146 4.147a.5.5 0 0 1-.708-.708L14.293 1H11.5a.5.5 0 0 1-.5-.5z"
          />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          class="mr-2"
          width="12"
          height="12"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511zm9.261 1.135a.5.5 0 0 1 .708 0L13 2.793l1.146-1.147a.5.5 0 0 1 .708.708L13.707 3.5l1.147 1.146a.5.5 0 0 1-.708.708L13 4.207l-1.146 1.147a.5.5 0 0 1-.708-.708L12.293 3.5l-1.147-1.146a.5.5 0 0 1 0-.708z"
          />
        </svg>
        <p
          class="text-[14px] leading-[21px] text-[#747476]"
        >
          {{ getCallText(message) }}
        </p>
      </div>
      <CardAndClientCallMessageVue
        :call-link="message.link"
      />
    </div>
    <p
      style="color: rgba(0, 0, 0, 0.5);"
      class="text-right font-[700] ml-[8px] leading-[14px] text-[11px] self-end min-w-[30px]"
    >
      {{ getMessageTimeString(message.date_create) }}
    </p>
  </span>
  <div
    v-if="message.emailSender"
    class="text-[#7E7E80] text-[13px] font-[500] leading-[15px] tracking-wide mb-[6px]"
    :class="{ 'text-left': !isMessageIncludesIntegrationLogin(message), 'text-right': isMessageIncludesIntegrationLogin(message) }"
  >
    <span class="w-[300px] overflow-hidden h-[15px] inline-block text-ellipsis whitespace-nowrap">{{ message.emailSender }}</span>
  </div>
</template>

<script>
import CardAndClientCallMessageVue from './CardAndClientCallMessage.vue'

export default {
  components: {
    CardAndClientCallMessageVue
  },
  props: {
    message: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    getCallText (message) {
      const minutes = Math.floor(message.duration / 60)
      const seconds = (message.duration % 60).toString().padStart(2, '0')
      return (message.direction === 'in' ? 'Звонок от клиента' : `Звонок от ${message.user}`) + ` (${minutes}:${seconds})`
    },
    getMessageTimeString (dateCreate) {
      if (!dateCreate) return ''
      // добавляем Z в конец, чтобы он посчитал что это UTC время
      if (dateCreate[dateCreate.length - 1] !== 'Z') {
        dateCreate += 'Z'
      }
      const date = new Date(dateCreate)
      return date.toLocaleString('default', {
        hour: 'numeric',
        minute: 'numeric'
      })
    },
    isMessageIncludesIntegrationLogin (msg) {
      if (msg?.emailSender) {
        return msg.emailSender.includes(this.corpYandexIntegration?.login) || msg.emailSender.includes(this.personalYandexIntegration?.login)
      }
      return false
    }
  }
}
</script>
