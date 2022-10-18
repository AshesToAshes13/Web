<template>
  <BoardModalBoxRename
    v-if="showAddDep"
    :show="showAddDep"
    title="Добавить отдел"
    @cancel="showAddDep = false"
    @save="onAddNewDep"
  />
  <EmployeesModalBoxMove
    v-if="showMoveDep"
    :show="showMoveDep"
    :position="currentDepPosition"
    :names="depNames"
    :count-all="depNames.length"
    @cancel="showMoveDep = false"
    @changePosition="onChangeDepPosition"
  />
  <EmployeesModalBoxAdd
    v-if="showAddEmployee"
    :show="showAddEmployee"
    @cancel="showAddEmployee = false"
    @save="onAddNewEmp"
  />
  <BoardModalBoxDelete
    v-if="showDeleteDep"
    title="Удалить отдел"
    text="Вы действительно хотите удалить отдел?"
    @cancel="showDeleteDep = false"
    @yes="onDeleteDep"
  />
  <BoardModalBoxRename
    v-if="showRenameDep"
    :show="showRenameDep"
    title="Название отдела"
    :value="currentDepName"
    @cancel="showRenameDep = false"
    @save="onRenameDep"
  />
  <EmployeesModalBoxUsersLimit
    v-if="showUsersLimit"
    @cancel="showUsersLimit = false"
    @ok="showUsersLimit = false"
  />
  <EmployeesModalBoxOtherOrg
    v-if="showOtherOrg"
    @cancel="showOtherOrg = false"
    @ok="showOtherOrg = false"
  />
  <EmployeesModalBoxAlreadyExist
    v-if="alreadyExist"
    @cancel="alreadyExist = false"
  />
  <div
    v-if="!displayModal"
    class="w-full pb-6"
  >
    <div class="flex items-center justify-between w-full">
      <NavBar
        class="w-full pt-[8px]"
        title="Сотрудники"
      />
      <div class="flex flex-none px-[12px] pt-[8px]">
        <Icon
          :path="listView.path"
          :width="listView.width"
          :height="listView.height"
          :box="listView.viewBox"
          class="cursor-pointer hover:text-gray-800 mr-2"
          :class="{
            'text-gray-800': !isGridView,
            'text-gray-400': isGridView
          }"
          @click="updateGridView(false)"
        />
        <Icon
          :path="gridView.path"
          :width="gridView.width"
          :height="gridView.height"
          :box="gridView.viewBox"
          class="cursor-pointer hover:text-gray-800 mr-2"
          :class="{
            'text-gray-800': isGridView,
            'text-gray-400': !isGridView
          }"
          @click="updateGridView(true)"
        />
      </div>
    </div>
    <div
      v-for="(value, index) in items"
      :key="index"
    >
      <div
        class="group flex items-center w-full"
        :class="{ 'mt-[28px]': index !== 0 }"
      >
        <p
          v-if="index !== 0"
          class="font-roboto text-[#424242] text-[19px] leading-[22px] font-bold truncate"
        >
          {{ value.dep }}
        </p>
        <div
          v-if="index !== 0 && isCanChangeDepartments"
          :ref="`dep-icon-${value.uid}`"
          class="flex-none ml-[5px] h-[18px] w-[18px] cursor-pointer invisible group-hover:visible"
        >
          <PopMenu
            @openMenu="lockVisibility(value.uid)"
            @closeMenu="unlockVisibility(value.uid)"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M9.35524 16.6055C8.37421 16.6055 7.57892 15.8102 7.57892 14.8291C7.57892 13.8481 8.37421 13.0528 9.35524 13.0528C10.3363 13.0528 11.1316 13.8481 11.1316 14.8291C11.1316 15.8102 10.3363 16.6055 9.35524 16.6055ZM9.35524 11.2765C8.37421 11.2765 7.57892 10.4812 7.57892 9.50016C7.57892 8.51912 8.37421 7.72383 9.35524 7.72383C10.3363 7.72383 11.1316 8.51912 11.1316 9.50016C11.1316 10.4812 10.3363 11.2765 9.35524 11.2765ZM7.57892 4.17118C7.57892 5.15222 8.37421 5.9475 9.35524 5.9475C10.3363 5.9475 11.1316 5.15222 11.1316 4.17118C11.1316 3.19015 10.3363 2.39486 9.35524 2.39486C8.37421 2.39486 7.57892 3.19015 7.57892 4.17118Z"
                fill="#424242"
              />
            </svg>
            <template #menu>
              <PopMenuItem
                icon="edit"
                @click="clickRenameDep(value.uid)"
              >
                Переименовать
              </PopMenuItem>
              <PopMenuItem
                icon="move"
                @click="clickMoveDep(value.uid)"
              >
                Переместить
              </PopMenuItem>
              <PopMenuItem
                icon="delete"
                type="delete"
                @click="clickDeleteDep(value.uid)"
              >
                Удалить
              </PopMenuItem>
            </template>
          </PopMenu>
        </div>
      </div>
      <div
        class="grid gap-2 mt-3 grid-cols-1"
        :class="{
          'md:grid-cols-2 lg:grid-cols-4': isGridView,
          'lg:grid-cols-2': isPropertiesMobileExpanded && isGridView
        }"
      >
        <template
          v-for="userValue in value.items"
          :key="userValue.uid"
        >
          <ListBlocItem
            :title="userValue.name"
            title-color="#4C4C4D"
            :sub-title="userValue.email"
            sub-title-color="#606061"
            :right-icon="empIcon(userValue)"
            :selected="selectedEmployee === userValue.email"
            :is-online="isUserOnline(userValue.uid)"
            @click.stop="showUserProperties(userValue)"
          >
            <img
              v-if="userValue.fotolink"
              :src="userValue.fotolink"
              class="rounded-[6px]"
              width="20"
              height="20"
            >
            <svg
              v-else
              width="20"
              height="20"
              viewBox="0 0 42 42"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                width="42"
                height="42"
                rx="8"
                fill="#EDEDED"
              />
              <path
                d="M15.75 14.583C15.75 17.4775 18.1055 19.833 21 19.833C23.8945 19.833 26.25 17.4775 26.25 14.583C26.25 11.6885 23.8945 9.33301 21 9.33301C18.1055 9.33301 15.75 11.6885 15.75 14.583ZM30.3333 31.4997H31.5V30.333C31.5 25.8308 27.8355 22.1663 23.3333 22.1663H18.6667C14.1633 22.1663 10.5 25.8308 10.5 30.333V31.4997H30.3333Z"
                fill="#979899"
              />
            </svg>
          </ListBlocItem>
        </template>
        <ListBlocAdd
          v-if="index === 0 && isCanChangeEmployees"
          title="Добавить сотрудника"
          @click.stop="clickAddEmployee"
        />
      </div>
    </div>
    <div
      v-if="isCanChangeDepartments && currUserWorkspaces > 1"
      class="flex items-center w-full my-[28px] text-[#7e7e80] hover:text-[#424242] cursor-pointer"
      @click.stop="clickAddDep"
    >
      <p class="font-roboto text-[17px] leading-[22px]">
        Добавить отдел
      </p>
      <svg
        class="ml-[5px]"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9.935 5.00389L10 5C10.1361 5.00002 10.2674 5.04998 10.3691 5.1404C10.4708 5.23082 10.5357 5.35542 10.5517 5.49056L10.5556 5.55556V9.44444H14.4444C14.5805 9.44446 14.7119 9.49442 14.8135 9.58484C14.9152 9.67526 14.9802 9.79986 14.9961 9.935L15 10C15 10.1361 14.95 10.2674 14.8596 10.3691C14.7692 10.4708 14.6446 10.5357 14.5094 10.5517L14.4444 10.5556H10.5556V14.4444C10.5555 14.5805 10.5056 14.7119 10.4152 14.8135C10.3247 14.9152 10.2001 14.9802 10.065 14.9961L10 15C9.86393 15 9.73259 14.95 9.6309 14.8596C9.52922 14.7692 9.46425 14.6446 9.44833 14.5094L9.44444 14.4444V10.5556H5.55556C5.41948 10.5555 5.28815 10.5056 5.18646 10.4152C5.08477 10.3247 5.01981 10.2001 5.00389 10.065L5 10C5.00002 9.86393 5.04998 9.73259 5.1404 9.6309C5.23082 9.52922 5.35542 9.46425 5.49056 9.44833L5.55556 9.44444H9.44444V5.55556C9.44446 5.41948 9.49442 5.28815 9.58484 5.18646C9.67526 5.08477 9.79986 5.01981 9.935 5.00389L10 5L9.935 5.00389Z"
          fill="currentColor"
        />
      </svg>
    </div>
  </div>
  <div
    v-if="displayModal"
    class="flex flex-col justify-center items-center mt-[100px]"
  >
    <svg
      width="161"
      height="160"
      viewBox="0 0 161 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M120.08 50.6083C130.275 67.0886 142.537 87.3785 133.981 104.775C125.474 122.07 100.813 119.744 82.7533 126.5C64.945 133.162 47.2171 152.629 30.571 143.462C13.8425 134.249 18.3884 109.157 16.7269 90.1388C15.6576 77.8951 19.5878 67.0493 22.861 55.1997C27.1876 39.536 24.1017 18.409 38.5829 11.0151C53.165 3.5696 69.2834 16.8295 84.0035 23.981C97.9815 30.7718 111.908 37.3971 120.08 50.6083Z"
        fill="#F2B679"
        fill-opacity="0.3"
      />
      <path
        d="M80.3394 45.5584C78.6746 45.5584 77.078 46.2197 75.9008 47.3969C74.7236 48.5741 74.0623 50.1707 74.0623 51.8355C74.0623 53.5003 74.7236 55.097 75.9008 56.2741C77.078 57.4513 78.6746 58.1127 80.3394 58.1127C82.0042 58.1127 83.6008 57.4513 84.778 56.2741C85.9552 55.097 86.6166 53.5003 86.6166 51.8355C86.6166 50.1707 85.9552 48.5741 84.778 47.3969C83.6008 46.2197 82.0042 45.5584 80.3394 45.5584ZM67.7851 51.8355C67.7851 48.5059 69.1078 45.3127 71.4622 42.9583C73.8166 40.6039 77.0098 39.2813 80.3394 39.2812C83.669 39.2812 86.8622 40.6039 89.2166 42.9583C91.571 45.3127 92.8937 48.5059 92.8937 51.8355C92.8937 55.1651 91.571 58.3584 89.2166 60.7128C86.8622 63.0671 83.669 64.3898 80.3394 64.3898C77.0098 64.3898 73.8166 63.0671 71.4622 60.7128C69.1078 58.3584 67.7851 55.1651 67.7851 51.8355ZM110.156 48.697C108.907 48.697 107.71 49.193 106.827 50.0759C105.944 50.9588 105.448 52.1562 105.448 53.4048C105.448 54.6534 105.944 55.8509 106.827 56.7338C107.71 57.6167 108.907 58.1127 110.156 58.1127C111.404 58.1127 112.602 57.6167 113.485 56.7338C114.368 55.8509 114.864 54.6534 114.864 53.4048C114.864 52.1562 114.368 50.9588 113.485 50.0759C112.602 49.193 111.404 48.697 110.156 48.697ZM99.1708 53.4048C99.1708 51.9622 99.455 50.5338 100.007 49.201C100.559 47.8683 101.368 46.6573 102.388 45.6373C103.408 44.6172 104.619 43.8081 105.952 43.256C107.285 42.704 108.713 42.4198 110.156 42.4198C111.598 42.4198 113.027 42.704 114.36 43.256C115.692 43.8081 116.903 44.6172 117.923 45.6373C118.943 46.6573 119.753 47.8683 120.305 49.201C120.857 50.5338 121.141 51.9622 121.141 53.4048C121.141 56.3182 119.984 59.1123 117.923 61.1724C115.863 63.2325 113.069 64.3898 110.156 64.3898C107.242 64.3898 104.448 63.2325 102.388 61.1724C100.328 59.1123 99.1708 56.3182 99.1708 53.4048ZM45.8151 53.4048C45.8151 52.1562 46.3111 50.9588 47.194 50.0759C48.0769 49.193 49.2744 48.697 50.523 48.697C51.7716 48.697 52.969 49.193 53.8519 50.0759C54.7348 50.9588 55.2308 52.1562 55.2308 53.4048C55.2308 54.6534 54.7348 55.8509 53.8519 56.7338C52.969 57.6167 51.7716 58.1127 50.523 58.1127C49.2744 58.1127 48.0769 57.6167 47.194 56.7338C46.3111 55.8509 45.8151 54.6534 45.8151 53.4048ZM50.523 42.4198C47.6096 42.4198 44.8155 43.5772 42.7554 45.6373C40.6953 47.6973 39.538 50.4914 39.538 53.4048C39.538 56.3182 40.6953 59.1123 42.7554 61.1724C44.8155 63.2325 47.6096 64.3898 50.523 64.3898C53.4364 64.3898 56.2305 63.2325 58.2906 61.1724C60.3506 59.1123 61.508 56.3182 61.508 53.4048C61.508 50.4914 60.3506 47.6973 58.2906 45.6373C56.2305 43.5772 53.4364 42.4198 50.523 42.4198ZM57.2741 106.776C55.8546 107.712 54.2082 108.246 52.5098 108.321C50.8114 108.396 49.1242 108.011 47.6274 107.204C46.1306 106.398 44.88 105.202 44.0083 103.742C43.1367 102.283 42.6765 100.614 42.6766 98.9141V78.5134C42.6766 78.0972 42.8419 77.698 43.1362 77.4037C43.4305 77.1094 43.8296 76.9441 44.2458 76.9441H56.8974C57.1837 74.6461 58.103 72.4729 59.5527 70.667H44.2458C42.1648 70.667 40.1691 71.4936 38.6976 72.9651C37.2261 74.4366 36.3994 76.4324 36.3994 78.5134V98.9141C36.3986 101.617 37.0957 104.274 38.4233 106.628C39.7508 108.982 41.6638 110.953 43.9769 112.35C46.29 113.748 48.9248 114.524 51.6261 114.605C54.3274 114.685 57.0037 114.066 59.3957 112.809C58.4154 110.904 57.7015 108.875 57.2741 106.776ZM101.283 112.809C103.675 114.066 106.351 114.685 109.053 114.605C111.754 114.524 114.389 113.748 116.702 112.35C119.015 110.953 120.928 108.982 122.256 106.628C123.583 104.274 124.28 101.617 124.279 98.9141V78.5134C124.279 76.4324 123.453 74.4366 121.981 72.9651C120.51 71.4936 118.514 70.667 116.433 70.667H101.126C102.575 72.4736 103.494 74.6465 103.781 76.9441H116.433C116.849 76.9441 117.248 77.1094 117.543 77.4037C117.837 77.698 118.002 78.0972 118.002 78.5134V98.9141C118.002 100.614 117.542 102.283 116.67 103.742C115.799 105.202 114.548 106.398 113.051 107.204C111.555 108.011 109.867 108.396 108.169 108.321C106.471 108.246 104.824 107.712 103.405 106.776C102.977 108.875 102.263 110.904 101.283 112.809ZM69.3544 70.667C67.2734 70.667 65.2776 71.4936 63.8062 72.9651C62.3347 74.4366 61.508 76.4324 61.508 78.5134V102.053C61.508 107.047 63.492 111.837 67.0236 115.369C70.5552 118.9 75.345 120.884 80.3394 120.884C85.3338 120.884 90.1237 118.9 93.6552 115.369C97.1868 111.837 99.1708 107.047 99.1708 102.053V78.5134C99.1708 76.4324 98.3442 74.4366 96.8727 72.9651C95.4012 71.4936 93.4054 70.667 91.3244 70.667H69.3544ZM67.7851 78.5134C67.7851 78.0972 67.9505 77.698 68.2448 77.4037C68.5391 77.1094 68.9382 76.9441 69.3544 76.9441H91.3244C91.7406 76.9441 92.1398 77.1094 92.4341 77.4037C92.7284 77.698 92.8937 78.0972 92.8937 78.5134V102.053C92.8937 105.382 91.571 108.576 89.2166 110.93C86.8622 113.284 83.669 114.607 80.3394 114.607C77.0098 114.607 73.8166 113.284 71.4622 110.93C69.1078 108.576 67.7851 105.382 67.7851 102.053V78.5134Z"
        fill="#424242"
      />
    </svg>
    <div class="w-[600px] font-roboto text-[#424242]">
      <p class="font-[700] p-3 text-left text-[25px] leading-[35px] text-center">
        Управляйте командой с помощью сотрудников
      </p>
      <p class="font-[400] text-[18px] text-center leading-[28px]">
        ЛидерТаск соберет всех сотрудников в одном месте и распределит их на отделы
      </p>
    </div>
    <OnBoardingButton
      @okToModal="okToModal"
    />
  </div>
