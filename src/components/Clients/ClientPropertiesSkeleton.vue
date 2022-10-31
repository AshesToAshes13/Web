<template>
  <div class="flex flex-col animate-pulse">
    <div
      class="mb-[30px]"
    >
      <div class="bg-gray-300 w-[30px] h-[5px] mb-[10px] rounded-xl" />
      <div class="bg-gray-300 w-[150px] h-[8px] mb-[10px] rounded-xl" />
    </div>
    <div
      class="mb-[30px]"
    >
      <div class="bg-gray-300 w-[60px] h-[5px] mb-[10px] rounded-xl" />
      <div class="bg-gray-300 w-[170px] h-[8px] mb-[10px] rounded-xl" />
    </div>
    <div
      class="mb-[30px]"
    >
      <div class="bg-gray-300 w-[40px] h-[5px] mb-[10px] rounded-xl" />
      <div class="bg-gray-300 w-[240px] h-[8px] mb-[10px] rounded-xl" />
    </div>
    <div
      class="mb-[30px]"
    >
      <div class="bg-gray-300 w-[40px] h-[5px] mb-[10px] rounded-xl" />
      <div class="bg-gray-300 w-[170px] h-[8px] mb-[10px] rounded-xl" />
    </div>

    <div class="border-t border-[rgba(0,0,0,.1)] pt-[35px]">
      <div class="bg-gray-300 w-[130px] h-[10px] mb-[25px] rounded-xl" />
      <div class="flex flex-col gap-y-[5px]">
        <div
          v-for="i in 3"
          :key="i"
          class="w-full py-[5px] px-[15px] h-[35px] bg-[#F4F5F7] rounded-[6px]"
        />
      </div>
    </div>
  </div>
</template>
