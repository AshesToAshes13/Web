<template>
  <div
    class="flex flex-col items-center text-center"
  >
    <SlideBodyTitle title="Вы в Очереди!" />
    <div class="flex flex-col items-center md:gap-[20px] xl:gap-[35px] 2xl:gap-[45px]">
      <div class="max-w-[600px]">
        <article class="font-normal md:text-[16px] lg:text-[18px] text-center leading-[29px] w-full pl-0">
          <p class=" text-[#4C4C4D]">
            Она выдает вам задачи, заявки и важные уведомления по очереди, а Вы работаете с ними сфокусировано и не отвлекаетесь
          </p>
        </article>
      </div>
      <img
        v-if="showPreviewPicture"
        src="@/assets/images/slides/addEmployes.png"
        class="cursor-pointer 2xl:w-[560px] 2xl:h-[315px] xl:w-[415px] xl:h-[240px]"
        @click="playVideo"
      >
      <iframe
        v-if="!showPreviewPicture"
        width="560"
        height="315"
        :src="`https://www.youtube.com/embed/Jx-TBirC_Cc?${!showPreviewPicture ? 'autoplay=1' : ''}`"
        title="YouTube video player"
        allow="accelerometer;clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        class="border-[3px] rounded-xl border-[#2E2E2E] 2xl:w-[560px] 2xl:h-[315px] xl:w-[415px] xl:h-[240px]"
      />

      <SlideBodyButton
        text="Попробовать"
        @click="clickDoitnowStartSuccess"
      />
    </div>
  </div>
</template>
<script>
import SlideBodyTitle from './SlideBodyTitle.vue'
import SlideBodyButton from './SlideBodyButton.vue'
export default {
  components: { SlideBodyTitle, SlideBodyButton },
  props: {
    showPreviewPicture: {
      type: Boolean,
      default: true
    }
  },
  emits: ['clickDoitnowStartSuccessEmit', 'playVideoEmit'],
  methods: {
    clickDoitnowStartSuccess () {
      this.$emit('clickDoitnowStartSuccessEmit')
    },
    playVideo () {
      this.$emit('playVideoEmit')
    }
  }
}
</script>
