<template>
  <ReglamentAddLimit
    v-if="showAddLimit"
    @cancel="showAddLimit = false"
    @ok="showAddLimit = false"
  />
  <div
    v-if="!displayModal"
    class="w-full"
  >
    <div class="flex items-center justify-between w-full">
      <NavBar
        class="w-full pt-[8px]"
        title="Регламенты"
      />
      <div
        v-if="isReglamentsLoaded"
        class="flex flex-none px-[12px] pt-[8px]"
      >
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
      v-if="!isReglamentsLoaded"
      class="flex flex-col font-roboto text-[16px] leading-[15px] text-[#7e7e80] font-medium truncate"
    >
      <span class="my-[15px]">Не удалось загрузить регламенты.</span>
      <span
        class="my-[15px] w-min underline hover:cursor-pointer"
        @click="tryToLoadReglaments"
      >
        Попробовать ещё раз
      </span>
    </div>
    <div v-if="isReglamentsLoaded">
      <div
        v-for="(reg, index) in reglaments"
        :key="index"
      >
        <div
          class="flex w-full"
          :class="{ 'justify-between': index == 0, 'mt-[28px]': index != 0 }"
        >
          <p class="font-['Roboto'] text-[#424242] text-[19px] leading-[22px] font-bold">
            {{ reg.dep }}
          </p>
        </div>
        <div
          class="grid gap-2 mt-3 grid-cols-1"
          :class="{
            'md:grid-cols-2 lg:grid-cols-4': isGridView,
            'lg:grid-cols-2': isPropertiesMobileExpanded && isGridView
          }"
        >
          <template
            v-for="reglament in reg.items"
            :key="reglament.uid"
          >
            <router-link
              :to="'/reglaments/' + reglament.uid"
            >
              <ReglamentBlocItem
                :reglament="reglament"
              />
            </router-link>
          </template>
          <ReglamentBlocEmpty
            v-if="!reg.is_my_dep && reg.items.length === 0"
          />
          <InputValue
            v-if="showAddReglament && addReglamentDepartment === reg.uid"
            @save="onAddNewReglament"
            @cancel="showAddReglament = false"
          />
          <ListBlocAdd
            v-else-if="reg.is_my_dep"
            title="Добавить регламент"
            @click.stop="clickAddReglament(reg.uid)"
          />
        </div>
      </div>
      <div
        v-if="currentUserIsAdmin"
        class="flex items-center w-full my-[28px] text-[#7e7e80] hover:text-[#424242] cursor-pointer"
        @click.stop="clickShowAll"
      >
        <p
          v-if="items.length"
          class="font-roboto text-[17px] leading-[22px]"
        >
          {{ showAllReglaments ? 'Показать только доступные' : 'Показать все регламенты' }}
        </p>
      </div>
    </div>
    <EmptyTasksListPics v-if="isEmpty" />
  </div>
  <div
    v-if="displayModal"
    class="mt-[100px] flex flex-col items-center justify-center"
  >
    <ReglamentsOboarding
      @okToModal="okToModal"
    />
  </div>
</template>

<script>
import Icon from '@/components/Icon.vue'
import { setLocalStorageItem } from '@/store/helpers/functions'
import ReglamentBlocItem from '@/components/Reglaments/ReglamentBlockItem.vue'
import ReglamentBlocEmpty from '@/components/Reglaments/ReglamentBlocEmpty.vue'
import ListBlocAdd from '@/components/Common/ListBlocAdd.vue'
import ReglamentAddLimit from '@/components/Reglaments/ReglamentAddLimit.vue'
import EmptyTasksListPics from '@/components/TasksList/EmptyTasksListPics'
import NavBar from '@/components/Navbar/NavBar.vue'

import * as NAVIGATOR from '@/store/actions/navigator'
import * as REGLAMENTS from '@/store/actions/reglaments'
import * as DOITNOW from '@/store/actions/doitnow.js'

import gridView from '@/icons/grid-view.js'
import listView from '@/icons/list-view.js'
import { USER_VIEWED_MODAL } from '@/store/actions/onboarding.js'
import { uuidv4 } from '@/helpers/functions'
import InputValue from '@/components/InputValue'
import ReglamentsOboarding from './ReglamentsOboarding.vue'