</template>

<script>
import Icon from '@/components/Icon.vue'
import ListBlocItem from '@/components/Common/ListBlocItem.vue'
import ListBlocAdd from '@/components/Common/ListBlocAdd.vue'
import BoardModalBoxRename from '@/components/Board/modalboxes/BoardModalBoxRename.vue'
import BoardModalBoxDelete from '@/components/Board/modalboxes/BoardModalBoxDelete.vue'
import EmployeesModalBoxUsersLimit from '@/components/Employees/EmployeesModalBoxUsersLimit.vue'
import EmployeesModalBoxOtherOrg from '@/components/Employees/EmployeesModalBoxOtherOrg.vue'
import { setLocalStorageItem } from '@/store/helpers/functions'
import EmployeesModalBoxAdd from '@/components/Employees/EmployeesModalBoxAdd.vue'
import EmployeesModalBoxMove from '@/components/Employees/EmployeesModalBoxMove.vue'
import PopMenu from '@/components/Common/PopMenu.vue'
import PopMenuItem from '@/components/Common/PopMenuItem.vue'
import EmployeesModalBoxAlreadyExist from '@/components/Employees/EmployeesModalBoxAlreadyExist'

import NavBar from '@/components/Navbar/NavBar.vue'

import * as EMPLOYEE from '@/store/actions/employees'
import * as DEPARTMENT from '@/store/actions/departments'

