<template>
  <div class="px-[20px] pt-[25px]">
    <AsideMenuSkeleton v-if="status === 'loading'" />
    <template
      v-if="status === 'success'"
    >
      <TasksSubmenuCalendar
        class="mb-[15px]"
        @dayclick="onDayClick"
      />
      <div
        class="flex flex-col gap-[25px]"
      >
        <AsideMenuListGroup
          class="flex flex-col gap-[6px]"
        >
          <router-link
            v-slot="{ isActive }"
            to="/tasks/today"
          >
            <SubmenuListItem
              :selected="isActive"
              title="Сегодня"
              @click="closeMenu"
            >
              <svg
                width="30"
                height="30"
                viewBox="0 0 30 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M9.48049 8.58752C7.89055 8.58752 6.60164 9.86506 6.60164 11.441V20.559C6.60164 22.1349 7.89055 23.4125 9.48049 23.4125H20.5195C22.1095 23.4125 23.3984 22.1349 23.3984 20.559V11.441C23.3984 9.86506 22.1095 8.58752 20.5195 8.58752H9.48049ZM5 11.441C5 8.98829 7.00599 7 9.48049 7H20.5195C22.994 7 25 8.98829 25 11.441V20.559C25 23.0117 22.994 25 20.5195 25H9.48049C7.00599 25 5 23.0117 5 20.559V11.441Z"
                  fill="currentColor"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M11.3203 5C11.7626 5 12.1212 5.3601 12.1212 5.80431V9.5C12.1212 9.94421 11.7626 10.3043 11.3203 10.3043C10.878 10.3043 10.5195 9.94421 10.5195 9.5V5.80431C10.5195 5.3601 10.878 5 11.3203 5ZM18.6797 5C19.122 5 19.4805 5.3601 19.4805 5.80431V9.5C19.4805 9.94421 19.122 10.3043 18.6797 10.3043C18.2374 10.3043 17.8788 9.94421 17.8788 9.5V5.80431C17.8788 5.3601 18.2374 5 18.6797 5ZM5 13.1957C5 12.7515 5.35854 12.3914 5.80082 12.3914H24.1992C24.6415 12.3914 25 12.7515 25 13.1957C25 13.6399 24.6415 14 24.1992 14H5.80082C5.35854 14 5 13.6399 5 13.1957Z"
                  fill="currentColor"
                />
              </svg>
            </SubmenuListItem>
          </router-link>
          <router-link
            v-slot="{ isActive }"
            to="/tasks/overdue"
          >
            <SubmenuListItem
              v-if="showOverdue"
              :selected="isActive"
              title="Просроченные"
              @click="closeMenu"
            >
              <svg
                width="30"
                height="30"
                viewBox="0 0 30 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M18.283 22.2558L18.3026 22.2846C18.6498 22.7855 19.1424 23.178 19.7195 23.4009C19.7331 23.4061 19.7467 23.4113 19.7604 23.4163C20.0915 23.5387 20.4495 23.6056 20.8231 23.6056C22.5154 23.6056 23.8873 22.2337 23.8873 20.5413C23.8873 20.1175 23.8013 19.7138 23.6458 19.3468C23.6224 19.2917 23.5975 19.2374 23.5711 19.1841C23.3132 18.663 22.9115 18.2258 22.4179 17.9243C22.3893 17.9068 22.3603 17.8898 22.3311 17.8732C21.8859 17.621 21.3713 17.4771 20.8231 17.4771C19.1307 17.4771 17.7588 18.849 17.7588 20.5413C17.7588 21.1765 17.9521 21.7665 18.283 22.2558ZM22.9036 16.4417C22.2789 16.124 21.5719 15.9449 20.8231 15.9449C18.2846 15.9449 16.2267 18.0028 16.2267 20.5413C16.2267 21.3666 16.4441 22.141 16.8249 22.8104C16.0862 23.0166 15.3075 23.1268 14.503 23.1268C9.7433 23.1268 5.88478 19.2683 5.88478 14.5086C5.88478 9.74885 9.7433 5.89033 14.503 5.89033C19.2628 5.89033 23.1213 9.74885 23.1213 14.5086C23.1213 15.1732 23.046 15.8203 22.9036 16.4417ZM24.3696 17.6172C24.6784 16.636 24.8449 15.5918 24.8449 14.5086C24.8449 8.79691 20.2147 4.16669 14.503 4.16669C8.79136 4.16669 4.16113 8.79691 4.16113 14.5086C4.16113 20.2202 8.79136 24.8505 14.503 24.8505C15.7554 24.8505 16.9559 24.6278 18.0669 24.22C18.8348 24.7963 19.7891 25.1377 20.8231 25.1377C23.3616 25.1377 25.4195 23.0799 25.4195 20.5413C25.4195 19.4306 25.0254 18.4118 24.3696 17.6172ZM15.2683 10.4868C14.8048 10.4868 14.4316 10.8638 14.4316 11.3234V15.2326H12.7542C12.2907 15.2326 11.9175 15.6097 11.9175 16.0692C11.9175 16.5287 12.2907 16.9058 12.7542 16.9058H15.2683C15.7319 16.9058 16.1051 16.5287 16.1051 16.0692V11.3234C16.1051 10.8638 15.7319 10.4868 15.2683 10.4868ZM20.8949 21.3987C21.2391 21.3987 21.5161 21.1195 21.5161 20.7726V18.8693C21.5161 18.5224 21.2391 18.2432 20.8949 18.2432C20.5507 18.2432 20.2737 18.5224 20.2737 18.8693V20.781C20.2737 21.1195 20.5507 21.3987 20.8949 21.3987ZM20.8949 21.7879C20.5423 21.7879 20.2485 22.0841 20.2485 22.4394C20.2485 22.7948 20.5423 23.0909 20.8949 23.0909C21.2475 23.0909 21.5413 22.7948 21.5413 22.4394C21.5413 22.0841 21.2475 21.7879 20.8949 21.7879Z"
                  fill="currentColor"
                />
              </svg>
            </SubmenuListItem>
          </router-link>
          <router-link
            v-slot="{ isActive }"
            to="/tasks/unsorted"
          >
            <SubmenuListItem
              :selected="isActive"
              title="Неразобранные"
              @click="closeMenu"
            >
              <svg
                width="30"
                height="30"
                viewBox="0 0 30 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M24 12.9572C24 12.433 23.5751 12.0081 23.0509 12.0081H6.94906C6.42491 12.0081 6 12.433 6 12.9572C6 13.4813 6.42491 13.9063 6.94906 13.9063H23.0509C23.5751 13.9063 24 13.4813 24 12.9572Z"
                  fill="currentColor"
                />
                <path
                  d="M19.3901 7.94906C19.3901 7.42491 18.9652 7 18.4411 7H6.94906C6.42491 7 6 7.42491 6 7.94906C6 8.47321 6.42491 8.89812 6.94906 8.89812H18.4411C18.9652 8.89812 19.3901 8.47321 19.3901 7.94906Z"
                  fill="currentColor"
                />
                <path
                  d="M21.1679 18.0041C21.1679 17.4799 20.743 17.055 20.2188 17.055H6.94906C6.42491 17.055 6 17.4799 6 18.0041C6 18.5282 6.42491 18.9531 6.94906 18.9531H20.2188C20.743 18.9531 21.1679 18.5282 21.1679 18.0041Z"
                  fill="currentColor"
                />
                <path
                  d="M14.2222 23.0509C14.2222 22.5268 13.7973 22.1019 13.2732 22.1019H6.94906C6.42491 22.1019 6 22.5268 6 23.0509C6 23.5751 6.42491 24 6.94906 24H13.2732C13.7973 24 14.2222 23.5751 14.2222 23.0509Z"
                  fill="currentColor"
                />
              </svg>
            </SubmenuListItem>
          </router-link>
          <router-link
            v-slot="{ isActive }"
            to="/tasks/unread"
          >
            <SubmenuListItem
              :selected="isActive"
              title="Непрочитанные"
              @click="closeMenu"
            >
              <svg
                width="30"
                height="30"
                viewBox="0 0 30 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.6793 6.92942C22.505 6.75512 22.2726 6.66797 22.0111 6.66797C21.7497 6.66797 21.5173 6.75512 21.343 6.92942L18.7575 9.51488C17.4503 8.93388 16.0849 8.64338 14.7196 8.64338C12.628 8.64338 10.5363 9.31153 8.50284 10.6478C5.91738 12.3327 4.37772 14.4534 4.34867 14.4824C4.08722 14.8311 4.11627 15.2959 4.37772 15.6154C5.74308 17.3003 7.19558 18.6366 8.67714 19.5953L6.49838 21.8031C6.14978 22.1517 6.14978 22.7617 6.49838 23.1394C6.67268 23.3137 6.90508 23.4008 7.16653 23.4008C7.42798 23.4008 7.66039 23.3137 7.83469 23.1394L22.6793 8.26573C23.0279 7.91712 23.0279 7.30707 22.6793 6.92942ZM6.32408 15.0344C6.90508 14.3662 8.03804 13.2042 9.51959 12.2456C11.2626 11.1126 13.0056 10.5316 14.7196 10.5316C15.5911 10.5316 16.4916 10.6769 17.3341 10.9964L16.4626 11.8679C15.8816 11.5484 15.2425 11.345 14.5743 11.345C13.5866 11.345 12.657 11.7227 11.9598 12.4199C11.2626 13.1171 10.8849 14.0467 10.8849 15.0344C10.8849 15.7026 11.0592 16.3417 11.4079 16.9227L10.0715 18.259C8.79334 17.5037 7.54418 16.4288 6.32408 15.0344ZM13.2961 13.7271C13.6447 13.3785 14.1095 13.1752 14.6034 13.1752C14.7486 13.1752 14.9229 13.2042 15.0682 13.2333L12.8313 15.4702C12.8023 15.3249 12.7732 15.1797 12.7732 15.0054C12.7442 14.5406 12.9475 14.0757 13.2961 13.7271Z"
                  fill="currentColor"
                />
                <path
                  d="M24.8 14.4534C23.7542 13.1752 22.6793 12.1003 21.5754 11.2288C21.4011 11.1126 21.1977 11.0255 20.9944 11.0255C20.7039 11.0255 20.4424 11.1417 20.2391 11.3741C19.9195 11.7808 20.0067 12.3618 20.4134 12.6813C21.2268 13.3204 22.0402 14.1048 22.8536 15.0344C22.2726 15.7026 21.372 16.6031 20.2391 17.4456C18.3218 18.84 16.3754 19.5372 14.4872 19.5372C13.9352 19.5372 13.4123 19.4791 12.8604 19.3629C12.8023 19.3629 12.7442 19.3338 12.657 19.3338C12.2213 19.3338 11.8436 19.6534 11.7565 20.0891C11.6984 20.3215 11.7565 20.583 11.8727 20.7863C12.0179 20.9897 12.2213 21.1349 12.4537 21.193C13.0928 21.3383 13.7609 21.3964 14.4581 21.3964C15.4749 21.3964 16.4916 21.2511 17.4793 20.9316C18.7866 20.5249 20.0938 19.8567 21.372 18.9271C23.3475 17.4746 24.5966 15.9059 24.829 15.5864C25.0614 15.2378 25.0614 14.773 24.8 14.4534Z"
                  fill="currentColor"
                />
              </svg>
            </SubmenuListItem>
          </router-link>
          <router-link
            v-slot="{ isActive }"
            to="/tasks/in-work"
          >
            <SubmenuListItem
              :selected="isActive"
              title="В работе"
              @click="closeMenu"
            >
              <svg
                width="30"
                height="30"
                viewBox="0 0 30 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M8.91045 22.0749L21.0896 15L8.91045 7.92508L8.91045 22.0749ZM22.0448 16.6647C23.3184 15.9248 23.3184 14.0752 22.0448 13.3353L9.86567 6.2604C8.59204 5.52053 7 6.44536 7 7.92508L7 22.0749C7 23.5546 8.59204 24.4795 9.86567 23.7396L22.0448 16.6647Z"
                  fill="currentColor"
                />
              </svg>
            </SubmenuListItem>
          </router-link>
          <router-link
            v-slot="{ isActive }"
            to="/tasks/in-focus"
          >
            <SubmenuListItem
              :selected="isActive"
              title="Задачи в фокусе"
              @click="closeMenu"
            >
              <svg
                width="30"
                height="30"
                viewBox="0 0 30 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21.0096 5.83203H8.99077C8.62927 5.83203 8.3335 6.14742 8.3335 6.53289V23.4645C8.3335 23.7565 8.50877 24.0194 8.7662 24.1245C8.83741 24.1537 8.91409 24.1654 8.99077 24.1654C9.18248 24.1654 9.36871 24.0719 9.49469 23.9142L15.0002 18.9758L20.5056 23.9142C20.6316 24.0719 20.8124 24.1654 21.0096 24.1654C21.0862 24.1654 21.1629 24.1537 21.2341 24.1245C21.4916 24.0252 21.6668 23.7565 21.6668 23.4645V6.53289C21.6668 6.14742 21.3711 5.83203 21.0096 5.83203ZM14.4962 17.3945L9.79183 21.7272V7.38151L20.2085 7.37145V21.7171L15.5041 17.3945C15.3781 17.2368 15.1973 17.1433 15.0002 17.1433C14.803 17.1433 14.6222 17.2368 14.4962 17.3945Z"
                  fill="currentColor"
                />
              </svg>
            </SubmenuListItem>
          </router-link>
          <router-link
            v-slot="{ isActive }"
            to="/tasks/ready"
          >
            <SubmenuListItem
              :selected="isActive"
              title="Готово к сдаче"
              @click="closeMenu"
            >
              <svg
                width="30"
                height="30"
                viewBox="0 0 30 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M15 5.46667C13.7481 5.46667 12.5084 5.71325 11.3518 6.19235C10.1951 6.67144 9.14417 7.37366 8.25891 8.25891C7.37366 9.14417 6.67144 10.1951 6.19235 11.3518C5.71325 12.5084 5.46667 13.7481 5.46667 15C5.46667 16.2519 5.71325 17.4916 6.19235 18.6482C6.67144 19.8049 7.37366 20.8558 8.25891 21.7411C9.14417 22.6263 10.1951 23.3286 11.3518 23.8077C12.5084 24.2867 13.7481 24.5333 15 24.5333C17.5284 24.5333 19.9532 23.5289 21.7411 21.7411C23.5289 19.9532 24.5333 17.5284 24.5333 15C24.5333 12.4716 23.5289 10.0468 21.7411 8.25892C19.9532 6.47107 17.5284 5.46667 15 5.46667ZM10.7905 4.83733C12.1251 4.28452 13.5555 4 15 4C17.9174 4 20.7153 5.15893 22.7782 7.22183C24.8411 9.28473 26 12.0826 26 15C26 17.9174 24.8411 20.7153 22.7782 22.7782C20.7153 24.8411 17.9174 26 15 26C13.5555 26 12.1251 25.7155 10.7905 25.1627C9.4559 24.6099 8.24327 23.7996 7.22183 22.7782C6.20038 21.7567 5.39013 20.5441 4.83733 19.2095C4.28452 17.8749 4 16.4445 4 15C4 13.5555 4.28452 12.1251 4.83733 10.7905C5.39013 9.4559 6.20038 8.24327 7.22183 7.22183C8.24327 6.20038 9.4559 5.39013 10.7905 4.83733ZM20.706 11.7914L14.3719 19.709L9.3972 15.5634L10.3361 14.4366L14.1614 17.6244L19.5607 10.8752L20.706 11.7914Z"
                  fill="currentColor"
                />
              </svg>
            </SubmenuListItem>
          </router-link>
        </AsideMenuListGroup>

        <AsideMenuListGroup
          v-if="delegate[0].items.length"
          title="Поручено мной"
          class="flex flex-col gap-[6px]"
        >
          <router-link
            v-for="userDelegate in delegate[0].items"
            :key="userDelegate.uid"
            v-slot="{ isActive }"
            :to="'/tasks/delegate-by-me/' + userDelegate.uid"
          >
            <SubmenuListItem
              :selected="isActive"
              :title="getDelegateName(userDelegate.uid)"
              @click="closeMenu"
            >
              <img
                :src="userDelegate.fotolink"
                :alt="getDelegateName(userDelegate.uid)"
                height="25"
                width="25"
                class="rounded-[6px] border-2 border-[#31a81e] mr-[5px]"
              >
            </SubmenuListItem>
          </router-link>
        </AsideMenuListGroup>

        <AsideMenuListGroup
          v-if="delegate[1].items.length"
          title="Поручено мне"
          class="flex flex-col gap-[6px]"
        >
          <router-link
            v-for="userDelegate in delegate[1].items"
            :key="userDelegate.uid"
            v-slot="{ isActive }"
            :to="'/tasks/delegate-to-me/' + userDelegate.uid"
          >
            <SubmenuListItem
              :selected="isActive"
              :title="getDelegateName(userDelegate.uid)"
              @click="closeMenu"
            >
              <img
                :src="userDelegate.fotolink"
                :alt="getDelegateName(userDelegate.uid)"
                height="25"
                width="25"
                class="rounded-[6px] border-2 border-[#f46868] mr-[5px]"
              >
            </SubmenuListItem>
          </router-link>
        </AsideMenuListGroup>
      </div>
    </template>
  </div>
