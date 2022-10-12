<template>
  <div
    class="flex justify-between items-center h-[40px] w-[221px]"
  >
    <DoitnowModalBoxSetDate
      v-if="showSetDate"
      @save="onSetDate"
      @cancel="showSetDate = false"
    />
    <PopMenu
      :disabled="isAnimationDoitnow"
    >
      <div
        class="flex-none flex items-center cursor-pointer bg-white hover:bg-[#0000000a] h-[40px] w-[221px] rounded-[8px] px-[20px] overflow-hidden"
      >
        <span
          class="mx-auto font-roboto text-[#4C4C4D] text-[13px] truncate"
        >
          Отложить
        </span>
        <svg
          class="flex-none"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M6.17239 8.40112C5.90299 8.67411 5.9059 9.11379 6.17889 9.38319L9.55667 12.7165C9.8119 12.9684 10.2169 12.9845 10.4914 12.7538L14.1506 9.67683C14.4442 9.43 14.4821 8.99193 14.2352 8.69838C13.9884 8.40484 13.5503 8.36697 13.2568 8.6138L10.0818 11.2835L7.15446 8.39462C6.88147 8.12522 6.44178 8.12813 6.17239 8.40112Z"
            fill="#424242"
          />
        </svg>
      </div>
      <template #menu>
        <div class="w-[203px]">
          <PopMenuItem
            class="!h-[40px] !justify-center"
            @click="onSetPostpone({minutes: 10, days: 0})"
          >
            На 10 минут
          </PopMenuItem>
          <PopMenuItem
            class="!h-[40px] !justify-center"
            @click="onSetPostpone({minutes: 60, days: 0})"
          >
            На 1 час
          </PopMenuItem>
          <PopMenuItem
            class="!h-[40px] !justify-center"
            @click="onSetPostpone({minutes: 180, days: 0})"
          >
            На 3 часа
          </PopMenuItem>
          <PopMenuItem
            class="!h-[40px] !justify-center"
            @click="onSetPostpone({minutes: 0, days: 1})"
          >
            На завтра
          </PopMenuItem>
          <PopMenuItem
            class="!h-[40px] !justify-center"
            @click="onSelectPostpone"
          >
            Выбрать дату
          </PopMenuItem>
        </div>
      </template>
    </PopMenu>
  </div>
</template>

<script>
import PopMenu from '@/components/Common/PopMenu.vue'
import PopMenuItem from '@/components/Common/PopMenuItem.vue'
import DoitnowModalBoxSetDate from '@/components/Doitnow/DoitnowModalBoxSetDate.vue'

export default {
  components: {
    DoitnowModalBoxSetDate,
    PopMenu,
    PopMenuItem
  },
  props: {
    taskEndDate: {
      type: String,
      default: ''
    },
    isAnimationDoitnow: {
      type: Boolean,
      default: false
    }
  },
  emits: ['postpone'],
  data () {
    return {
      postponeValue: {
        minutes: 10,
        days: 0
      },
      showSetDate: false
    }
  },
  computed: {
    postpone () {
      if (this.postponeValue.days > 0) {
        if (this.postponeValue.days === 1) return 'завтра'
        //
        const date = new Date(this.taskEndDate) ?? new Date()
        date.setHours(9, 0, 0, 0) // на 9 утра
        date.setDate(date.getDate() + this.postponeValue.days)
        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        return `${day}.${month}.${date.getFullYear()}`
      }
      if (this.postponeValue.minutes === 60) {
        return '1 час'
      }
      if (this.postponeValue.minutes === 180) {
        return '3 часа'
      }
      return `${this.postponeValue.minutes} минут`
    }
  },
  methods: {
    onPostpone () {
      const date = this.taskEndDate ? new Date(this.taskEndDate) : new Date()
      if (this.postponeValue.days > 0) {
        date.setHours(9, 0, 0, 0) // на 9 утра
        date.setDate(date.getDate() + this.postponeValue.days)
      } else if (this.postponeValue.minutes > 0) {
        date.setMinutes(date.getMinutes() + this.postponeValue.minutes)
      }
      this.$emit('postpone', date)
    },
    onSetPostpone (value) {
      this.postponeValue = value
      this.onPostpone()
    },
    onSelectPostpone () {
      // выбрать дату - через диалог
      this.showSetDate = true
    },
    onSetDate (date) {
      this.showSetDate = false
      this.$emit('postpone', date)
    }
  }
}
</script>

<style>

</style>
