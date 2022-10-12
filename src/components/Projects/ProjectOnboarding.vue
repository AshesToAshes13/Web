<template>
  <img
    class="mx-auto mt-10"
    width="280"
    height="314"
    src="@/assets/images/emptyproject.png"
    alt="Empty task image"
  >
  <div class="w-[600px]">
    <p class="font-bold p-3">
      Организуйте проекты по определенному направлению, теме или сфере в вашем бизнесе
    </p>
    <ul class="list-decimal pl-[30px]">
      <li class="p-3 text-sm">
        Мои проекты - это ваши проекты. Вы можете установить цвет для проекта и добавить в него коллег, чтобы совместно работать над задачами
      </li>
      <li class="p-3 text-sm">
        Общие проекты - проекты, к которым вам дали доступ
      </li>
      <li class="p-3 text-sm">
        Участники проекта видят все задачи в нем
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