</template>

<script>
import AsideMenuSkeleton from '@/components/AsideMenu/AsideMenuSkeleton.vue'
import SubmenuListItem from '@/components/AsideMenu/SubmenuListItem.vue'
import AsideMenuListGroup from '@/components/AsideMenu/AsideMenuListGroup.vue'
import TasksSubmenuCalendar from '@/components/AsideMenu/TasksSubmenuCalendar.vue'

export default {
  components: {
    AsideMenuSkeleton,
    TasksSubmenuCalendar,
    SubmenuListItem,
    AsideMenuListGroup
  },
  computed: {
    status () {
      return this.$store.state.navigator.status
    },
    isAsideMobileExpanded () {
      return this.$store.state.isAsideMobileExpanded
    },
    showOverdue () {
      return this.$store.state.navigator?.navigator?.settings.nav_show_overdue
    },
    isPropertiesMobileExpanded () {
      return this.$store.state.isPropertiesMobileExpanded
    },
    delegate () {
      return this.$store.getters.sortedNavigator.new_delegate
    }
  },
  methods: {
    onDayClick (date) {
      const today = new Date()
      const convertToday = `${today.getFullYear()}-${('0' + (today.getMonth() + 1)).slice(-2)}-${('0' + (today.getDate())).slice(-2)}`
      if (date === convertToday) {
        this.$router.push('/tasks/today')
      } else {
        this.$router.push('/tasks/' + date)
      }
      this.closeMenu()
    },
    closeMenu () {
      this.$store.state.navigator.submenu.status = false
      if (this.isPropertiesMobileExpanded) {
        this.$store.dispatch('asidePropertiesToggle', false)
      }
      if (this.isAsideMobileExpanded) {
        this.$store.dispatch('asideMobileToggle', false)
      }
    },
    getDelegateName (uid) {
      return this.$store.state.employees.employees[uid]?.name || '???'
    }
  }
}
</script>
