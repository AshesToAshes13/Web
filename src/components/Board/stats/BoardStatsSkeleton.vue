<template>
  <template
    v-for="i in 3"
    :key="i"
  >
    <tr class="h-[48px]">
      <td class="pl-[14px]">
        <div class="flex items-center">
          <div class="rounded-sm bg-gray-300 h-[20px] w-[20px] mr-[7px]" />
          <div
            class="h-2.5 bg-gray-300 rounded-full"
            :style="{width: getRandomNumber(70, 140) + 'px'}"
          />
        </div>
      </td>
      <td
        v-for="j in count"
        :key="j"
        class="pl-[14px]"
      >
        <div
          class="h-2.5 bg-gray-300 rounded-full"
          :style="{width: getRandomNumber(100, 120) + 'px'}"
        />
      </td>
    </tr>
  </template>
</template>

<script>
export default {
  props: {
    count: {
      type: Number,
      default: 4
    }
  },
  methods: {
    getRandomNumber (min, max) {
      return Math.random() * (max - min) + min
    }
  }
}
</script>
