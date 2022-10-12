<template>
  <div
    class="flex bg-[#facc15] px-[8px] items-center rounded-[4px] gap-x-[5px]"
  >
    <svg
      viewBox="0 0 28 24"
      width="13"
      height="12"
      class="inline-block"
    ><path
      fill="currentColor"
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M24.9079 5.1188V3.64806C24.9079 2.2838 23.7893 1.17243 22.4162 1.17243H12.148L11.8398 0.666655C11.6523 0.373838 11.3241 0.1875 10.9758 0.1875H3.3667C1.99359 0.1875 0.875 1.29887 0.875 2.66313V21.3369C0.875 22.7011 1.99359 23.8125 3.3667 23.8125H24.6333C26.0064 23.8125 27.125 22.7011 27.125 21.3369V7.58113C27.1317 6.30338 26.1537 5.2519 24.9079 5.1188ZM2.89783 2.66313C2.89783 2.40359 3.11217 2.19063 3.3734 2.19063H10.4131L13.146 6.62282C13.3268 6.91563 13.655 7.10197 14.01 7.10197H24.6467C24.9079 7.10197 25.1222 7.31493 25.1222 7.57447V21.3369C25.1222 21.5964 24.9079 21.8094 24.6467 21.8094H3.3667C3.10548 21.8094 2.89114 21.5964 2.89114 21.3369V2.66313H2.89783ZM22.8851 5.09884H14.566L13.3804 3.17556H22.4095C22.6707 3.17556 22.8851 3.38852 22.8851 3.64806V5.09884Z"
    /></svg>
    <span class="text-[#4C4C4D] overflow-hidden truncate text-[12px] font-medium">{{
      projects[task.uid_project]?.name.length > 99
        ? projects[task.uid_project]?.name.split('').slice(0,100).join('') + '...'
        : projects[task.uid_project]?.name
    }}</span>
  </div>
</template>
<script>
export default {
  props: {
    task: {
      type: Object,
      default: () => {}
    },
    projects: {
      type: Object,
      default: () => {}
    }
  }
}
</script>
