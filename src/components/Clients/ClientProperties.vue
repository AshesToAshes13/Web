<template>
  <ClientPropertiesSkeleton v-if="!propertiesIsLoaded" />
  <div
    v-else
    class="flex flex-col"
  >
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
        class="flex gap-[5px] items-center justify-center py-[12px] px-[20px] border border-[#F2B679] rounded-[10px] font-roboto text-[#4C4C4D] text-[14px] w-5/12 mt-[25px] hover:bg-[#dbdada88] disabled:bg-[#a3a3a362]"
        :disabled="disableButton"

        @click="callClient"
      >
        <svg
          width="14"
          height="13"
          viewBox="0 0 14 13"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.60171 5.24457L11.9121 0.928572H8.85714V2.7306e-07H13.5V4.64286H12.5714V1.58786L8.25543 5.89921L7.60171 5.2455V5.24457ZM10.6706 7.6245C11.0538 7.62451 11.4215 7.77566 11.6939 8.04514C11.7961 8.14728 11.9094 8.25314 12.0347 8.36457L12.434 8.72021C12.5733 8.84557 12.7042 8.9765 12.8249 9.11114C12.9456 9.24671 13.0599 9.38507 13.1666 9.52528C13.2725 9.66457 13.3524 9.815 13.4053 9.97471C13.4591 10.1344 13.4907 10.2941 13.5 10.4539C13.4996 10.8367 13.3485 11.204 13.0794 11.4762C12.8324 11.7232 12.6104 11.9405 12.4117 12.1299C12.2235 12.3105 12.0169 12.4708 11.7951 12.6081C11.5816 12.7381 11.3429 12.8356 11.0774 12.8988C10.7699 12.9662 10.4561 13.0001 10.1414 13C9.59062 12.9964 9.0433 12.9132 8.51636 12.753C7.94122 12.5811 7.38447 12.3528 6.85421 12.0714C6.28748 11.7712 5.74674 11.4242 5.23757 11.0342C4.70922 10.632 4.20967 10.1932 3.74257 9.72121C3.27364 9.24764 2.83814 8.74621 2.437 8.21971C2.04907 7.71391 1.70664 7.17479 1.41371 6.60864C1.14128 6.08155 0.91809 5.53042 0.747 4.96229C0.587632 4.44502 0.504426 3.90731 0.5 3.36607C0.5 2.99836 0.531571 2.6845 0.594714 2.42264C0.653259 2.17207 0.751037 1.93233 0.884429 1.71229C1.01443 1.49871 1.17507 1.29443 1.36357 1.09571C1.55207 0.897 1.77214 0.672286 2.02286 0.420643C2.29549 0.150937 2.66357 -0.000234505 3.04707 2.7306e-07C3.2885 2.7306e-07 3.52064 0.0650003 3.7435 0.195C3.96636 0.326857 4.18179 0.485643 4.38979 0.675072C4.59686 0.863572 4.78907 1.06136 4.96271 1.26936C5.13636 1.47736 5.30071 1.65657 5.45486 1.80607C5.72434 2.07848 5.87549 2.44618 5.8755 2.82936C5.87882 3.00317 5.84725 3.17589 5.78264 3.33729C5.72386 3.48036 5.64575 3.6147 5.5505 3.73657C5.45761 3.85326 5.35544 3.96226 5.245 4.0625C5.13357 4.16464 5.03236 4.26121 4.94043 4.35314C4.8551 4.43756 4.77509 4.52718 4.70086 4.6215C4.63506 4.70327 4.60168 4.8064 4.60707 4.91121C4.60707 4.96971 4.65071 5.06164 4.73707 5.187C4.84919 5.34379 4.97042 5.49386 5.10014 5.63643C5.46077 6.04163 5.83585 6.43374 6.22464 6.812C6.44193 7.02557 6.65271 7.22986 6.85607 7.42857C7.0585 7.62729 7.25536 7.81578 7.44386 7.995C7.63236 8.17328 7.79207 8.32557 7.92207 8.45186C8.05207 8.57721 8.15421 8.67471 8.22664 8.74157C8.30936 8.82735 8.4202 8.88048 8.53889 8.89122C8.65757 8.90197 8.77615 8.86961 8.87293 8.80007C8.95929 8.73693 9.04936 8.65893 9.14128 8.56793C9.23321 8.47507 9.327 8.37386 9.42357 8.26243C9.52014 8.151 9.63157 8.04978 9.75786 7.95786C9.88321 7.86593 10.016 7.78607 10.1571 7.71829C10.3189 7.647 10.4951 7.61487 10.6716 7.6245H10.6706ZM10.1414 12.0714C10.4366 12.0714 10.6827 12.0445 10.8814 11.9916C11.0754 11.9403 11.2593 11.8568 11.4256 11.7446C11.5899 11.6331 11.7441 11.5031 11.8899 11.3536C12.0347 11.2032 12.2111 11.0268 12.4191 10.8244C12.5213 10.7222 12.5714 10.6015 12.5714 10.4613C12.5714 10.3981 12.5324 10.309 12.4554 10.192C12.3641 10.0576 12.2671 9.92717 12.1647 9.80107C12.041 9.64727 11.9076 9.5015 11.7654 9.36464C11.6169 9.22071 11.4711 9.087 11.3309 8.96628C11.2088 8.85956 11.0805 8.76033 10.9464 8.66914C10.8304 8.59207 10.7384 8.55307 10.6706 8.55307C10.5667 8.55385 10.4656 8.58659 10.3809 8.64686C10.2832 8.71445 10.1929 8.79227 10.1116 8.879C10.0253 8.97186 9.93057 9.07307 9.82936 9.1845C9.72721 9.29593 9.61579 9.39714 9.49507 9.48907C9.37436 9.581 9.24157 9.66086 9.09579 9.72864C8.93636 9.79885 8.76278 9.83096 8.58879 9.82243C8.39827 9.82363 8.20947 9.78642 8.03366 9.71303C7.85784 9.63964 7.69862 9.53158 7.5655 9.39528L4.10564 5.93357C3.97204 5.8009 3.866 5.64311 3.79364 5.46929C3.72038 5.29184 3.68101 5.10223 3.67757 4.91029C3.67757 4.72179 3.70914 4.55464 3.77136 4.40979C3.8345 4.26493 3.91157 4.12936 4.0035 4.00307C4.09636 3.87771 4.19757 3.76907 4.309 3.67714C4.42043 3.58521 4.52164 3.48864 4.61357 3.3865C4.7055 3.28529 4.78536 3.19614 4.85314 3.11814C4.92154 3.0378 4.95527 2.93361 4.94693 2.82843C4.94693 2.76529 4.90793 2.67614 4.83086 2.55914C4.74086 2.42647 4.64416 2.29848 4.54114 2.17564C4.41493 2.02432 4.28168 1.87899 4.14186 1.74014C4.00301 1.60031 3.85769 1.46707 3.70636 1.34086C3.58043 1.23576 3.44967 1.13661 3.3145 1.04371C3.19379 0.961072 3.10464 0.923 3.04614 0.927643C2.97741 0.92644 2.90915 0.939331 2.84559 0.965523C2.78203 0.991714 2.72451 1.03065 2.67657 1.07993C2.50121 1.25527 2.32478 1.42954 2.14729 1.60271C2.00052 1.74309 1.86915 1.89873 1.75543 2.067C1.64536 2.23352 1.56436 2.41752 1.51586 2.61114C1.45803 2.85107 1.42873 3.09699 1.42857 3.34379C1.42857 3.80807 1.50286 4.28629 1.65329 4.77936C1.81303 5.29649 2.02199 5.79711 2.27729 6.27436C2.54379 6.77671 2.86229 7.26607 3.23464 7.73964C3.607 8.21321 4.00629 8.66543 4.4325 9.09536C5.26703 9.93982 6.21979 10.6586 7.26093 11.2292C7.72937 11.4847 8.22287 11.6914 8.73364 11.8458C9.19014 11.9858 9.66395 12.0615 10.1414 12.0705V12.0714Z"
            fill="currentColor"
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
      <contenteditable
        v-model="currClient.comment"
        tag="div"
        :contenteditable="true"
        :no-html="true"
        :no-nl="true"
        placeholder="Комментарий"
        class="font-roboto font-bold text-[#424242] text-[18px] p-0 w-full border-none focus:ring-0 focus:outline-none"
        @blur="updateClient"
      />
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
          <span class="text-[#575758] text-[12px] font-[500] truncate">
            {{ $store.state.boards.boards[card.uid_board] === undefined ? 'Скрытая доска' : $store.state.boards.boards[card.uid_board].name }}: {{ card.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import * as CLIENTS from '@/store/actions/clients'
import * as CORP_MEGAFON from '@/store/actions/integrations/corpoMegafonInt'
import { stripPhoneNumber } from '@/helpers/functions'
import ClientPropertiesSkeleton from '@/components/Clients/ClientPropertiesSkeleton'
import contenteditable from 'vue-contenteditable'

export default {
  components: { contenteditable, ClientPropertiesSkeleton },
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
      clientMessageInputValue: '',
      disableButton: false,
      propertiesIsLoaded: false
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
      return this.currClient.phone && this.$store.getters.isMegafonCanCall
    },
    user () {
      return this.$store.state.user.user
    }
  },
  watch: {
    selectedClient (selectedClient) {
      if (selectedClient) {
        this.currClient = this.selectedClient
        this.propertiesIsLoaded = true
      }
    }
  },
  mounted () {
    if (this.selectedClient) {
      this.currClient = { ...this.selectedClient }
      this.propertiesIsLoaded = true
    }
  },
  methods: {
    updateClient () {
      if (this.checkForm()) {
        this.$store.dispatch(CLIENTS.UPDATE_CLIENT, this.currClient).then((res) => {
          this.$store.state.cards.clientInCard = res.data
        })
      }
    },
    checkForm () {
      const { name } = this.currClient
      return name.length && this.validateNumber && this.validateEmail
    },
    callClient () {
      this.disableButton = true
      const phone = stripPhoneNumber(this.currClient.phone)
      this.$store.dispatch(CORP_MEGAFON.CALL_CLIENT, phone)
      setTimeout(() => {
        this.disableButton = false
      }, 2000)
    }
  }
}
</script>
