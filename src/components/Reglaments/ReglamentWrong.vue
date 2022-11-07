<template>
  <div
    v-if="showQuestion"
    class="bg-[#F4F5F7] p-3 rounded-[10px] mb-[10px]"
  >
    <div class="px-1 flex justify-between items-center group">
      <div class="font-[400] text-[16px] leading-[22px] font-['Roboto'] text-[#4C4C4D] my-3 min-w-[10px] min-h-[10px] break-words">
        {{ question.name }}
      </div>
    </div>
    <div
      v-if="correctAnswers.length"
      class="font-[400] text-[#4C4C4D] text-[16px] my-1 min-w-[10px] min-h-[10px] px-1 break-words"
    >
      Правильные ответы:
      <ul>
        <li
          v-for="correctAnswer in correctAnswers"
          :key="correctAnswer.id"
          class="break-words"
        >
          {{ correctAnswer.name }}
        </li>
      </ul>
    </div>
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
  data () {
    return {
      correctAnswers: []
    }
  },
  computed: {
    showQuestion () {
      // правильные ответы
      const creatorAnswers = this.question.answers.filter(answ => answ.is_right)
      // ответы пользователя
      const userAnswers = this.question.answers.filter(answ => answ.selected)

      // проверяем совпадают ли элементы в массивах
      if (userAnswers.length === 0) return true

      // Если в вопросе больше одного ответа
      if (creatorAnswers.length > 1) {
        return this.checkMultiQuestion(creatorAnswers, userAnswers)
      }
      for (let i = 0; i < userAnswers.length; i++) {
        if (userAnswers[i]?.uid !== creatorAnswers[i]?.uid) {
          return true
        }
      }
      return false
    }

  },
  methods: {
    checkMultiQuestion (creatorAnswers, userAnswers) {
      const correctUserAnswers = userAnswers.filter((answer) => creatorAnswers.includes(answer))
      const correctAnswersDifference = creatorAnswers.filter((answer) => !correctUserAnswers.includes(answer))
      if (creatorAnswers.length === userAnswers.length && correctAnswersDifference.length === 0) {
        return false
      }
      const incorrectAnswersDifference = creatorAnswers.filter((answer) => correctUserAnswers.includes(answer))
      this.correctAnswers = incorrectAnswersDifference.map((answer) => { return { id: answer.id, name: answer.name } })
      return true
    }
  }
}
</script>
<style scoped></style>
