<template>
  <div class=" border border-[#F14821]/50 rounded-[10px] bg-white hover:bg-[#F5C594]">
    <a
      :href="link"
      target="_blank"
    >
      <div
        class="flex items-center gap-[12px] px-[18px] py-[22px] overflow-hidden"
      >
        <svg
          class="flex-none"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.49997 7.00031C10.33 7.00031 11 7.67031 11 8.50031C11 9.33031 10.33 10.0003 9.49997 10.0003C8.66997 10.0003 7.99997 9.33031 7.99997 8.50031C7.99997 7.67031 8.66997 7.00031 9.49997 7.00031ZM14.5 14.0003C15.33 14.0003 16 14.6703 16 15.5003C16 16.3303 15.33 17.0003 14.5 17.0003C13.67 17.0003 13 16.3303 13 15.5003C13 14.6703 13.67 14.0003 14.5 14.0003ZM8.40997 17.0003L6.99997 15.5903L15.59 7.00031L17 8.41031L8.40997 17.0003ZM18.65 2.85031L19.26 6.71031L22.77 8.50031L21 12.0003L22.78 15.5003L19.24 17.2903L18.63 21.1503L14.74 20.5403L11.97 23.3103L9.18997 20.5003L5.32997 21.1403L4.70997 17.2503L1.21997 15.4703L2.99997 11.9703L1.22997 8.50031L4.73997 6.69031L5.34997 2.87031L9.21997 3.50031L12 0.695312L14.76 3.46031L18.65 2.85031ZM20.1 9.37031L17.5 8.00031L17 5.11031L14.1 5.53031L12 3.50031L9.89997 5.53031L6.99997 5.11031L6.49997 8.00031L3.89997 9.37031L5.19997 12.0003L3.89997 14.6303L6.49997 16.0003L6.99997 18.8903L9.89997 18.4703L12 20.5003L14.1 18.4703L17 18.8903L17.5 16.0003L20.1 14.6303L18.8 12.0003L20.1 9.37031Z"
            fill="#F14821"
          />
        </svg>
        <span class="font-roboto max-h-[32px] text-[#424242] text-ellipsis overflow-hidden font-medium text-[14px] leading-[16px] max-lines-2">
          {{ title }}
        </span>
      </div>
    </a>
    <div />
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    link: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
.max-lines-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2; /* number of lines to show */
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
