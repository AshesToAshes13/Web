<template>
  <form class="text-left w-40">
    <div class="text-center mb-3 mr-5">
      <div class="pr-2">
        <span class="circle-image">
          <img
            v-if="userPhoto"
            :src="userPhoto"
            class="rounded-[27px] content-center object-cover"
          >
        </span>
      </div>
      <div>
        <input
          id="iconfile"
          type="file"
          class="hidden"
          accept="image/png, image/jpeg"
          @change="changeUserPhoto"
        >
        <label
          for="iconfile"
          class="text-[14px] mr-3 justify-center cursor-pointer text-[#606061] hover:text-[#3d3d3d]"
        >
          Изменить фото
        </label>
        <br>
      </div>
    </div>
  </form>
</template>
<script>
export default {
  props: {
    userPhoto: {
      type: String,
      default: ''
    }
  },
  emits: ['changeUserPhotoEmit'],
  methods: {
    changeUserPhoto (event) {
      this.$emit('changeUserPhotoEmit', event)
    }
  }
}
</script>

<style scoped>
.circle-image {
  display: inline-block;
  border-radius: 10px;
}
.circle-image img {
  width: 106px;
  height: 106px;
}
</style>
