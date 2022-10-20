<template>
  <div>
    <TaskPropsAccessLimitModalBox
      v-if="showAccessLimit"
      @cancel="showAccessLimit = false"
      @ok="showAccessLimit = false"
    />
    <div class="flex justify-end items-center">
      <PropsButtonClose @click="closeProperties" />
    </div>
    <input
      v-if="isCanEdit"
      v-model="currName"
      type="text"
      placeholder="Наименование"
      class="mt-[15px] p-0 font-roboto font-bold font-[18px] leading-[21px] text-[#424242] w-full border-none focus:ring-0 focus:outline-none"
      @blur="changeProjectName"
    >
    <div
      v-else
      class="mt-[25px] w-full font-roboto font-bold font-[18px] leading-[21px] text-[#424242] overflow-hidden text-ellipsis whitespace-nowrap"
    >
      {{ currName }}
    </div>
    <div
      class="mt-[30px] font-roboto text-[16px] leading-[19px] font-medium text-[#4c4c4d]"
    >
      Цвет
    </div>
    <div class="w-full mt-[15px] gap-[4px] flex flex-col">
      <div
        v-for="(clrs, index) in defaultColors"
        :key="index"
        class="flex gap-[4px]"
      >
        <PropsColorBoxItem
          v-for="clr in clrs"
          :key="clr.color"
          :class="{ 'cursor-pointer': isCanEdit }"
          :color="clr.color"
          :selected="clr.selected"
          @select="changeProjectColor"
        />
      </div>
    </div>
    <div
      class="mt-[45px] flex gap-[10px] items-center"
      :class="{'cursor-pointer': isCanEdit}"
      @click="favoriteToggle"
    >
      <svg
        v-if="isFavorite"
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

      <div class="font-roboto text-[16px] leading-[20px] text-[#4c4c4d]">
        Избранный проект
      </div>
    </div>
    <div
      class="mt-[30px] mb-[8px] font-roboto text-[16px] leading-[19px] font-medium text-[#4c4c4d]"
    >
      Доступ
    </div>
    <PopMenu
      v-if="isCanEdit && usersCanAddToAccess.length"
      class="w-full"
    >
      <div
        class="w-full h-[34px] gap-[5px] flex items-center text-[#4c4c4d] hover:text-[#4c4c4d]/75 cursor-pointer"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.66824 7.3379L8.67295 3.28854C8.67295 3.111 8.60243 2.94074 8.47689 2.8152C8.35135 2.68967 8.18109 2.61914 8.00356 2.61914C7.82602 2.61914 7.65576 2.68967 7.53022 2.8152C7.40469 2.94074 7.33416 3.111 7.33416 3.28853L7.33888 7.3379L3.28951 7.33319C3.11198 7.33319 2.94171 7.40371 2.81618 7.52925C2.69064 7.65478 2.62012 7.82505 2.62012 8.00258C2.62012 8.18011 2.69064 8.35038 2.81618 8.47591C2.94171 8.60145 3.11198 8.67197 3.28951 8.67197L7.33888 8.66726L7.33416 12.7166C7.3338 12.8046 7.35087 12.8918 7.38438 12.9732C7.41789 13.0546 7.46719 13.1285 7.52942 13.1908C7.59165 13.253 7.66559 13.3023 7.74696 13.3358C7.82834 13.3693 7.91555 13.3864 8.00356 13.386C8.09156 13.3864 8.17877 13.3693 8.26015 13.3358C8.34153 13.3023 8.41546 13.253 8.47769 13.1908C8.53993 13.1285 8.58922 13.0546 8.62273 12.9732C8.65624 12.8918 8.67331 12.8046 8.67295 12.7166L8.66824 8.66726L12.7176 8.67197C12.8056 8.67233 12.8928 8.65527 12.9742 8.62176C13.0556 8.58824 13.1295 8.53895 13.1917 8.47672C13.254 8.41449 13.3033 8.34055 13.3368 8.25917C13.3703 8.17779 13.3874 8.09059 13.387 8.00258C13.3874 7.91457 13.3703 7.82736 13.3368 7.74599C13.3033 7.66461 13.254 7.59067 13.1917 7.52844C13.1295 7.46621 13.0556 7.41692 12.9742 7.3834C12.8928 7.34989 12.8056 7.33283 12.7176 7.33319L8.66824 7.3379Z"
            fill="currentColor"
          />
        </svg>

        <div
          class="font-roboto text-[13px] leading-[15px] font-medium"
        >
          Добавить сотрудника
        </div>
      </div>
      <template #menu>
        <div class="max-h-[220px] overflow-y-auto w-[220px] scroll-style">
          <ProjectPropsMenuItemUser
            v-for="user in usersCanAddToAccess"
            :key="user.email"
            :user-email="user.email"
            @click="addProjectMember(user.email)"
          />
        </div>
      </template>
    </PopMenu>
    <PopMenu
      v-if="isCanEdit && depsCanAddToAccess.length"
      class="w-full"
    >
      <div
        class="w-full h-[34px] gap-[5px] flex items-center text-[#4c4c4d] hover:text-[#4c4c4d]/75 cursor-pointer"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.66824 7.3379L8.67295 3.28854C8.67295 3.111 8.60243 2.94074 8.47689 2.8152C8.35135 2.68967 8.18109 2.61914 8.00356 2.61914C7.82602 2.61914 7.65576 2.68967 7.53022 2.8152C7.40469 2.94074 7.33416 3.111 7.33416 3.28853L7.33888 7.3379L3.28951 7.33319C3.11198 7.33319 2.94171 7.40371 2.81618 7.52925C2.69064 7.65478 2.62012 7.82505 2.62012 8.00258C2.62012 8.18011 2.69064 8.35038 2.81618 8.47591C2.94171 8.60145 3.11198 8.67197 3.28951 8.67197L7.33888 8.66726L7.33416 12.7166C7.3338 12.8046 7.35087 12.8918 7.38438 12.9732C7.41789 13.0546 7.46719 13.1285 7.52942 13.1908C7.59165 13.253 7.66559 13.3023 7.74696 13.3358C7.82834 13.3693 7.91555 13.3864 8.00356 13.386C8.09156 13.3864 8.17877 13.3693 8.26015 13.3358C8.34153 13.3023 8.41546 13.253 8.47769 13.1908C8.53993 13.1285 8.58922 13.0546 8.62273 12.9732C8.65624 12.8918 8.67331 12.8046 8.67295 12.7166L8.66824 8.66726L12.7176 8.67197C12.8056 8.67233 12.8928 8.65527 12.9742 8.62176C13.0556 8.58824 13.1295 8.53895 13.1917 8.47672C13.254 8.41449 13.3033 8.34055 13.3368 8.25917C13.3703 8.17779 13.3874 8.09059 13.387 8.00258C13.3874 7.91457 13.3703 7.82736 13.3368 7.74599C13.3033 7.66461 13.254 7.59067 13.1917 7.52844C13.1295 7.46621 13.0556 7.41692 12.9742 7.3834C12.8928 7.34989 12.8056 7.33283 12.7176 7.33319L8.66824 7.3379Z"
            fill="currentColor"
          />
        </svg>

        <div
          class="font-roboto text-[13px] leading-[15px] font-medium"
        >
          Добавить отдел
        </div>
      </div>
      <template #menu>
        <div class="max-h-[220px] overflow-y-auto w-[220px] scroll-style">
          <ProjectPropsMenuItemDeps
            v-for="dep in depsCanAddToAccess"
            :key="dep.uid"
            :dep-name="dep.name"
            @click="setDepartment(dep.uid)"
          />
        </div>
      </template>
    </PopMenu>
    <div class="flex flex-col gap-y-[5px]">
      <ProjectPropsUserButton
        class="mt-[8px]"
        :user-email="selectedProjectCreatorEmail"
        status="Владелец"
        disabled
      />
      <ProjectPropsUserButton
        v-for="user in usersBoard"
        :key="user.email"
        :user-email="user.email"
        :disabled="!isCanEdit"
        @delete="deleteMember(user.email)"
      />
      <ProjectPropsDepButton
        v-for="dep in depsProject"
        :key="dep.uid"
        :name="dep.name"
        :disabled="!isCanEdit"
        @delete="deleteDepartment(dep.uid)"
      />
    </div>
  </div>
