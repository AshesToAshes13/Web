<template>
  <img
    class="mx-auto mt-10"
    width="320"
    height="314"
    src="@/assets/images/boards.svg"
    alt="Empty task image"
  >
  <div class="w-[600px]">
    <p class="font-bold p-3">
      Визуализируйте цели, проекты и командную работу с помощью досок
    </p>
    <ul class="list-decimal pl-[30px]">
      <li class="p-3 text-sm">
        Мои доски - это ваши доски. Вы можете установить цвет для доски и добавить коллег с определенными правами, чтобы приступить к совместной работе
      </li>
      <li class="p-3 text-sm">
        Общие доски - доски, к которым вам дали доступ
      </li>
      <li class="p-3 text-sm">
        Участники доски видят все карточки в ней
      </li>
    </ul>
  </div>
  <OnBoardingButton
    @okToModal="okToModal"
  />
</template>
<script>
import OnBoardingButton from '../onBoarding/onBoardingButton.vue'
export default {
  components: { OnBoardingButton },
  emits: ['okToModal'],
  methods: {
    okToModal () {
      this.$emit('okToModal')
    }
  }
}
</script>
