<template>
  <ModalBox
    :title="`Отложить на ${selectedDateTitle}`"
    ok="Отложить"
    :width="540"
    @ok="onSave"
    @cancel="onCancel"
  >
    <DatePicker
      ref="datePicker"
      v-model="datePickerDate"
      class="border-none text-xs calendar-properties"
      style="border: none !important"
      title-position="left"
      :masks="{ weekdays: 'WW' }"
      @dayclick="onDayClick"
    />
    <div class="grow ml-[16px] mt-[10px]">
      <div class="font-roboto font-bold text-[16px] leading-[28px] text-gray-900">
        Время:
      </div>
      <div class="my-[15px]">
        <input
          v-model="time"
          v-maska="'##:##'"
          class="border rounded-[5px] h-[30px] w-[150px] font-roboto text-[16px] px-[12px] p-[6px]"
          type="text"
          placeholder="Время"
        >
      </div>
      <div class="columns-4">
        <div
          v-for="(key, value) in 24"
          :key="value"
          class="font-roboto text-[12px] leading-[27px] px-[6px] rounded-[6px] cursor-pointer"
          @click="onTimeChange(value)"
        >
          {{ getTextHoursValue(value) }}
        </div>
      </div>
    </div>
  </ModalBox>
</template>

<script>
import ModalBox from '@/components/modals/ModalBox.vue'
import { DatePicker } from 'v-calendar'
import { maska } from 'maska'

export default {
  components: {
    ModalBox,
    DatePicker
  },
  directives: {
    maska
  },
  emits: ['cancel', 'save'],
  data: () => ({
    datePickerDate: new Date(Date.now() + 24 * 3600 * 1000),
    time: '09:00'
  }),
  computed: {
    selectedDateTitle () {
      return this.datePickerDate.toLocaleString('default', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }) + ' ' + this.time
    }
  },
  methods: {
    getTextHoursValue (hour) {
      return String(hour).padStart(2, '0') + ':00'
    },
    onDayClick (day) {
      // не даём развыделять календарь
      if (this.datePickerDate === null) {
        this.$refs.datePicker.updateValue(day.date)
      }
    },
    onTimeChange (hour) {
      this.time = this.getTextHoursValue(hour)
    },
    onCancel () {
      this.$emit('cancel')
    },
    onSave () {
      const resultDate = new Date(this.datePickerDate)
      const [hoursStr, minutesStr] = this.time.split(':')
      resultDate.setHours(Number(hoursStr), Number(minutesStr), 0, 0)
      this.$emit('save', resultDate)
    }
  }
}
</script>

<style scoped>

</style>
