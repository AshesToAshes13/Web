<template>
  <div
    class="flex flex-col items-center max-w-[600px] mx-auto"
  >
    <img
      class="mx-auto mt-10"
      width="320"
      height="314"
      src="@/assets/images/emptytask2.png"
      alt="Empty task image"
    >
    <p class="font-bold p-3">
      Работайте с задачами и поручениями, которые должны быть выполнены сегодня
    </p>
    <p class="text-sm p-3">
      Запишите сюда все ваши рабочие дела и встречи, а также выполняйте поручения
      от коллег, которые ждут от вас результатов сегодня
    </p>
    <OnBoardingButton
      @okToModal="onOk"
    />
  </div>
</template>

<script>
import OnBoardingButton from '../onBoarding/onBoardingButton.vue'
export default {
  components: { OnBoardingButton },
  emits: ['ok'],
  methods: {
    onOk () {
      this.$emit('ok')
    }
  }
}
</script>

<style scoped></style>
