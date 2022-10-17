<template>
  <div class="flex flex-col p-[25px]">
    <div class="mb-[30px]">
      <div
        class="font-roboto leading-[19px] font-[400] text-[15px] text-[#606061] mb-[10px]"
      >
        Имя
      </div>
      <input
        v-model="currClient.name"
        type="text"
        maxlength="50"
        placeholder="Имя"
        class="font-roboto font-bold text-[#424242] text-[18px] p-0 w-full border-none focus:ring-0 focus:outline-none"
        @blur="updateClient"
      >
    </div>
    <div class="mb-[30px]">
      <div
        class="font-roboto leading-[19px] font-[400] text-[15px] text-[#606061] mb-[10px]"
      >
        Телефон
      </div>
      <input
        v-model="currClient.phone"
        type="text"
        maxlength="50"
        placeholder="Телефон"
        class="font-roboto font-bold text-[#424242] text-[18px] p-0 w-full border-none focus:ring-0 focus:outline-none"
        @blur="updateClient"
      >
      <div
        v-if="!validateNumber"
        class="mt-2 text-[11px] text-[#dc2626] mt-[25px]"
      >
        Телефон не должен содержать ничего кроме цифр и начинаться со знака +
      </div>
      <button
        v-if="showCallButton"
        class="flex gap-[5px] items-center justify-center py-[12px] px-[20px] border border-[#F2B679] rounded-[10px] font-roboto text-[#4C4C4D] text-[14px] w-5/12 mt-[25px]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 100 100"
        >
          <path
            d="M 38.789 51.211 l 10.876 10.876 c 0.974 0.974 2.471 1.194 3.684 0.543 l 13.034 -6.997 c 0.964 -0.518 2.129 -0.493 3.07 0.066 l 19.017 11.285 c 1.357 0.805 1.903 2.489 1.268 3.933 c -1.625 3.698 -4.583 10.476 -5.758 13.473 c -0.247 0.631 -0.615 1.209 -1.127 1.652 c -12.674 10.986 -37.89 -2.4 -57.191 -21.701 C 6.358 45.039 -7.028 19.823 3.958 7.149 c 0.444 -0.512 1.022 -0.88 1.652 -1.127 c 2.996 -1.175 9.775 -4.133 13.473 -5.758 c 1.444 -0.635 3.128 -0.089 3.933 1.268 l 11.285 19.017 c 0.558 0.941 0.583 2.106 0.066 3.07 L 27.37 36.651 c -0.651 1.213 -0.431 2.71 0.543 3.684 C 27.913 40.335 38.789 51.211 38.789 51.211 z"
            style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;"
            transform=" matrix(1 0 0 1 0 0) "
            stroke-linecap="round"
          />
          <path
            d="M 60.282 42.839 l 13.376 -13.376 l 5.134 5.134 c 0.843 0.843 2.284 0.458 2.592 -0.695 l 8.561 -31.95 C 90.254 0.8 89.2 -0.254 88.048 0.054 l -31.95 8.561 c -1.152 0.309 -1.538 1.749 -0.695 2.592 l 5.134 5.134 L 47.161 29.718 c -0.628 0.628 -0.628 1.646 0 2.274 l 10.847 10.847 C 58.636 43.467 59.654 43.467 60.282 42.839 z"
            style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;"
            transform=" matrix(1 0 0 1 0 0) "
            stroke-linecap="round"
          />
        </svg>
        <span>Позвонить</span>
      </button>
    </div>
    <div class="mb-[30px]">
      <div
        class="font-roboto leading-[19px] font-[400] text-[15px] text-[#606061] mb-[10px]"
      >
        Email
      </div>
      <input
        v-model="currClient.email"
        type="text"
        maxlength="50"
        placeholder="Email"
        class="font-roboto font-bold text-[#424242] text-[18px] p-0 w-full border-none focus:ring-0 focus:outline-none"
        @blur="updateClient"
      >
      <div
        v-if="!validateEmail"
        class="mt-2 text-[11px] text-[#dc2626]"
      >
        Поле содержит некоректные данные
      </div>
    </div>
    <div class="mb-[38px]">
      <div
        class="font-roboto leading-[19px] font-[400] text-[15px] text-[#606061] mb-[10px]"
      >
        Комментарий
      </div>
      <input
        v-model="currClient.comment"
        type="text"
        maxlength="50"
        placeholder="Комментарий"
        class="font-roboto font-bold text-[#424242] text-[18px] p-0 w-full border-none focus:ring-0 focus:outline-none"
        @blur="updateClient"
      >
    </div>
    <div
      v-if="cards.length"
      class="border-t border-[rgba(0,0,0,.1)] pt-[35px]"
    >
      <p class="font-roboto leading-[19px] font-[400] text-[15px] text-[#606061] mb-[25px]">
        Карточки контакта
      </p>
      <div
        class="flex flex-col gap-y-[5px]"
      >
        <div
          v-for="card in cards"
          :key="card.uid"
          class="py-[5px] px-[15px] bg-[#F4F5F7] rounded-[6px] gap-x-[5px] flex items-center w-full"
        >
          <svg
            class="shrink-0"
            width="16"
            height="10"
            viewBox="0 0 16 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M5.09091 1.42857C4.12649 1.42857 3.20156 1.80485 2.51961 2.47462C1.83766 3.14439 1.45455 4.0528 1.45455 5C1.45455 5.9472 1.83766 6.85561 2.51961 7.52538C3.20156 8.19516 4.12648 8.57143 5.09091 8.57143H5.81818C6.21984 8.57143 6.54545 8.89123 6.54545 9.28572C6.54545 9.6802 6.21984 10 5.81818 10H5.09091C3.74072 10 2.44582 9.47322 1.49109 8.53553C0.536362 7.59785 0 6.32608 0 5C0 3.67392 0.536362 2.40215 1.49109 1.46447C2.44582 0.526784 3.74072 0 5.09091 0H5.81818C6.21984 0 6.54545 0.319797 6.54545 0.714286C6.54545 1.10877 6.21984 1.42857 5.81818 1.42857H5.09091ZM9.45455 0.714286C9.45455 0.319797 9.78016 0 10.1818 0H10.9091C12.2593 0 13.5542 0.526784 14.5089 1.46447C15.4636 2.40215 16 3.67392 16 5C16 6.32608 15.4636 7.59785 14.5089 8.53553C13.5542 9.47322 12.2593 10 10.9091 10H10.1818C9.78016 10 9.45455 9.6802 9.45455 9.28572C9.45455 8.89123 9.78016 8.57143 10.1818 8.57143H10.9091C11.8735 8.57143 12.7984 8.19516 13.4804 7.52538C14.1623 6.85561 14.5455 5.9472 14.5455 5C14.5455 4.0528 14.1623 3.14439 13.4804 2.47462C12.7984 1.80485 11.8735 1.42857 10.9091 1.42857H10.1818C9.78016 1.42857 9.45455 1.10877 9.45455 0.714286ZM5.09091 5C5.09091 4.60551 5.41652 4.28571 5.81818 4.28571H10.1818C10.5835 4.28571 10.9091 4.60551 10.9091 5C10.9091 5.39449 10.5835 5.71429 10.1818 5.71429H5.81818C5.41652 5.71429 5.09091 5.39449 5.09091 5Z"
              fill="#606061"
            />
          </svg>
          <span class="text-[#575758] text-[12px] font-[500] truncate">{{ card.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import * as CLIENTS from '@/store/actions/clients'

export default {
  props: {
    cards: {
      type: Array,
      default: () => ([])
    }
  },
  data () {
    return {
      currClient: {
        name: '',
        phone: '',
        email: '',
        comment: ''
      },
      currentQuote: false,
      clientMessageInputValue: ''
    }
  },
  computed: {
    selectedClient () {
      return this.$store.state.clients.selectedClient ?? ''
    },
    employees () { return this.$store.state.employees.employees },
    validateNumber () {
      const phone = this.currClient.phone
      if (phone?.length < 10) return false
      const number = phone?.slice(-10)
      if (isNaN(+number)) return false
      const code = phone?.slice(0, -10)
      if (!code.startsWith('+')) return false
      if (isNaN(+code.slice(1))) return false
      return code === '+7' || code === '+37'
    },
    validateEmail () {
      return String(this.currClient.email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    },
    showCallButton () {
      return this.$store.state.corpMegafonIntegration.isIntegrated && this.currClient.phone
    }
  },
  mounted () {
    this.currClient = { ...this.selectedClient }
  },
  methods: {
    updateClient () {
      if (this.checkForm()) {
        this.$store.dispatch(CLIENTS.UPDATE_CLIENT, this.currClient)
      }
    },
    checkForm () {
      const { name } = this.currClient
      return name.length && this.validateNumber && this.validateEmail
    }
  }
}
</script>
