<template>
  <NavbarSearchLimit
    v-if="showFreeModal"
    @cancel="showFreeModal = false"
  />
  <div
    v-if="!showSearchBar"
    class="flex-none flex gap-[5px] p-[8px] cursor-pointer text-[#7e7e80] hover:text-[#7e7e80]/75"
    :class="getInputWidthFull"
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
    v-if="showSearchBar"
    class="flex-none flex gap-[5px] items-center h-[40px] overflow-hidden px-[8px] text-[#7e7e80] bg-white rounded-[10px]"
    :class="getInputLoadingWidth"
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
    <input
      ref="searchInput"
      v-model="searchText"
      maxlength="100"
      type="text"
      class="w-full font-roboto text-[14px] leading-[16px] border-0 focus:ring-0 p-0"
      @keyup.enter="sendSearchRequest"
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
        data-v-1ded894d=""
      >
        <path
          d="M14.8486 2.84858C15.3172 2.37995 15.3172 1.62015 14.8486 1.15152C14.3799 0.682892 13.6202 0.682892 13.1515 1.15152L8.00005 6.30299L2.84858 1.15152C2.37995 0.682892 1.62015 0.682892 1.15152 1.15152C0.682891 1.62015 0.682891 2.37995 1.15152 2.84858L6.30299 8.00005L1.15152 13.1515C0.682891 13.6202 0.682891 14.3799 1.15152 14.8486C1.62015 15.3172 2.37995 15.3172 2.84858 14.8486L8.00005 9.69711L13.1515 14.8486C13.6202 15.3172 14.3799 15.3172 14.8486 14.8486C15.3172 14.3799 15.3172 13.6202 14.8486 13.1515L9.69711 8.00005L14.8486 2.84858Z"
          fill="black"
          fill-opacity="0.5"
          data-v-1ded894d=""
        />
      </svg>
    </div>
  </div>
</template>

<script>
import NavbarSearchLimit from '@/components/Navbar/NavbarSearchLimit.vue'

export default {
  components: {
    NavbarSearchLimit
  },
  props: {
    isFull: {
      type: Boolean,
      default: false
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['search', 'change', 'eraseSearch'],
  data: () => ({
    showSearchBar: false,
    showFreeModal: false,
    searchText: ''
  }),
  computed: {
    getInputWidthFull () {
      if (this.isLoading && this.isFull) {
        return 'w-[calc(100%_-_30px)]'
      }
      return this.isFull ? 'w-full' : ''
    },

    selectedBoardUid () {
      return this.$store.state.boards.selectedBoard.uid
    },
    getInputLoadingWidth () {
      if (this.isLoading && this.isFull) {
        return 'w-[calc(100%_-_30px)]'
      }
      return this.isFull ? 'w-full' : 'w-[160px]'
    },

    getSearchValue () {
      return this.$route.query.search || ''
    }
  },
  watch: {
    searchText () {
      this.$emit('change', this.searchText)
    },

    getSearchValue (searchValue) {
      if (!searchValue) {
        this.searchText = ''
      }
    },
    selectedBoardUid () {
      this.closeSearch()
    }
  },
  methods: {
    sendSearchRequest () {
      if (!this.searchText || this.searchText === this.$route.query.search) {
        this.showSearchBar = false
        return
      }
      this.$emit('search', this.searchText)
      this.showSearchBar = false
    },
    onBlurSearchInput () {
      if (!this.searchText) {
        this.showSearchBar = false
      }
    },
    onShowSearchBar () {
      if (this.$store.state.user.user.tarif === 'free' || this.$store.getters.isLicenseExpired) {
        this.showFreeModal = true
        return
      }
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
      this.$emit('eraseSearch')
    },
    closeSearch () {
      this.searchText = ''
      this.showSearchBar = false
    }
  }
}
</script>

<style>

</style>
