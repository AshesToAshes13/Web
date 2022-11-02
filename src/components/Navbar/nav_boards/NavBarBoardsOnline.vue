<template>
  <img
    :title="user.name"
    class="w-[30px] h-[30px] rounded-full"
    :alt="user.name"
    :src="user.fotolink"
  >
</template>
<script>
export default {
  props: {
    user: {
      type: Object,
      default: () => {}
    }
  }
}
</script>
