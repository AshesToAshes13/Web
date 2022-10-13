<template>
  <ReglamentCompleteMessage
    v-if="showCompleteMessage"
    :is-passed="isPassed"
    @confirm="confirm"
  />
  <div
    v-if="!isPassed"
    ref="reglamentTestRef"
    class="bg-white pt-[55px] my-2 rounded-[28px]"
  >
    <div
      v-if="!showCompleteMessage"
    >
      <div class="text-center mx-auto max-w-[770px]">
        <h2 class="font-bold text-[25px] text-[#2E2E2E] break-words">
          {{ reglament.name }}
        </h2>
      </div>
      <!-- Линия-разделитель -->
      <div class="bg-black opacity-[.12] h-[1px] w-[calc(100%-80px)] my-[45px] mx-[40px]" />
      <div class="max-w-[550px] mx-auto">
        <template
          v-for="(question , index) in questions"
          :key="index"
        >
          <ReglamentTestQuestion
            :question="question"
            @selectAnswer="selectAnswer"
          />
        </template>
      </div>
    </div>
    <!--  кнопка завершения-->
    <div
      v-if="questions.length > 0 && !showCompleteMessage"
      class="flex justify-center pb-[20px]"
    >
      <button
        class="flex min-w-[175px] justify-center items-end bg-[#FF912380] p-3 px-10 rounded-[8px] text-[#2E2E2E] text-sm mr-1 hover:bg-[#F5DEB3] font-medium"
        :class="{ 'bg-[#E7E2E1] hover:bg-[#C5C5C5]': disableButton === true }"
        :disabled="disableButton"
        @click="clickComplete"
      >
        {{ completeText }}
      </button>
    </div>
    <!-- отображение неправильных вопросов-->
    <div
      v-if="showCompleteMessage && !isPassed"
      class="max-w-[550px] mx-auto"
    >
      <h3
        class="text-[#2E2E2E] text-[19px] font-bold leading-[25px] mb-[35px]"
      >
        Вы неправильно ответили на следующие вопросы:
      </h3>
      <template
        v-for="question in questions"
        :key="question.uid"
      >
        <ReglamentWrong
          v-if="showCompleteMessage"
          :question="question"
        />
      </template>
      <p
        class="font-[700] text-[16px] text-[#2E2E2E] mt-10 leading-[26px] text-center"
      >
        Пожалуйста, еще раз внимательно ознакомьтесь с регламентом и пройдите текст повторно
      </p>
      <div class="w-full flex justify-center">
        <button
          class="flex bg-[#F2B679] text-[14px] leading-[16px] font-medium p-3 px-10 mt-10 mb-5 rounded-[8px] text-[#2E2E2E] text-sm mr-1 hover:bg-[#F5DEB3]"
          @click="confirm(isPassed)"
        >
          Завершить
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import ReglamentTestQuestion from '@/components/Reglaments/ReglamentTestQuestion'
import ReglamentWrong from '@/components/Reglaments/ReglamentWrong'
import ReglamentCompleteMessage from '@/components/Reglaments/ReglamentCompleteMessage'
import * as REGLAMENTS from '@/store/actions/reglaments'
export default {
  components: { ReglamentCompleteMessage, ReglamentWrong, ReglamentTestQuestion },
  props: {
    reglament: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['exitTestingMode'],
  data () {
    return {
      showCompleteMessage: false,
      isPassed: 0,
      disableButton: false,
      completeText: 'Завершить'
    }
  },
  computed: {
    user () {
      return this.$store.state.user.user
    },
    currReglament () {
      return this.$store.state.reglaments.reglaments[this.reglament?.uid]
    },
    questions () {
      return this.$store?.state?.reglaments?.reglamentQuestions
    }
  },
  mounted () {
    this.$refs.reglamentTestRef.scrollIntoView({ block: 'start' })
  },
  methods: {
    clickComplete () {
      const data = {
        uid_user: this.user.current_user_uid,
        uid_reglament: this.currReglament.uid,
        answerJson: JSON.stringify(this.questions)
      }
      console.log('this.questions -->', this.questions)
      this.disableButton = true
      this.completeText = 'Завершение...'
      this.$store.dispatch(REGLAMENTS.CRATE_USER_REGLAMENT_ANSWER, data).then((resp) => {
        const reglament = { ...this.currReglament }
        reglament.is_passed = resp.data.is_passed
        this.$store.commit('NAVIGATOR_UPDATE_REGLAMENT', reglament)
        this.showCompleteMessage = true
        this.isPassed = resp.data.is_passed
        this.disableButton = false
        this.completeText = 'Завершить'
      })
    },
    confirm (val) {
      if (this.$store.state.reglaments.returnDoitnow === true && this.isPassed === 1) {
        this.$router.push('/doitnow')
        this.$store.state.reglaments.returnDoitnow = false
        return
      }
      if (val) {
        this.$store.dispatch('asidePropertiesToggle', false)
        this.$router.push('/reglaments')
      }
      // обнуляем значения, чтобы юзер ещё раз прочитал регламент
      this.showCompleteMessage = false
      this.$emit('exitTestingMode')
      // обнуляем значение selected
      this.$store.commit(REGLAMENTS.REGLAMENT_RESTORE_SELECTED)
    },
    selectAnswer (data) {
      this.$store.commit(REGLAMENTS.REGLAMENT_SELECT_ANSWER, data)
    }
  }
}
</script>
