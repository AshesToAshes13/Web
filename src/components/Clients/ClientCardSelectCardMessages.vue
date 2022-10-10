<template>
  <div
    class="md:mt-[15px] xl:mt-[20px] 2xl:mt-[30px] font-roboto xl:text-[13px] 2xl:text-[16px] leading-[19px] font-medium text-[#4c4c4d]"
  >
    Карточки клиента
  </div>
  <div
    v-for="card in cards"
    :key="card.uid"
  >
    <div class="md:mt-[8px] xl:mt-[10px] 2xl:mt-[15px] w-full focus:ring-0 focus:outline-none flex">
      <span class="border-gray-500 rounded border-[1px] p-2 font-roboto font-bold xl:text-[12px] 2xl:text-[14px] leading-[21px] text-[#424242]">

        {{ card.name }}
      </span>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    cards: {
      type: Array,
      required: true
    }
  },
  emits: ['selectCard', 'clearCardChat'],
  computed: {
    selectOptions () {
      return this.cards.map(card => ({
        value: card.uid,
        label: card.name
      }))
    }
  },
  methods: {
    selectOption () {
      if (this.$refs.selectedOption.value === 'clientchat' || !this.$refs.selectedOption.value) {
        this.$emit('clearCardChat')
      } else {
        this.$emit('selectCard', this.$refs.selectedOption.value)
      }
    }
  }
}
</script>
