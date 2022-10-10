<template>
  <div class="flex items-center gap-[16px]">
    <span class="flex-none w-[100px] font-roboto text-[#7E7E80] text-[13px] leading-[15px] overflow-hidden">
      {{ keyTitle }}
    </span>
    <div class="flex items-center gap-[6px] font-roboto text-[13px] leading-[15px] font-medium text-[#4C4C4D]">
      <slot />
      <span
        v-if="valueText"
        :style="{ color: valueColor || '#4C4C4D' }"
      >
        {{ valueText }}
      </span>
      <slot name="value" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    keyTitle: {
      type: String,
      default: ''
    },
    valueText: {
      type: String,
      default: ''
    },
    valueColor: {
      type: String,
      default: ''
    }
  }
}
</script>

<style>

</style>
