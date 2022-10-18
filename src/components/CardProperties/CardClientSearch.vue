<template>
  <div class="w-full pl-[15px]">
    <div
      v-if="!showSearchBar"
      class="w-full flex gap-[5px] h-[40px] px-[8px] items-center cursor-pointer border-[1px] border-transparent text-[#7e7e80] hover:text-[#7e7e80]/75 bg-[#F4F5F7] rounded-[8px] hover:bg-[#F4F5F7]/70"
      @click="onShowSearchBar"
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
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M11.2578 4.73848C9.52876 4.73848 7.87055 5.42533 6.64794 6.64794C5.42533 7.87055 4.73848 9.52876 4.73848 11.2578C4.73848 12.9868 5.42533 14.645 6.64794 15.8676C7.87055 17.0902 9.52876 17.7771 11.2578 17.7771C12.9868 17.7771 14.645 17.0902 15.8676 15.8676C17.0902 14.645 17.7771 12.9868 17.7771 11.2578C17.7771 9.52876 17.0902 7.87055 15.8676 6.64794C14.645 5.42533 12.9868 4.73848 11.2578 4.73848ZM5.41865 5.41865C6.96728 3.87001 9.06768 3 11.2578 3C13.4479 3 15.5483 3.87001 17.0969 5.41865C18.6456 6.96728 19.5156 9.06768 19.5156 11.2578C19.5156 13.1548 18.8628 14.9845 17.6818 16.4466L21 19.7707L19.7696 20.9989L16.4531 17.6765C14.9899 18.8609 13.1576 19.5156 11.2578 19.5156C9.06768 19.5156 6.96728 18.6456 5.41865 17.0969C3.87001 15.5483 3 13.4479 3 11.2578C3 9.06768 3.87001 6.96728 5.41865 5.41865Z"
          fill="currentColor"
        />
      </svg>
      <p class="font-roboto text-[14px]">
        Поиск
      </p>
    </div>
    <div
      v-else
      class="w-full flex gap-[5px] items-center h-[40px] overflow-hidden px-[8px] text-[#4c4c4d] bg-white border-[1px] border-[#7E7E80] rounded-[10px]"
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
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M11.2578 4.73848C9.52876 4.73848 7.87055 5.42533 6.64794 6.64794C5.42533 7.87055 4.73848 9.52876 4.73848 11.2578C4.73848 12.9868 5.42533 14.645 6.64794 15.8676C7.87055 17.0902 9.52876 17.7771 11.2578 17.7771C12.9868 17.7771 14.645 17.0902 15.8676 15.8676C17.0902 14.645 17.7771 12.9868 17.7771 11.2578C17.7771 9.52876 17.0902 7.87055 15.8676 6.64794C14.645 5.42533 12.9868 4.73848 11.2578 4.73848ZM5.41865 5.41865C6.96728 3.87001 9.06768 3 11.2578 3C13.4479 3 15.5483 3.87001 17.0969 5.41865C18.6456 6.96728 19.5156 9.06768 19.5156 11.2578C19.5156 13.1548 18.8628 14.9845 17.6818 16.4466L21 19.7707L19.7696 20.9989L16.4531 17.6765C14.9899 18.8609 13.1576 19.5156 11.2578 19.5156C9.06768 19.5156 6.96728 18.6456 5.41865 17.0969C3.87001 15.5483 3 13.4479 3 11.2578C3 9.06768 3.87001 6.96728 5.41865 5.41865Z"
          fill="#7E7E80"
        />
      </svg>
      <input
        ref="searchInput"
        v-model="searchText"
        maxlength="100"
        type="text"
        class="w-full font-roboto text-[14px] leading-[16px] border-0 focus:ring-0 p-0"
        @keyup.enter="sendSearchRequest"
        @keydown.esc.stop
        @keyup.esc="closeSearch"
        @blur="onBlurSearchInput"
      >
      <div
        v-if="searchText"
        class="flex-none cursor-pointer w-[24px] h-[24px] flex items-center justify-center"
        @click="eraseSearch"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14.8486 2.84858C15.3172 2.37995 15.3172 1.62015 14.8486 1.15152C14.3799 0.682892 13.6202 0.682892 13.1515 1.15152L8.00005 6.30299L2.84858 1.15152C2.37995 0.682892 1.62015 0.682892 1.15152 1.15152C0.682891 1.62015 0.682891 2.37995 1.15152 2.84858L6.30299 8.00005L1.15152 13.1515C0.682891 13.6202 0.682891 14.3799 1.15152 14.8486C1.62015 15.3172 2.37995 15.3172 2.84858 14.8486L8.00005 9.69711L13.1515 14.8486C13.6202 15.3172 14.3799 15.3172 14.8486 14.8486C15.3172 14.3799 15.3172 13.6202 14.8486 13.1515L9.69711 8.00005L14.8486 2.84858Z"
            fill="black"
            fill-opacity="0.5"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  emits: ['search', 'eraseSearch'],
  data: () => ({
    showSearchBar: false,
    searchText: ''
  }),
  methods: {
    sendSearchRequest () {
      if (!this.searchText) {
        this.closeSearch()
        return
      }
      this.$emit('search', this.searchText)
    },
    onBlurSearchInput () {
      if (!this.searchText) {
        this.closeSearch()
      }
    },
    onShowSearchBar () {
      this.showSearchBar = true
      this.$nextTick(function () {
        this.$refs.searchInput.focus({ preventScroll: false })
      })
    },
    eraseSearch () {
      this.searchText = ''
      this.$nextTick(function () {
        this.$refs.searchInput.focus({ preventScroll: false })
      })
    },
    closeSearch () {
      this.searchText = ''
      this.showSearchBar = false
      this.$emit('eraseSearch')
    }
  }
}
</script>

<style>

</style>
