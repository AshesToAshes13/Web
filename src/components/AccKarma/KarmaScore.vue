<template>
  <div class="flex font-roboto font-normal justify-between">
    <div class="bg-[#FBEFE2] my-7 w-full h-[129px] rounded-[12px] p-[24px] flex flex-col items-center justify-center]">
      <span class="font-[500] text-[15px] leading-[18px] text-[#424242]">Общий показатель</span>
      <span
        class="font-[700] text-[40px] text-[#2E2E2F] leading-[47px] mt-3"
      >
        {{ karmaQuantity }}
      </span>
    </div>
    <div class="bg-[#EDFAEB] mx-4 my-7 w-full h-[129px] rounded-[12px] p-[24px] flex flex-col items-center justify-center]">
      <span class="font-[500] text-[15px] leading-[18px] text-[#424242]">Сделано в срок</span>
      <span
        class="font-[700] text-[40px] text-[#2E2E2F] leading-[47px] mt-3"
      >
        {{ successQuantity }}
      </span>
    </div>
    <div class="bg-[#FDEEEE] my-7 w-full h-[129px] rounded-[12px] p-[24px] flex flex-col items-center justify-center]">
      <span class="font-[500] text-[15px] leading-[18px] text-[#424242]">Просроченных</span>
      <span
        class="font-[700] text-[40px] text-[#2E2E2F] leading-[47px] mt-3"
      >
        {{ overdueQuantity }}
      </span>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    karmaQuantity: {
      type: Number,
      default: 0
    },
    successQuantity: {
      type: Number,
      default: 0
    },
    overdueQuantity: {
      type: Number,
      default: 0
    }
  }
}
</script>
