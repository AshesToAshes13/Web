<template>
  <DoitnowContent>
    <div class="font-roboto text-center text-[#424242] text-[25px] mx-[64px] font-bold">
      Пройти регламент "{{ name }}"
    </div>
    <div
      v-if="date"
      class="flex gap-[4px] mt-[12px]"
    >
      <div class="flex-none font-roboto text-[#7E7E80] text-[13px]">
        Последнее изменение {{ dateCommon }}
      </div>
      <div
        v-if="lastChange"
        class="grow font-roboto text-[#7E7E80] text-[13px] truncate"
      >
        {{ lastChange }}
      </div>
    </div>
    <button
      class="block mx-auto mt-[35px] w-[238px] h-[40px] cursor-pointer px-[40px] rounded-[6px] bg-[#F2B679] hover:bg-slate-200"
      @click="gotoReglamentContent"
    >
      <div class="font-roboto text-[#2E2E2E] text-[14px] font-medium">
        Пройти регламент
      </div>
    </button>
    <template #buttons>
      <DoitnowRightButtonPostpone
        :is-animation-doitnow="isAnimationDoitnow"
        @postpone="onPostpone"
        @next="nextTask"
      />
      <DoitnowRightButton
        title="Дальше"
        icon="next"
        @click="nextTask"
      />
    </template>
  </DoitnowContent>
</template>

<script>
import * as REGLAMENTS from '@/store/actions/reglaments.js'

import DoitnowContent from '@/components/Doitnow/DoitnowContent.vue'
import DoitnowRightButtonPostpone from '@/components/Doitnow/DoitnowRightButtonPostpone.vue'
import DoitnowRightButton from '@/components/Doitnow/DoitnowRightButton.vue'

export default {
  components: {
    DoitnowContent,
    DoitnowRightButtonPostpone,
    DoitnowRightButton
  },
  props: {
    uid: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    date: {
      type: String,
      default: ''
    },
    lastChange: {
      type: String,
      default: ''
    },
    isAnimationDoitnow: {
      type: Boolean,
      default: false
    }
  },
  emits: ['next'],
  computed: {
    dateCommon () {
      const dateStr = this.dateToLabelFormatForComment(new Date(this.date))
      return this.lastChange ? `${dateStr}:` : dateStr
    }
  },
  methods: {
    dateToLabelFormatForComment (calendarDate) {
      if (isNaN(calendarDate)) return ''

      const day = calendarDate.getDate()
      const month = calendarDate.toLocaleString('default', { month: 'short' })
      const weekday = calendarDate.toLocaleString('default', { weekday: 'short' })
      const hours = String(calendarDate.getHours()).padStart(2, '0')
      const minutes = String(calendarDate.getMinutes()).padStart(2, '0')

      return `${day} ${month}, ${weekday}, ${hours}:${minutes}`
    },
    gotoReglamentContent () {
      this.$router.push('/reglaments/' + this.uid)
      this.$store.state.reglaments.returnDoitnow = true
      this.$store.commit('NAVIGATOR_SUCCESS')
    },
    onPostpone (date) {
      const year = String(date.getFullYear()).padStart(4, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')
      const dateStr = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
      //
      const reglamentReminder = {
        uid_user: this.$store.state.user?.user?.current_user_uid,
        uid_reglament: this.uid,
        reminder_date: dateStr
      }
      this.$store.dispatch(REGLAMENTS.SET_REGLAMENT_REMINDER, reglamentReminder).then((resp) => {
        const reglament = this.$store.state.reglaments.reglaments[reglamentReminder.uid_reglament]
        if (reglament) reglament.reminder = reglamentReminder.reminder_date
      })
      this.nextTask()
    },
    nextTask () {
      this.$emit('next')
    }
  }
}
</script>
