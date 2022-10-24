<template>
  <div class="mt-10">
    <p class="text-[18px] font-roboto font-[700] text-[#424242]">
      История кармы
    </p>
    <div v-if="!sortedKarmaListByDate.length">
      <p class="text-center text-md mt-10 text-[#4C4C4D]">
        У вас еще нет истории 😞 <br>
        Ваша карма формируется из задач, порученных вам через Инспектора <br>
        (кнопка Добавить задачу в Навигаторе)
      </p>
    </div>
    <div class="flex flex-col mt-3">
      <div
        v-for="karma in sortedKarmaListByDate"
        :key="karma"
        class="mb-2"
      >
        <KarmaTask
          :karma="karma"
        />
      </div>
    </div>
  </div>
</template>
<script>
import KarmaTask from './KarmaTask.vue'

export default {
  components: { KarmaTask },
  computed: {
    karmaList () {
      return this.$store.state.inspector.karma
    },
    sortedKarmaListByDate () {
      return [...this.karmaList].sort((a, b) => new Date(b.creation_date) - new Date(a.creation_date))
    }
  }

}

</script>