import gridView from '@/icons/grid-view.js'
import listView from '@/icons/list-view.js'
import { USER_VIEWED_MODAL } from '@/store/actions/onboarding.js'
import { uuidv4 } from '@/helpers/functions'
import OnBoardingButton from './onBoarding/onBoardingButton.vue'

export default {
  components: {
    EmployeesModalBoxAlreadyExist,
    Icon,
    ListBlocItem,
    ListBlocAdd,
    BoardModalBoxRename,
    BoardModalBoxDelete,
    EmployeesModalBoxAdd,
    EmployeesModalBoxMove,
    EmployeesModalBoxUsersLimit,
    EmployeesModalBoxOtherOrg,
    PopMenu,
    NavBar,
    PopMenuItem,
    OnBoardingButton
  },
  data () {
    return {
      gridView,
      listView,
      showAddEmployee: false,
      selectedEmployee: '',
      showAddDep: false,
      showDeleteDep: false,
      currentDepUid: '',
      showRenameDep: false,
      showMoveDep: false,
      showUsersLimit: false,
      showOtherOrg: false,
      alreadyExist: false
    }
  },
  computed: {
    employees () {
      return this.$store.state.navigator.navigator.new_emps
    },
    items () {
      const items = this.employees.map(item => ({
        dep: item.dep.uid === '' ? 'Сотрудники' : item.dep.name,
        items: item.items,
        order: item.dep?.order ?? Number.MIN_SAFE_INTEGER,
        uid: item.dep.uid,
        item: item.dep.uid === '' ? null : item.dep
      }
      ))
      items.sort((item1, item2) => {
        // сначала по порядку
        if (item1.order > item2.order) return 1
        if (item1.order < item2.order) return -1
        // если одинаковый, то по имени
        if (item1.dep > item2.dep) return 1
        if (item1.dep < item2.dep) return -1
        return 0
      })
      return items
    },
    user () {
      return this.$store.state.user.user
    },
    currUserWorkspaces () {
      return this.items.reduce((sum, current) => sum + current.items.length, 0)
    },
    isGridView () {
      return this.$store.state.isGridView
    },
    isPropertiesMobileExpanded () {
      return this.$store.state.isPropertiesMobileExpanded
    },
    isCanChangeEmployees () {
      const employees = this.$store.state.employees.employees
      const user = this.$store.state.user.user
      const userType = employees[user?.current_user_uid]?.type
      return userType === 1 || userType === 2
    },
    isCanChangeDepartments () {
      const employees = this.$store.state.employees.employees
      const user = this.$store.state.user.user
      const userType = employees[user.current_user_uid]?.type
      return userType === 1 || userType === 2
    },
    allDepartments () {
      return this.items.filter(item => item.uid !== '').map(item => item.item)
    },
    currentDep () {
      const item = this.allDepartments.find(dep => dep.uid === this.currentDepUid)
      return item || null
    },
    currentDepName () {
      const dep = this.currentDep
      return dep?.name ?? ''
    },
    currentDepPosition () {
      return this.allDepartments.findIndex(dep => dep.uid === this.currentDepUid)
    },
    depNames () {
      return this.allDepartments.map(dep => dep.name)
    },
    displayModal () {
      return !this.$store.state.onboarding.visitedModals?.includes('employee') && this.$store.state.onboarding.showModals
    }
  },
  watch: {
    isPropertiesMobileExpanded: {
      immediate: true,
      handler: function (val) {
        if (!val) {
          this.selectedEmployee = ''
        }
      }
    }
  },
  methods: {
    print (msg, val) {
      console.log(msg, val)
    },
    updateGridView (value) {
      this.$store.commit('basic', { key: 'isGridView', value: value })
      setLocalStorageItem('isGridView', value)
    },
    empIcon (user) {
      if (user.type === 1) return 'cup'
      if (user.type === 2) return 'star'
      if (user.type === 4) return 'send'
      return ''
    },
    showUserProperties (user) {
      if (!this.isPropertiesMobileExpanded) {
        this.$store.dispatch('asidePropertiesToggle', true)
      }

      this.selectedEmployee = user.email

      this.$store.commit('basic', { key: 'propertiesState', value: 'employee' })
      this.$store.commit(EMPLOYEE.SELECT_EMPLOYEE, this.$store.state.employees.employees[user.uid])
    },
    clickAddDep () {
      this.showAddDep = true
    },
    onAddNewDep (name) {
      this.showAddDep = false
      const title = name.trim()
      if (title) {
        const maxOrder =
          this.items.reduce(
            (maxOrder, child) =>
              child.order > maxOrder ? child.order : maxOrder,
            0
          ) || 0
        const data = {
          uid: uuidv4(),
          uid_parent: '00000000-0000-0000-0000-000000000000',
          name: title,
          collapsed: 0,
          emails: [],
          order: maxOrder + 1
        }
        this.$store.dispatch(DEPARTMENT.CREATE_DEPARTMENT_REQUEST, data)
          .then((resp) => {
            console.log('onAddNewDep', resp)
          })
      }
    },
    clickAddEmployee () {
      // если лицензия истекла
      if (this.$store.getters.isLicenseExpired) {
        this.showUsersLimit = true
        return
      }
      // если у нас куплены рабочие места
      // проверяем на превышение лицензии
      if (this.user.count_workplaces !== 0 && this.user.count_workplaces <= this.currUserWorkspaces) {
        this.showUsersLimit = true
        return
      }

      this.showAddEmployee = true
    },
    onAddNewEmp (name, email) {
      this.showAddEmployee = false
      const empName = name.trim()
      const empEmail = email.trim()
      if (empName && empEmail) {
        this.$store.dispatch(EMPLOYEE.CREATE_EMPLOYEE_REQUEST, {
          name: empName,
          email: empEmail
        })
          .catch((e) => {
            if (e.response?.data?.error === 'the employee is already present in this organization' || e.response?.data?.error === 'the employee has license') {
              this.showOtherOrg = true
            }
            if (e.response?.data?.error === 'the employee is the director of the organization') {
              this.alreadyExist = true
            }
          })
          .then((resp) => {
            console.log('onAddNewEmp', resp)
          })
      }
    },
    lockVisibility (uid) {
      const icon = this.$refs[`dep-icon-${uid}`][0]
      icon.style.visibility = 'visible'
    },
    unlockVisibility (uid) {
      const icon = this.$refs[`dep-icon-${uid}`][0]
      icon.style.visibility = null
    },
    clickDeleteDep (uid) {
      this.currentDepUid = uid
      this.showDeleteDep = true
    },
    onDeleteDep () {
      this.showDeleteDep = false
      if (this.currentDepUid) {
        this.$store.dispatch(DEPARTMENT.REMOVE_DEPARTMENT_REQUEST, this.currentDepUid)
          .then((resp) => {
            console.log('onDeleteDep', resp)
          })
      }
    },
    clickRenameDep (uid) {
      this.currentDepUid = uid
      this.showRenameDep = true
    },
    onRenameDep (name) {
      this.showRenameDep = false
      const title = name.trim()
      if (title && this.currentDep) {
        this.currentDep.name = title
        this.$store.dispatch(DEPARTMENT.UPDATE_DEPARTMENT_REQUEST, this.currentDep)
          .then((resp) => {
            console.log('onRenameDep', resp)
          })
      }
    },
    clickMoveDep (uid) {
      this.currentDepUid = uid
      this.showMoveDep = true
    },
    onChangeDepPosition (order) {
      this.showMoveDep = false
      if (this.currentDep) {
        // вычисляем новый order
        const index = this.currentDepPosition
        const allDep = [...this.allDepartments]
        const deps = allDep.splice(index, 1)
        allDep.splice(order, 0, ...deps)
        const prevDep = allDep[order - 1]
        const nextDep = allDep[order + 1]
        let newOrder = 0
        if (!prevDep && !nextDep) newOrder = 1
        else if (!prevDep) newOrder = nextDep.order - 1
        else if (!nextDep) newOrder = prevDep.order + 1
        else if (prevDep && nextDep) newOrder = (nextDep.order + prevDep.order) / 2
        //
        this.currentDep.order = newOrder
        this.$store.dispatch(DEPARTMENT.UPDATE_DEPARTMENT_REQUEST, this.currentDep)
          .then((resp) => {
            console.log('onChangeDepPosition', resp)
          })
      }
    },
    okToModal () {
      this.$store.commit(USER_VIEWED_MODAL, 'employee')
    },
    isUserOnline (uidUser) {
      return this.$store.state.employees.employees[uidUser]?.online || uidUser === this.$store.state.user.user.current_user_uid
    }

  }
}
</script>

<style scoped>

</style>
