<template>
  <label class="policy flex items-center text-[13px] mb-[8px]">
    <input
      :checked="checked"
      type="checkbox"
      @change="toggleChecked"
    >
    <span>
      <svg
        class="check"
        width="13"
        height="10"
        viewBox="0 0 13 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5.02948 9.16732C4.80196 9.16732 4.57446 9.06709 4.34694 8.96685L0.592936 6.46099C0.137906 6.16029 0.0241517 5.45865 0.365425 5.05771C0.706698 4.65677 1.50299 4.55653 1.95802 4.85723L4.91573 6.76169L10.7174 1.14856C11.1724 0.747625 11.8549 0.747627 12.31 1.04833C12.765 1.44927 12.765 2.05068 12.4237 2.45161L5.93954 8.66615C5.71203 9.06709 5.37075 9.16732 5.02948 9.16732Z"
          fill="white"
        />
      </svg>
    </span>
    <p class="leading-[17px]">
      Продолжая я принимаю
      <a
        href="https://www.leadertask.ru/offer"
        target="_blank"
      >Условия использования</a> и <a
        href="https://www.leadertask.ru/privacy-policy"
        target="_blank"
      >Политику конфиденциальности</a>
    </p>
  </label>
</template>

<script>
export default {
  props: {
    checked: {
      type: Boolean,
      default: true
    }
  },
  emits: ['toggleChecked'],
  methods: {
    toggleChecked () {
      this.$emit('toggleChecked')
    }
  }
}
</script>

<style>
.policy input {
  appearance: none;
  width: 0;
  height: 0;
  opacity: 0;
}

.policy span {
  @apply shrink-0 h-[20px] w-[20px] bg-white rounded-[5px] border-[1px] border-[#CCCCCC] mr-[5px] flex items-center justify-center
}

.policy input:checked + span {
  @apply border-none bg-[#FF9123]
}

a {
  @apply text-blue-600 underline
}
</style>
