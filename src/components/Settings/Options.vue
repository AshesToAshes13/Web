<template>
  <NavBar
    class="pt-[8px]"
    title="Основные"
  />
  <form class="px-5 bg-white py-2 pb-[200px] rounded-xl">
    <div class="my-2">
      <div class="flex mt-[15px]">
        <div
          v-if="settings"
          class="checkbox"
        >
          <input
            id="opt_1"
            v-model="settings.add_task_to_begin"
            type="checkbox"
            value="0"
            class="custom-checkbox-orange"
            @change="updateSettings"
          >
          <label
            class="text-sm text-[#606061]"
            for="opt_1"
          >Добавлять задачи в начало списка</label>
        </div>
      </div>
    </div>
    <div class="my-2 mt-[15px]">
      <div class="flex mt-2">
        <div
          v-if="settings"
          class="checkbox"
        >
          <input
            id="opt_4"
            v-model="settings.nav_show_overdue"
            type="checkbox"
            class="custom-checkbox-orange outline-none"
            @change="updateSettings"
          >
          <label
            class="text-sm text-[#606061]"
            for="opt_4"
          >Показывать раздел "Просроченные"</label>
        </div>
      </div>
    </div>
    <div class="my-2 mt-[15px]">
      <div class="flex mt-2">
        <div class="checkbox">
          <svg
            v-if="showTransition"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            style="margin: auto; background: none; display: block; shape-rendering: auto;"
            width="20px"
            height="20px"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid"
          >
            <circle
              cx="50"
              cy="50"
              fill="none"
              stroke="#f9ae5c"
              stroke-width="10"
              r="35"
              stroke-dasharray="164.93361431346415 56.97787143782138"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                repeatCount="indefinite"
                dur="1s"
                values="0 50 50;360 50 50"
                keyTimes="0;1"
              />
            </circle>
          </svg>
          <input
            v-if="!showTransition"
            id="sound"
            v-model="isNotificationSoundOn"
            type="checkbox"
            class="custom-checkbox-orange outline-none"
            @change="updateSoundSetting"
          >
          <label
            class="text-sm text-[#606061]"
            for="sound"
          >Сопровождать уведомления звуковым сообщением</label>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import { UPDATE_SOUND_SETTING } from '@/store/actions/inspector'
import { PATCH_SETTINGS } from '@/store/actions/navigator'
import NavBar from '@/components/Navbar/NavBar'

export default {
  components: {
    NavBar
  },
  data () {
    return {
      isNotificationSoundOn: this.$store.state.inspector.is_notification_sound_on,
      showTransition: false
    }
  },
  computed: {
    user () {
      return this.$store.state.user.user
    },
    storeSound () {
      return this.$store.state.inspector.is_notification_sound_on
    },
    settings () {
      return this.$store.state.navigator?.navigator?.settings
    }
  },
  watch: {
    storeSound (newval, oldval) {
      this.isNotificationSoundOn = this.$store.state.inspector.is_notification_sound_on
    }
  },
  methods: {
    updateSoundSetting () {
      this.showTransition = true
      this.$store.dispatch(UPDATE_SOUND_SETTING, { uid_user: this.user.current_user_uid, value: this.isNotificationSoundOn })
        .then(() => {
          this.showTransition = false
        })
    },
    updateSettings () {
      const data = {
        add_task_to_begin: this.settings.add_task_to_begin ? 1 : 0,
        cal_number_of_first_week: this.settings.cal_number_of_first_week ? 1 : 0,
        cal_show_week_number: this.settings.cal_show_week_number ? 1 : 0,
        nav_show_tags: this.settings.nav_show_tags ? 1 : 0,
        nav_show_overdue: this.settings.nav_show_overdue ? 1 : 0,
        nav_show_summary: this.settings.nav_show_summary ? 1 : 0,
        nav_show_emps: this.settings.nav_show_emps ? 1 : 0,
        nav_show_markers: this.settings.nav_show_markers ? 1 : 0,
        stopwatch: this.settings.stopwatch ? 1 : 0,
        cal_work_time: this.settings.cal_work_time ? 1 : 0,
        reminders_in_n_minutes: this.settings.reminders_in_n_minutes,
        cal_work_week: this.settings.cal_work_week ? 1 : 0,
        compact_mode: this.settings.compact_mode ? 1 : 0
      }
      this.$store.dispatch(PATCH_SETTINGS, data)
    }
  }
}
</script>

<style scoped>
/* для элемента input c type="checkbox" */
.custom-checkbox-orange {
  position: absolute;
  z-index: -1;
  opacity: 0;
}

/* для элемента label, связанного с .custom-checkbox */
.custom-checkbox-orange + label {
  display: inline-flex;
  align-items: center;
  user-select: none;
}

/* создание в label псевдоэлемента before со следующими стилями */
.custom-checkbox-orange + label::before {
  content: '';
  display: inline-block;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  flex-grow: 0;
  border: 1.63582px solid rgba(0, 0, 0, 0.15);
  border-radius: 0.25em;
  margin-right: 0.5em;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 55% 100%;
}

/* стили при наведении курсора на checkbox */
.custom-checkbox-orange:not(:disabled):not(:checked) + label:hover::before {
  border-color: gray;
}

/* стили для активного чекбокса (при нажатии на него) */
.custom-checkbox-orange:not(:disabled):active + label::before {
  border-color: gray;
}

/* стили для чекбокса, находящегося в фокусе и не находящегося в состоянии checked */
.custom-checkbox-orange:focus:not(:checked) + label::before {
  border-color: gray;
}

/* стили для чекбокса, находящегося в состоянии checked */
.custom-checkbox-orange:checked + label::before {
  background-color: rgb(251 146 60);
  background-image: url("data:image/svg+xml,%3csvg width='10' height='10' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 26 20'%3e%3cpath fill='%23fff' d='M24.4107 1.30299C25.2766 2.02718 25.3681 3.2892 24.6148 4.1218L11.8142 18.2718C10.8103 19.3815 9.06094 19.4991 7.9062 18.5344L0.902667 12.6839C0.0362917 11.9601 -0.0558157 10.6982 0.69694 9.86518C1.44969 9.0322 2.76226 8.94364 3.62864 9.66738L9.58691 14.6447L21.4789 1.49931C22.2321 0.666707 23.5447 0.578813 24.4107 1.30299z'/%3e%3c/svg%3e");
  border: 1px solid #ff9123;
}

/* стили для чекбокса, находящегося в состоянии disabled */
.custom-checkbox-orange:disabled + label::before {
  background-color: #e9ecef;
}
/* remove the original arrow */
.custom-select {
  font-size: 14px;
  border: 1px solid rgba(0,0,0,0.17);
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  height: 40px;
  color:#606061;
  background-color: white;
  background: transparent
    url('http://cdn1.iconfinder.com/data/icons/cc_mono_icon_set/blacks/16x16/br_down.png')
    no-repeat 132px center;
  background-size: 7%;
}
/* CAUTION: IE hackery ahead */
.custom-select::-ms-expand {
  display: none; /* remove default arrow on ie10 and ie11 */
}

/* target Internet Explorer 9 to undo the custom arrow */
@media screen and (min-width: 0\0) {
  .custom-select {
    background: none\9;
    padding: 5px\9;
  }
}

/* loader */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

</style>
