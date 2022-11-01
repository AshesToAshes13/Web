<template>
  <NavBar
    class="pt-[8px]"
    :title="`Статистика доски ${boardName}`"
  >
    <router-link
      :to="`/board/${boardUid}`"
    >
      <BoardSmallButton
        class="flex items-center px-[10px] py-[5px]"
        :icon="'back'"
      >
        Назад
      </BoardSmallButton>
    </router-link>
  </NavBar>
  <div class="bg-white rounded-xl min-h-[300px] p-[20px]">
    <table>
      <tr>
        <th>Сотрудник</th>
        <th>Карточек в работе</th>
        <th>Карточек в успехе</th>
        <th>Карточек в отказе</th>
        <th>Всего Карточек</th>
      </tr>
      <BoardStatsSkeleton v-if="!isLoaded" />
      <template
        v-for="member in membersSortedByCardsCount"
        v-else
        :key="member.email"
      >
        <BoardStatsItem
          :member="member"
        />
      </template>
    </table>
  </div>
  <div class="bg-white rounded-xl min-h-[300px] p-[20px] mt-5 mb-[25px]">
    <BoardStatsMonth
      :is-loaded="isLoaded"
      :board-cards="boardCards"
    />
  </div>
</template>

<script>
import BoardStatsItem from '@/components/Board/stats/BoardStatsItem.vue'
import BoardStatsMonth from '@/components/Board/stats/BoardStatsMonth.vue'
import NavBar from '@/components/Navbar/NavBar'
import BoardSmallButton from '@/components/Board/buttons/BoardSmallButton.vue'
import * as CARD from '@/store/actions/cards'
import { CARD_STAGE } from '@/constants'
import BoardStatsSkeleton from '@/components/Board/stats/BoardStatsSkeleton'

export default {
  components: {
    BoardStatsSkeleton,
    NavBar,
    BoardStatsItem,
    BoardSmallButton,
    BoardStatsMonth
  },
  data () {
    return {
      membersWithCards: {},
      isLoaded: true
    }
  },
  computed: {
    boardUid () {
      return this.$route.params.board_id
    },
    selectedBoard () {
      return this.$store.state.boards.boards[this.boardUid]
    },
    boardCards () {
      return this.$store.state.cards.cards
    },
    boardName () {
      return this.selectedBoard?.name
    },
    employeesByEmail () {
      return this.$store.state.employees.employeesByEmail
    },
    membersSortedByCardsCount () {
      const members = Object.values(this.membersWithCards)
      members.sort((member1, member2) => {
        // сначала по количеству карточек
        if (member1.allCards.quantity > member2.allCards.quantity) return -1
        if (member1.allCards.quantity < member2.allCards.quantity) return 1
        // если одинаковый, то по email`у
        if (member1.email > member2.email) return -1
        if (member1.email < member2.email) return 1
        return 0
      })
      return members
    }
  },
  mounted () {
    this.isLoaded = false
    this.$store.dispatch(CARD.BOARD_ALL_CARDS_REQUEST, this.boardUid).then(() => {
      this.calculateMembersCost()
      this.isLoaded = true
    })
  },
  methods: {
    calculateMembersCost () {
      this.boardCards.forEach((cardGroup) => {
        if (cardGroup.cards) {
          cardGroup.cards.forEach((card) => {
            const member = this.getMemberByUser(card.user)
            if (member) {
              member.allCards = {
                quantity: member.allCards.quantity + 1,
                cost: member.allCards.cost + card.cost
              }
              if (!cardGroup.Archive) {
                member.activeCards = {
                  quantity: member.activeCards.quantity + 1,
                  cost: member.activeCards.cost + card.cost
                }
              }
              if (card.uid_stage === CARD_STAGE.ARCHIVE_SUCCESS) {
                member.successfulCards = {
                  quantity: member.successfulCards.quantity + 1,
                  cost: member.successfulCards.cost + card.cost
                }
              } else if (card.uid_stage === CARD_STAGE.ARCHIVE_REJECT) {
                member.rejectedCards = {
                  quantity: member.rejectedCards.quantity + 1,
                  cost: member.rejectedCards.cost + card.cost
                }
              }
            }
          })
        }
      })
    },
    getMemberByUser (user) {
      if (!user) return null
      const member = this.membersWithCards[user.toLowerCase()]
      if (!member) {
        const newMember = {
          email: user,
          username: this.employeesByEmail[user.toLowerCase()]?.name || user,
          allCards: {
            quantity: 0,
            cost: 0
          },
          successfulCards: {
            quantity: 0,
            cost: 0
          },
          rejectedCards: {
            quantity: 0,
            cost: 0
          },
          activeCards: {
            quantity: 0,
            cost: 0
          }
        }
        this.membersWithCards[user.toLowerCase()] = newMember
        return newMember
      }
      return member
    }
  }
}
</script>

<style scoped>
table {
  @apply w-[calc(100%-40px)] mx-[20px] mt-[20px] border-separate
}

/*Стили для первой строки с заголовками*/

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

.content {
  @apply min-h-[48px] flex items-center
}

/*Стили для первого контентного элемента (отступ сверху)*/
tr:nth-child(2) {
  @apply min-h-[74px]
}

tr:nth-child(2) .content {
  @apply mt-[16px]
}
</style>
