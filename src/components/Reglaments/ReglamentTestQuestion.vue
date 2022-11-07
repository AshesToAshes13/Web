<template>
  <div class="mb-[45px]">
    <h3 class="text-[#4C4C4D] font-bold text-[19px] leading-[25px] text-center mb-[25px] break-words">
      {{ question.name }}
    </h3>
    <label
      v-for="answer in question.answers"
      :key="answer.uid"
      class="answer flex justify-between items-center rounded-[8px] px-[16px] py-[20px] bg-[#F4F5F7] mb-[10px]"
    >
      <div class="w-[500px] break-words">
        {{ answer.name }}
      </div>
      <input
        :name="`answers-${question.uid}`"
        :type="answerType"
        @change="selectAnswer($event, answer)"
      >
      <span
        v-if="answerType === 'checkbox'"
        class="checkmark flex justify-center items-center shrink-0"
      >
        <svg
          class="check"
          width="13"
          height="10"
          viewBox="0 0 13 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.02948 9.16732C4.80196 9.16732 4.57446 9.06709 4.34694 8.96685L0.592936 6.46099C0.137906 6.16029 0.0241517 5.45865 0.365425 5.05771C0.706698 4.65677 1.50299 4.55653 1.95802 4.85723L4.91573 6.76169L10.7174 1.14856C11.1724 0.747625 11.8549 0.747627 12.31 1.04833C12.765 1.44927 12.765 2.05068 12.4237 2.45161L5.93954 8.66615C5.71203 9.06709 5.37075 9.16732 5.02948 9.16732Z"
            fill="white"
          />
        </svg>
      </span>

      <span
        v-if="answerType === 'radio'"
        class="radio flex justify-center items-center shrink-0"
      />
    </label>
  </div>
</template>

<script>
export default {
  props: {
    question: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['selectAnswer'],
  computed: {
    answerType () {
      const rightAnswers = this.question.answers.filter(answ => answ.is_right).length
      return rightAnswers > 1 ? 'checkbox' : rightAnswers === 1 ? 'radio' : null
    }
  },
  methods: {
    selectAnswer (el, answer) {
      this.$emit('selectAnswer', [answer, el.target.checked])
    }
  }
}
</script>

<style scoped>
.answer input {
  appearance: none;
  width: 0;
  height: 0;
  opacity: 0;
}
.answer input:checked ~ .checkmark {
  @apply border-none bg-[#FF9123]
}

.answer input:checked ~ .checkmark .check {
  @apply block
}

.answer input:checked ~ .radio {
  @apply before:content-[''] before:h-[10px] before:w-[10px] before:rounded-full before:bg-[#FF9123]
}

.checkmark {
  @apply h-[20px] w-[20px] bg-white rounded-[5px] border-[1px] border-[#CCCCCC]
}

.check {
  @apply hidden
}

.radio {
  @apply h-[20px] w-[20px] bg-white rounded-full border-[1px] border-[#CCCCCC]
}
</style>
