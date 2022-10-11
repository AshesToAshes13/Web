<template>
  <div class="flex mb-[15px]">
    <div
      class="border border-transparent bg-[#F4F5F7] rounded-[8px] min-h-[51px] grow flex items-center p-[15px]"
      :class="{'!bg-white border-[#e0e0e0]': inFocus && !(rightAnswer || answer.is_right), '!bg-[#f1f9f4] !border-[#c6e8d1]': rightAnswer || answer.is_right}"
    >
      <div
        class="h-[20px] w-[20px] shrink-0 mr-[12px] flex items-center justify-center rounded-[5px]"
        :class="rightAnswer || answer.is_right ? 'bg-[#1CA345]' : 'border border-[#cccccc] bg-white'"
        @click="setRightAnswer(!rightAnswer)"
      >
        <svg
          v-if="rightAnswer || answer.is_right"
          width="13"
          height="9"
          viewBox="0 0 13 9"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.02655 8.66537C4.79903 8.66537 4.57153 8.56513 4.34401 8.4649L0.590007 5.95904C0.134976 5.65834 0.021222 4.95669 0.362495 4.55576C0.703768 4.15482 1.50006 4.05458 1.9551 4.35528L4.9128 6.25974L10.7144 0.64661C11.1695 0.245672 11.852 0.245674 12.307 0.546377C12.7621 0.947315 12.7621 1.54872 12.4208 1.94966L5.93661 8.16419C5.7091 8.56513 5.36782 8.66537 5.02655 8.66537Z"
            fill="white"
          />
        </svg>
      </div>
      <div
        :ref="answer.uid + 'input'"
        :placeholder="answerPlaceholder(answer)"
        spellcheck="false"
        class="font-[500] text-[14px] text-[#4C4C4D] leading-[25px] font-['Roboto'] break-words cursor-editing grow"
        :class="{'invalid': answer.invalid, 'text-[#7E7E80]': !(rightAnswer || answer.is_right)}"
        style="word-break: break-word"
        contenteditable="true"
        @focus="inFocus = true"
        @blur="inFocus = false"
        @input="maxAnswerLength"
        @keydown.enter.exact.prevent="$emit('addAnswer')"
        @focusout="updateAnswerName"
        @paste="pasteAsPlainText"
        v-text="answer.name"
      />
    </div>
    <div
      class="flex flex-row items-center cursor-pointer mr-1 mt-2 hover:transition hover:opacity-[0.8] ml-[20px]"
      @click="deleteAnswer"
    >
      <svg
        width="14"
        height="16"
        viewBox="0 0 14 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5.92308 2.64286H8.07692C8.07692 2.3587 7.96346 2.08617 7.7615 1.88524C7.55954 1.68431 7.28562 1.57143 7 1.57143C6.71438 1.57143 6.44046 1.68431 6.2385 1.88524C6.03654 2.08617 5.92308 2.3587 5.92308 2.64286ZM4.84615 2.64286C4.84615 2.07454 5.07308 1.52949 5.477 1.12763C5.88093 0.725765 6.42876 0.5 7 0.5C7.57124 0.5 8.11907 0.725765 8.523 1.12763C8.92692 1.52949 9.15385 2.07454 9.15385 2.64286H13.4615C13.6043 2.64286 13.7413 2.6993 13.8423 2.79976C13.9433 2.90023 14 3.03649 14 3.17857C14 3.32065 13.9433 3.45691 13.8423 3.55738C13.7413 3.65784 13.6043 3.71429 13.4615 3.71429H12.8542L11.5565 13.1836C11.4684 13.8253 11.1497 14.4135 10.6593 14.8394C10.1688 15.2653 9.5399 15.5 8.88892 15.5H5.11108C4.4601 15.5 3.83116 15.2653 3.34072 14.8394C2.85028 14.4135 2.53155 13.8253 2.44354 13.1836L1.14585 3.71429H0.538462C0.395653 3.71429 0.258693 3.65784 0.157712 3.55738C0.0567306 3.45691 0 3.32065 0 3.17857C0 3.03649 0.0567306 2.90023 0.157712 2.79976C0.258693 2.6993 0.395653 2.64286 0.538462 2.64286H4.84615ZM5.92308 6.39286C5.92308 6.25078 5.86635 6.11452 5.76537 6.01405C5.66438 5.91358 5.52742 5.85714 5.38462 5.85714C5.24181 5.85714 5.10485 5.91358 5.00387 6.01405C4.90288 6.11452 4.84615 6.25078 4.84615 6.39286V11.75C4.84615 11.8921 4.90288 12.0283 5.00387 12.1288C5.10485 12.2293 5.24181 12.2857 5.38462 12.2857C5.52742 12.2857 5.66438 12.2293 5.76537 12.1288C5.86635 12.0283 5.92308 11.8921 5.92308 11.75V6.39286ZM8.61539 5.85714C8.75819 5.85714 8.89515 5.91358 8.99614 6.01405C9.09712 6.11452 9.15385 6.25078 9.15385 6.39286V11.75C9.15385 11.8921 9.09712 12.0283 8.99614 12.1288C8.89515 12.2293 8.75819 12.2857 8.61539 12.2857C8.47258 12.2857 8.33562 12.2293 8.23463 12.1288C8.13365 12.0283 8.07692 11.8921 8.07692 11.75V6.39286C8.07692 6.25078 8.13365 6.11452 8.23463 6.01405C8.33562 5.91358 8.47258 5.85714 8.61539 5.85714ZM3.51077 13.0389C3.56362 13.4239 3.75485 13.7768 4.04906 14.0322C4.34328 14.2877 4.72056 14.4285 5.11108 14.4286H8.88892C9.27963 14.4288 9.65717 14.2881 9.95161 14.0326C10.246 13.7771 10.4374 13.4241 10.4903 13.0389L11.7675 3.71429H2.23246L3.51077 13.0389Z"
          fill="#7E7E80"
        />
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    answer: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['addAnswer', 'deleteAnswer', 'setRightAnswer', 'updateAnswerName'],
  expose: ['onFocus'],
  data () {
    return {
      name: '',
      rightAnswer: false,
      inFocus: false
    }
  },
  methods: {
    answerPlaceholder (answer) {
      if (answer.name === '' && answer.invalid) {
        return 'Поле ответа не должно быть пустым'
      }
      return 'Текст ответа'
    },
    maxAnswerLength () {
      const maxLength = 280
      const answerInput = this.$refs[this.answer.uid + 'input']
      if (answerInput.innerHTML.length > maxLength) {
        answerInput.innerHTML = answerInput.innerHTML.substr(0, maxLength)
        answerInput.blur()
      }
    },
    deleteAnswer () {
      this.$emit('deleteAnswer', this.answer.uid)
    },
    setRightAnswer (val) {
      this.rightAnswer = val
      this.$emit('setRightAnswer', [this.answer, val])
    },
    updateAnswerName (event) {
      this.$emit('updateAnswerName', [event.target.innerText, this.answer])
    },
    onFocus () {
      this.$refs[this.answer.uid + 'input'].focus()
      const range = document.createRange()
      const sel = document.getSelection()
      range.setStart(this.$refs[this.answer.uid + 'input'], 0)
      range.collapse(true)
      sel.removeAllRanges()
      sel.addRange(range)
    },
    pasteAsPlainText (e) {
      // Функция исправляет баг, когда текст вставляется как html тег
      e.preventDefault()
      const text = (e.originalEvent || e).clipboardData.getData('text/plain')
      document.execCommand('insertHTML', false, text)
    }
  }
}
</script>

<style scoped>
[placeholder]:empty::before {
    content: attr(placeholder);
    color: #555;
}
.invalid[placeholder]:empty::before {
    color: rgb(239 68 68);
}
</style>