export default {
  components: {
    InputValue,
    Icon,
    ReglamentBlocItem,
    ReglamentBlocEmpty,
    ReglamentAddLimit,
    ListBlocAdd,
    EmptyTasksListPics,
    NavBar,
    ReglamentsOboarding
  },
  data () {
    return {
      showAddReglament: false,
      addReglamentDepartment: '',
      showAddLimit: false,
      gridView,
      listView
    }
  },
  computed: {
    items () {
      return this.$store.getters.sortedNavigator.reglaments?.items
    },
    isGridView () {
      setLocalStorageItem('isGridView', true)
      return this.$store.state.isGridView
    },
    isPropertiesMobileExpanded () {
      return this.$store.state.isPropertiesMobileExpanded
    },
    isEmpty () {
      return !this.items.length
    },
    user () {
      return this.$store.state.user.user
    },
    currentUserIsAdmin () {
      const employees = this.$store.state.employees.employees
      const userType = employees[this.user?.current_user_uid]?.type ?? 0
      return userType === 1 || userType === 2
    },
    allDepartments () {
      return this.$store.getters.sortedDepartments
    },
    reglaments () {
      const reglaments = []
      const common = {
        dep: 'Общие регламенты',
        uid: '',
        is_my_dep: true,
        items: []
      }
      reglaments.push(common)
      const currentUserEmail = this.$store.state.user?.user?.current_user_email.toLowerCase()
      const departmentMap = {}
      for (const dep of this.allDepartments) {
        const reglament = {
          dep: dep.name.length > 50 ? dep.name.substring(0, 50) + '...' : dep.name,
          uid: dep.uid,
          is_my_dep: dep.emails.find(email => email.toLowerCase() === currentUserEmail),
          items: []
        }
        reglaments.push(reglament)
        departmentMap[reglament.uid] = reglament
      }
      for (const item of this.items) {
        const dep = departmentMap[item.department_uid]
        if (dep) {
          dep.items.push(item)
        } else {
          common.items.push(item)
        }
      }
      if (this.showAllReglaments) return reglaments
      return reglaments.filter(reg => reg.is_my_dep)
    },
    showAllReglaments () {
      return this.$store.state.reglaments.showAll
    },
    displayModal () {
      return !this.$store.state.onboarding.visitedModals?.includes('reglaments') && this.$store.state.onboarding.showModals
    },
    isReglamentsLoaded () {
      return this.$store.state.reglaments.isLoaded
    }
  },
  created () {
    setLocalStorageItem('isGridView', true)
  },
  methods: {
    tryToLoadReglaments () {
      location.reload()
    },
    updateGridView (value) {
      this.$store.commit('basic', { key: 'isGridView', value: value })
      setLocalStorageItem('isGridView', value)
    },
    clickShowAll () {
      this.$store.state.reglaments.showAll = !this.showAllReglaments
    },
    clickAddReglament (uid) {
      if ((this.user.tarif !== 'alpha' && this.user.tarif !== 'trial') || this.$store.getters.isLicenseExpired) {
        this.showAddLimit = true
        return
      }
      this.addReglamentDepartment = uid
      this.showAddReglament = true
    },
    onAddNewReglament (name) {
      const departmentUid = this.addReglamentDepartment
      this.addReglamentDepartment = ''
      this.showAddReglament = false
      const title = name.trim()
      if (title) {
        const reglament = {
          bold: 0,
          color: '',
          organization: this.user.owner_email,
          email_creator: this.user.current_user_email,
          name: title,
          content: '',
          department_uid: departmentUid,
          uid: uuidv4()
        }

        this.$store.dispatch(REGLAMENTS.CREATE_REGLAMENT_REQUEST, reglament).then(() => {
          reglament.needStartEdit = true
          this.$store.commit(DOITNOW.SLIDES_CHANGE_VISIBLE, { name: 'addReglaments', visible: false })
          this.$store.commit(NAVIGATOR.NAVIGATOR_PUSH_REGLAMENT, reglament)
          this.$router.push('/reglaments/' + reglament.uid + '/edit')
        })
      }
    },
    okToModal () {
      this.$store.commit(USER_VIEWED_MODAL, 'reglaments')
    }
  }
}
</script>

<style scoped></style>
