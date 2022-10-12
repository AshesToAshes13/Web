<template>
  <img
    class="mx-auto mt-10"
    width="320"
    height="314"
    src="@/assets/images/regl.svg"
    alt="Empty task image"
  >
  <div class="w-[600px]">
    <p class="font-bold p-3 text-left">
      Автоматизируйте процесс внедрения новых сотрудников и аттестуйте текущих с помощью регламентов
    </p>
    <ul class="list-decimal pl-[30px]">
      <li class="p-3 text-sm">
        Запишите регламент и создайте тест, чтобы ваши сотрудники могли пройти его
      </li>
      <li class="p-3 text-sm">
        Общие регламенты - регламенты для всех сотрудников компании. Их должен знать каждый в компании
      </li>
      <li class="p-3 text-sm">
        Регламенты по отделам - доступны только сотрудникам отделов
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
