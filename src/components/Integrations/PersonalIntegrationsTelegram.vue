<template>
  <NavBar
    class="pt-[8px]"
    title="Интеграции"
    route="/settings/integrations"
    :breadcrumbs="[{ name: 'Телеграм', selected: true }]"
  />
  <div class="w-full px-10 py-5 h-auto bg-white rounded-[8px]">
    <div
      class="flex w-[450px] justify-center flex-col"
    >
      <div class="flex items-center">
        <img
          class="h-[30px] w-[30px]"
          src="@/assets/images/telegram.png"
        >
        <span class="ml-[10px] font-[500]">Персональная интеграция через Телеграм</span>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '../Navbar/NavBar.vue'

export default {
  components: {
    NavBar
  }
}
</script>
