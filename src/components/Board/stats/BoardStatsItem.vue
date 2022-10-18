<template>
  <tr>
    <td>
      <div class="content flex items-center">
        <img
          v-if="photo"
          :src="photo"
          class="flex-none border border-[#7e7e80] rounded-[4px] w-[20px] h-[20px] mr-[7px]"
        >
        <svg
          v-else
          class="flex-none border border-[#7e7e80] rounded-[4px] w-[20px] h-[20px] mr-[7px]"
          width="20"
          height="20"
          viewBox="0 0 42 42"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            width="42"
            height="42"
            rx="8"
            fill="#EDEDED"
          />
          <path
            d="M15.75 14.583C15.75 17.4775 18.1055 19.833 21 19.833C23.8945 19.833 26.25 17.4775 26.25 14.583C26.25 11.6885 23.8945 9.33301 21 9.33301C18.1055 9.33301 15.75 11.6885 15.75 14.583ZM30.3333 31.4997H31.5V30.333C31.5 25.8308 27.8355 22.1663 23.3333 22.1663H18.6667C14.1633 22.1663 10.5 25.8308 10.5 30.333V31.4997H30.3333Z"
            fill="#7e7e80"
          />
        </svg>
        {{ member.username }}
      </div>
    </td>
    <td
      v-if="member.activeCards"
    >
      <BoardStatsItemValue
        class="content"
        :quantity="member.activeCards.quantity"
        :cost="member.activeCards.cost"
      />
    </td>
    <td
      v-if="member.successfulCards"
    >
      <BoardStatsItemValue
        class="content"
        :quantity="member.successfulCards.quantity"
        :cost="member.successfulCards.cost"
      />
    </td>
    <td
      v-if="member.rejectedCards"
    >
      <BoardStatsItemValue
        class="content"
        :quantity="member.rejectedCards.quantity"
        :cost="member.rejectedCards.cost"
      />
    </td>
    <td
      v-if="member.archiveCards"
    >
      <BoardStatsItemValue
        class="content"
        :quantity="member.archiveCards.quantity"
        :cost="member.archiveCards.cost"
      />
    </td>
    <td
      v-if="member.allCards"
    >
      <BoardStatsItemValue
        class="content"
        :quantity="member.allCards.quantity"
        :cost="member.allCards.cost"
      />
    </td>
  </tr>
</template>

<script>
import BoardStatsItemValue from '@/components/Board/stats/BoardStatsItemValue.vue'

export default {
  components: {
    BoardStatsItemValue
  },
  props: {
    member: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    employeesByEmail () {
      return this.$store.state.employees.employeesByEmail
    },
    photo () {
      return this.employeesByEmail[this.member.email.toLowerCase()]?.fotolink || ''
    }
  },
  methods: {
    formatCostValue (cost) {
      if (cost > 0) {
        const fractional = cost % 100
        const value = Math.floor(cost / 100)
        let valString = ''
        let valueString = value.toString()
        while (valueString) {
          valString = valueString.slice(-3) + ' ' + valString
          valueString = valueString.slice(0, -3)
        }
        valString = valString.trim()
        const frString = (fractional < 10 ? '0' : '') + fractional
        return `${valString}.${frString}`
      }
      return '0.00'
    }
  }
}
</script>

<style scoped>
.content {
  @apply min-h-[48px]
}

tr:first-child {
  @apply text-left h-[48px]
}

tr:first-child th {
  @apply pl-[20px] border-[#e6e6e6] border-2 text-[14px] font-medium;
  border-spacing: 0 20px;
}

tr:first-child th:first-child {
  @apply rounded-l-[6px]
}

tr:first-child th:last-child {
  @apply rounded-r-[6px]
}

tr:first-child th:not(:last-child){
  border-right: 1px;
}

/*Стили для контентной части*/

tr:not(:first-child) {
  @apply min-h-[58px] align-top
}

tr:not(:first-child) td {
  @apply border-b-2 border-[#e6e6e6] pl-[14px] font-normal text-[13px] max-w-[400px]
}

tr:not(:first-child) td:first-child {
  @apply rounded-l-[6px]
}

tr:not(:first-child) td:last-child {
  @apply rounded-r-[6px]
}

/*Стили для первого контентного элемента (отступ сверху)*/
tr:nth-child(2) {
  @apply min-h-[74px]
}

tr:nth-child(2) .content {
  @apply mt-[16px]
}
</style>
