<template>
  <div
    class="flex flex-col max-w-xl mx-auto mt-[100px]"
  >
    <div class="w-[600px] font-roboto text-[#424242] mb-10">
      <p class="font-[700] mb-10 text-left text-[25px] leading-[35px] text-center">
        Добро пожаловать!
      </p>
      <p class="font-[400] text-[18px] text-center leading-[28px]">
        Посмотрите это короткое видео, чтобы понять как ЛидерТаск поможет вам организовать работу в вашей компании
      </p>
    </div>
    <img
      v-if="showPreviewPicture"
      src="@/assets/images/slides/addEmployes.png"
      class="w-[560px] h-[315px] cursor-pointer"
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
      class="border-[3px] rounded-xl border-[#2E2E2E]"
    />
    <button
      class="w-xl-1/6 w-[238px] mt-10 h-[40px] justify-center cursor-pointer bg-[#F2B679] text-[#2E2E2E] text-[14px] px-10 rounded-md hover:bg-slate-200 font-medium mx-auto"
      @click="okToModal"
    >
      Начать
    </button>
  </div>
</template>
<script>
export default {
  emits: ['okToModal'],
  data () {
    return {
      showPreviewPicture: true
    }
  },
  methods: {
    okToModal () {
      this.$emit('okToModal')
    },
    playVideo () {
      this.showPreviewPicture = false
    }
  }
}
</script>
