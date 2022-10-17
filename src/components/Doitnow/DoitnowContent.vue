<template>
  <div class="flex max-w-[1033px] justify-between gap-[12px]">
    <div
      class="grow pt-[18px] pb-[30px] px-[25px] bg-white rounded-[12px] overflow-hidden border-t-[12px] border-transparent"
      :style="{borderColor: borderColor}"
    >
      <slot />
    </div>
    <div class="flex-none flex flex-col min-w-[200px] gap-[6px] empty:hidden">
      <slot name="buttons" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    borderColor: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
</style>
