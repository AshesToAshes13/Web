<template>
  <Popper
    class="light overflow-hidden"
  >
    <div
      class="rounded-[6px] text-[12px] px-[8px] py-[5px] font-[500] bg-[#F4F5F7] text-[#575758] cursor-pointer"
    >
      <div
        class="flex items-center"
      >
        <img
          v-if="userPhoto"
          :src="userPhoto"
          class="mr-[4px] rounded-[6px] border-[1px] border-[#979799]"
          width="20"
          height="20"
        >
        <div
          v-else
          class="mr-[4px] flex items-center justify-center w-[20px] h-[20px]"
        >
          <svg
            width="13"
            height="14"
            viewBox="0 0 13 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.5631 7.94595C11.1349 7.56757 10.6352 7.18919 10.1356 6.96216C10.0642 6.96216 9.99287 6.88649 9.9215 6.88649C9.70737 6.88649 9.49325 7.03784 9.3505 7.26487C9.27912 7.41622 9.27912 7.64324 9.3505 7.7946C9.42187 7.94595 9.49325 8.0973 9.636 8.0973C10.0642 8.24865 10.4211 8.55135 10.778 8.85405C11.1349 9.23243 11.349 9.68649 11.349 10.2162V12.4108C11.349 12.6378 11.2062 12.7135 11.0635 12.7135H1.99887C1.78475 12.7135 1.71337 12.5622 1.71337 12.4108V10.2162C1.71337 9.68649 1.9275 9.23243 2.28437 8.85405C2.71262 8.47568 4.06875 7.49189 6.4955 7.49189C8.42262 7.49189 10.0642 5.82703 10.0642 3.78378C10.0642 1.74054 8.494 0 6.4955 0C4.56837 0 2.92675 1.66487 2.92675 3.70811C2.92675 4.76757 3.355 5.75135 4.06875 6.50811C2.64125 6.88649 1.78475 7.56757 1.42787 7.94595C0.856875 8.47568 0.5 9.30811 0.5 10.2162V12.4108C0.5 13.3189 1.21375 14 1.99887 14H10.9921C11.8486 14 12.491 13.2432 12.491 12.4108V10.2162C12.5624 9.30811 12.2055 8.47568 11.5631 7.94595ZM6.4955 6.20541C5.21075 6.20541 4.14012 5.07027 4.14012 3.70811C4.14012 2.34595 5.21075 1.21081 6.4955 1.21081C7.78025 1.21081 8.85087 2.34595 8.85087 3.70811C8.85087 5.07027 7.85162 6.20541 6.4955 6.20541Z"
              fill="#575758"
            />
          </svg>
        </div>
        <span class="truncate">
          {{ userName }}
        </span>
      </div>
    </div>
    <template
      #content="{ close }"
    >
      <div class="max-h-[156px] max-w-[300px] overflow-y-scroll scroll-style">
        <div
          v-for="(employee, index) in orgEmployees"
          :key="index"
        >
          <div
            class="flex items-center text-[#4C4C4D] font-[400] text-[13px] leading-[14px] px-[6px] py-[4px] hover:bg-[#F4F5F7] rounded-[6px] cursor-pointer"
            @click="$emit('select', employee.uid), close()"
          >
            <img
              :src="employee.fotolink"
              class="rounded-[7px] mr-[5px]"
              width="24"
              height="24"
            >
            <span class="truncate">{{ employee.name }}</span>
          </div>
        </div>
      </div>
    </template>
  </Popper>
</template>

<script>
import Popper from 'vue3-popper'

export default {
  components: {
    Popper
  },
  props: {
    uidUser: {
      type: String,
      default: ''
    }
  },
  emits: ['select'],
  computed: {
    orgEmployees () {
      return this.$store.state.navigator.navigator.emps.items
    },
    employees () {
      return this.$store.state.employees.employees
    },
    userName () {
      return this.employees[this.uidUser]?.name || 'Выберите сотрудника'
    },
    userPhoto () {
      return this.employees[this.uidUser]?.fotolink ?? ''
    }
  }
}
</script>

<style scoped>
.light {
  --popper-theme-background-color: #ffffff;
  --popper-theme-background-color-hover: #ffffff;
  --popper-theme-text-color: #444444;
  --popper-theme-border-width: 0px;
  --popper-theme-border-style: solid;
  --popper-theme-border-radius: 8px;
  --popper-theme-padding: 10px 10px;
  --popper-theme-box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.1), 0px 3px 5px rgba(0, 0, 0, 0.12);
  margin: 0 !important;
  border: 0 !important;
}
</style>
