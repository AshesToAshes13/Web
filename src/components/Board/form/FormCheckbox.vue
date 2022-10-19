<template>
  <div @click="checked = !checked">
    <svg
      v-if="isChecked"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 5C0 2.23858 2.23858 0 5 0H15C17.7614 0 20 2.23858 20 5V15C20 17.7614 17.7614 20 15 20H5C2.23858 20 0 17.7614 0 15V5Z"
        fill="#FF9123"
      />
      <path
        d="M9.02899 14.1663C8.80147 14.1663 8.57397 14.0661 8.34645 13.9659L4.59245 11.46C4.13742 11.1593 4.02366 10.4577 4.36494 10.0567C4.70621 9.65579 5.50251 9.55555 5.95754 9.85626L8.91524 11.7607L14.7169 6.14759C15.1719 5.74665 15.8545 5.74665 16.3095 6.04735C16.7645 6.44829 16.7645 7.0497 16.4232 7.45064L9.93905 13.6652C9.71154 14.0661 9.37026 14.1663 9.02899 14.1663Z"
        fill="white"
      />
    </svg>
    <svg
      v-else
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        width="20"
        height="20"
        rx="4"
        fill="#EEEFF1"
      />
      <rect
        x="0.5"
        y="0.5"
        width="19"
        height="19"
        rx="3.5"
        stroke="black"
        stroke-opacity="0.1"
      />
    </svg>
  </div>
</template>
<script>
export default {
  props: {
    isChecked: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      checked: null
    }
  },
  mounted () {
    this.checked = this.isChecked
  }
}
</script>
