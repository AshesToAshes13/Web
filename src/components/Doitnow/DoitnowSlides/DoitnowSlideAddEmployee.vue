<template>
  <div
    class="flex flex-col items-center text-center justify-center"
  >
    <SlideBodyTitle title="Добавьте сотрудника!" />
    <div class="flex flex-col items-center gap-[45px]">
      <div class="max-w-[600px]">
        <article class="font-normal md:text-[16px] lg:text-[18px] text-center leading-[29px] w-full pl-0">
          <p class="text-[#4C4C4D]">
            И Вы сможете поручать задачи, делегировать работу с клиентами и многое другое
          </p>
        </article>
      </div>

      <img
        v-if="showPreviewPicture"
        src="@/assets/images/slides/addEmployes.png"
        class="cursor-pointer md:w-[415px] md:h-[240px] lg:w-[560px] lg:h-[315px]"
        @click="playVideo"
      >
      <iframe
        v-if="!showPreviewPicture"
        :src="`https://www.youtube.com/embed/Jx-TBirC_Cc?${!showPreviewPicture ? 'autoplay=1' : ''}`"
        title="YouTube video player"
        allow="accelerometer;clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        class="border-[3px] md:w-[415px] md:h-[240px] lg:w-[560px] lg:h-[315px] rounded-xl border-[#2E2E2E]"
      />

      <SlideBodyButton
        text="Добавить"
        @click="clickAddEmployees"
      />
    </div>
  </div>
</template>
<script>
import SlideBodyButton from './SlideBodyButton.vue'
import SlideBodyTitle from './SlideBodyTitle.vue'

export default {
  components: { SlideBodyButton, SlideBodyTitle },
  props: {
    showPreviewPicture: {
      type: Boolean,
      default: true
    }
  },
  emits: ['clickAddEmployeesEmit', 'playVideoEmit'],
  methods: {
    clickAddEmployees () {
      this.$emit('clickAddEmployeesEmit')
    },
    playVideo () {
      this.$emit('playVideoEmit')
    }
  }
}
</script>