</template>

<script>
import ProjectPropsUserButton from '@/components/Projects/ProjectPropsUserButton.vue'
import ProjectPropsMenuItemUser from '@/components/Projects/ProjectPropsMenuItemUser.vue'
import PropsColorBoxItem from '@/components/Common/PropsColorBoxItem.vue'
import PopMenu from '@/components/Common/PopMenu.vue'
import PropsButtonClose from '@/components/Common/PropsButtonClose.vue'
import TaskPropsAccessLimitModalBox from '@/components/properties/TaskPropsAccessLimitModalBox.vue'

import * as PROJECT from '@/store/actions/projects'
import ProjectPropsMenuItemDeps from '../Projects/ProjectPropsMenuItemDeps.vue'
import ProjectPropsDepButton from '../Projects/ProjectPropsDepButton.vue'

export default {
  components: {
    TaskPropsAccessLimitModalBox,
    ProjectPropsUserButton,
    ProjectPropsMenuItemUser,
    PropsColorBoxItem,
    PopMenu,
    PropsButtonClose,
    ProjectPropsMenuItemDeps,
    ProjectPropsDepButton
  },
  data () {
    return {
      showConfirm: false,
      showAccessLimit: false,
      currName: ''
    }
  },
  computed: {
    defaultColors () {
      const allColors = [
        '',
        '#7fc870',
        '#69c494',
        '#dff2e1',
        '#ffaf40',
        '#ffd7a0',
        '#5ba4cf',
        '#9eedff',
        '#b381b3',
        '#e5e5e5',
        '#ddd1c2',
        '#ef7665',
        '#ffc6b5',
        '#ff8ed4',
        '#f5dbf5',
        '#6a7077',
        '#f6dd29',
        '#f5f547'
      ]
      // добавляем в конец выбранный цвет если его тут нет
      const usedColor = this.selectedProjectColor.toLowerCase()
      if (!allColors.includes(usedColor)) {
        allColors.splice(allColors.length - 1, 1, usedColor)
      }
      const colors = allColors.map((color) => ({
        color: color,
        selected: color === usedColor
      }))
      // разбираем на ряды по 9
      const rowLength = 9
      const arrColors = []
      while (colors.length) arrColors.push(colors.splice(0, rowLength))
      return arrColors
    },
    allDepartments () {
      return this.$store.getters.sortedDepartments
    },
    depsCanAddToAccess () {
      const deps = []
      for (const dep of this.allDepartments) {
        if (!this.selectedProjectDeps.includes(dep.uid)) {
          deps.push({
            uid: dep.uid,
            name: dep.name
          })
        }
      }
      return deps
    },
    employeesByEmail () {
      return this.$store.state.employees.employeesByEmail
    },
    selectedProject () {
      return this.$store.state.projects.selectedProject
    },
    selectedProjectUid () {
      return this.selectedProject?.uid || ''
    },
    selectedProjectDeps () {
      return this.selectedProject?.deps || []
    },
    selectedProjectName () {
      return this.selectedProject?.name || ''
    },
    selectedProjectCreatorEmail () {
      return this.selectedProject?.email_creator || ''
    },
    selectedProjectColor () {
      const backColor = this.selectedProject?.color
      if (backColor && backColor !== '#A998B6') return backColor
      return ''
    },
    isCanDelete () {
      const user = this.$store.state.user.user
      return this.selectedProjectCreatorEmail === user.current_user_email
    },
    isCanEdit () {
      return this.isCanDelete
    },
    usersBoard () {
      const users = []
      const members = this.selectedProject?.members || []
      for (const userEmail of members) {
        const emp = this.employeesByEmail[userEmail.toLowerCase()]
        if (emp && emp?.email !== this.selectedProjectCreatorEmail) {
          users.push({
            uid: emp?.uid,
            email: emp?.email
          })
        }
      }
      return users
    },
    selectedProjectMembers () {
      return this.selectedProject?.members.reduce((acc, userEmail) => {
        acc[userEmail.toLowerCase()] = userEmail
        return acc
      }, {}) || {}
    },
    usersCanAddToAccess () {
      const users = []
      const employees = Object.values(this.$store.state.employees.employees)
      for (const emp of employees) {
        if (this.selectedProjectMembers[emp.email.toLowerCase()] === undefined) {
          users.push({
            uid: emp.uid,
            email: emp.email
          })
        }
      }
      return users
    },
    isFavorite () {
      return this.selectedProject?.favorite
    },
    depsProject () {
      const allDeps = []
      const deps = this.$store.state.departments.deps
      if (this.selectedProjectDeps) {
        this.selectedProjectDeps.map((depUid) => {
          const oneDep = deps[depUid]
          allDeps.push({
            uid: depUid,
            name: oneDep?.name ?? '???'
          })
          return allDeps
        })
      }
      return allDeps
    }
  },
  watch: {
    selectedProjectName: {
      immediate: true,
      handler: function (val) {
        this.currName = val
      }
    }
  },
  methods: {
    print (msg, param) {
      console.log(msg, param)
    },
    setDepartment (depUid) {
      if (this.isCanEdit &&
        !this.selectedProjectDeps.includes(depUid)
      ) {
        const deps = [...this.selectedProjectDeps, depUid]
        this.selectedProject.deps = deps
        this.$store.dispatch(PROJECT.CHANGE_PROJECT_DEPS, {
          projectUid: this.selectedProject.uid,
          newDeps: deps
        })
      }
    },
    deleteDepartment (depUid) {
      if (this.isCanEdit &&
        this.selectedProjectDeps.includes(depUid)
      ) {
        const filteredDeps = this.selectedProjectDeps.filter(uid => uid !== depUid)
        this.selectedProject.deps = filteredDeps
        this.$store.dispatch(PROJECT.CHANGE_PROJECT_DEPS, {
          projectUid: this.selectedProject.uid,
          newDeps: filteredDeps
        })
      }
    },
    favoriteToggle () {
      if (!this.isFavorite) {
        this.$store.dispatch(PROJECT.ADD_PROJECT_TO_FAVORITE, this.selectedProject)
          .then(res => {
            this.selectedProject.favorite = res.data.favorite
          })
      } else {
        this.$store.dispatch(PROJECT.REMOVE_PROJECT_FROM_FAVORITE, this.selectedProject)
          .then(res => {
            this.selectedProject.favorite = res.data.favorite
          })
      }
    },
    closeProperties () {
      this.$store.dispatch('asidePropertiesToggle', false)
    },
    changeProjectName () {
      const title = this.currName.trim()
      if (this.isCanEdit && title && this.selectedProjectName !== title) {
        this.selectedProject.name = title
        this.$store
          .dispatch(PROJECT.CHANGE_PROJECT_NAME, {
            projectUid: this.selectedProjectUid,
            newProjectTitle: title
          })
          .then((resp) => {
            console.log('changeProjectName', resp, title)
          })
      }
    },
    changeProjectColor (color) {
      if (this.isCanEdit && this.selectedProjectColor.toLowerCase() !== color) {
        this.selectedProject.color = color || '#A998B6'
        const data = {
          projectUid: this.selectedProjectUid,
          newProjectColor: color || '#A998B6'
        }
        this.$store.dispatch(PROJECT.CHANGE_PROJECT_COLOR, data).then((resp) => {
          console.log('changeProjectColor', resp, color)
        })
      }
    },
    addProjectMember (userEmail) {
      // если лицензия истекла
      if (this.$store.getters.isLicenseExpired) {
        this.showAccessLimit = true
        return
      }
      if (
        this.isCanEdit &&
        this.selectedProjectMembers[userEmail.toLowerCase()] === undefined
      ) {
        const users = [...this.selectedProject.members]
        users.push(userEmail)
        this.selectedProject.members = users
        const data = {
          projectUid: this.selectedProjectUid,
          newProjectMembers: users
        }
        this.$store.dispatch(PROJECT.CHANGE_PROJECT_MEMBERS, data).then((resp) => {
          console.log('changeProjectMembers', resp, users)
        })
      }
    },
    deleteMember (userEmail) {
      if (
        this.isCanEdit &&
        this.selectedProjectMembers[userEmail.toLowerCase()] !== undefined
      ) {
        const users = this.selectedProject.members.filter((email) => email.toLowerCase() !== userEmail.toLowerCase())
        this.selectedProject.members = users
        const data = {
          projectUid: this.selectedProjectUid,
          newProjectMembers: users
        }
        this.$store.dispatch(PROJECT.CHANGE_PROJECT_MEMBERS, data).then((resp) => {
          console.log('changeProjectMembers', resp, users)
        })
      }
    }
  }
}
</script>

<style scoped>
</style>
