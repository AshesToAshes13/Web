<template>
  <div class="w-full">
    <div class="flex items-center justify-between w-full pt-[8px]">
      <NavBar
        class="w-full"
        title="Проекты"
      />
      <div
        class="flex flex-none px-[12px] pt-[8px]"
      >
        <icon
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
        <icon
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
    <div v-if="!displayModal">
      <ProjectModalBoxProjectsLimit
        v-if="showProjectsLimit"
        @cancel="showProjectsLimit = false"
        @ok="showProjectsLimit = false"
      />
      <div class="flex flex-col gap-[15px]">
        <ProjectChildrenGroup
          v-if="favoriteProjects.length"
          title="Избранные доски"
          :projects="favoriteProjects"
        />
        <ProjectChildrenGroup
          v-for="dep in depProjects"
          :key="dep.uid"
          :title="dep.title"
          :projects="dep.projects"
        />
        <ProjectChildrenGroup
          title="Мои проекты"
          :projects="sortedPrivateProjects"
        />
        <InputValue
          v-if="showAddProject && index === 0"
          @save="onAddNewProject"
          @cancel="showAddProject = false"
        />
        <ListBlocAdd
          v-else-if="index == 0"
          @click.stop="clickAddProject"
        />
        <ProjectChildrenGroup
          v-if="sortedCommonProjects.length"
          title="Общие проекты"
          :projects="sortedCommonProjects"
        />
      </div>
      <EmptyTasksListPics v-if="isEmpty" />
    </div>
    <div
      v-if="displayModal"
      class="flex flex-col justify-center items-center "
    >
      <ProjectOnboarding
        @okToModal="okToModal"
      />
    </div>
  </div>
</template>

<script>
import Icon from '@/components/Icon.vue'
import ProjectModalBoxProjectsLimit from '@/components/ProjectModalBoxProjectsLimit.vue'
import { setLocalStorageItem } from '@/store/helpers/functions'
import ListBlocAdd from '@/components/Common/ListBlocAdd.vue'
import EmptyTasksListPics from '@/components/TasksList/EmptyTasksListPics'
import NavBar from '@/components/Navbar/NavBar.vue'

import * as PROJECT from '@/store/actions/projects'
import * as NAVIGATOR from '@/store/actions/navigator'

import gridView from '@/icons/grid-view.js'
import listView from '@/icons/list-view.js'
import { USER_VIEWED_MODAL } from '@/store/actions/onboarding.js'
import InputValue from '@/components/InputValue'
import { uuidv4 } from '@/helpers/functions'
import { mapGetters } from 'vuex'
import ProjectChildrenGroup from './Projects/ProjectChildrenGroup.vue'
import ProjectOnboarding from './Projects/ProjectOnboarding.vue'

export default {
  components: {
    InputValue,
    Icon,
    ListBlocAdd,
    ProjectModalBoxProjectsLimit,
    EmptyTasksListPics,
    NavBar,
    ProjectChildrenGroup,
    ProjectOnboarding
  },
  data () {
    return {
      showProjectsLimit: false,
      showAddProject: false,
      gridView,
      listView
    }
  },
  computed: {
    ...mapGetters([
      'favoriteProjects',
      'privateProjects',
      'commonProjects',
      'departmentsProjects'
    ]),
    items () {
      return this.$store.getters.sortedNavigator.new_private_projects
    },
    isGridView () {
      setLocalStorageItem('isGridView', true)
      return this.$store.state.isGridView
    },
    isPropertiesMobileExpanded () {
      return this.$store.state.isPropertiesMobileExpanded
    },
    isEmpty () {
      return !this.items[0].items.length && !this.items[1].items.length
    },
    displayModal () {
      return !this.$store.state.onboarding.visitedModals?.includes('project') && this.$store.state.onboarding.showModals
    },
    sortedPrivateProjects () {
      return this.privateProjects.filter(proj => this.depProjectsMap[proj.uid] === undefined)
    },
    sortedCommonProjects () {
      return this.commonProjects.filter(proj => this.depProjectsMap[proj.uid] === undefined)
    },
    depProjectsMap () {
      return this.depProjects.reduce((access, dep) => {
        dep.projects.forEach(proj => {
          access[proj.uid] = dep
        })
        return access
      }, {})
    },
    depProjects () {
      const projects = Object.values(this.$store.state.projects.projects)
      const departmentsMap = projects.reduce((access, project) => {
        project.deps.forEach(depUid => {
          if (access[depUid] === undefined) access[depUid] = []
          access[depUid].push(project)
        })
        return access
      }, {})
      const allDeps = this.$store.getters.sortedDepartments
      return allDeps.reduce((access, dep) => {
        if (departmentsMap[dep.uid] && dep.name) {
          const depGroup = {
            uid: dep.uid,
            title: dep.name,
            projects: departmentsMap[dep.uid]
          }
          depGroup.projects.sort((project1, project2) => {
            return project1.name.localeCompare(project2.name)
          })
          access.push(depGroup)
        }
        return access
      }, [])
    }
  },
  created () {
    setLocalStorageItem('isGridView', true)
  },
  methods: {
    updateGridView (value) {
      this.$store.commit('basic', { key: 'isGridView', value: value })
      setLocalStorageItem('isGridView', value)
    },
    clickAddProject () {
      // если лицензия истекла
      if (Object.keys(this.$store.state.projects.projects).length >= 10 && this.$store.getters.isLicenseExpired) {
        this.showProjectsLimit = true
        return
      }
      this.showAddProject = true
    },
    onAddNewProject (name) {
      this.showAddProject = false
      const title = name.trim()
      if (title) {
        // добавляем новый проект и переходим в него
        const maxOrder =
          this.items[0]?.items?.reduce(
            (maxOrder, child) =>
              child.order > maxOrder ? child.order : maxOrder,
            0
          ) || 0
        const user = this.$store.state.user.user
        const project = {
          uid: uuidv4(),
          name: title,
          uid_parent: '00000000-0000-0000-0000-000000000000',
          email_creator: user.current_user_email,
          order: maxOrder + 1,
          comment: '',
          plugin: '',
          collapsed: 0,
          isclosed: 0,
          group: 0,
          show: 1,
          favorite: 0,
          quiet: 0,
          members: [user.current_user_email],
          children: [],
          bold: 0
        }
        this.$store.dispatch(PROJECT.CREATE_PROJECT_REQUEST, project).then((res) => {
          // заполняем недостающие параметры
          project.global_property_uid = '431a3531-a77a-45c1-8035-f0bf75c32641'
          project.order = res.data.order
          project.color = '#A998B6'

          this.$store.commit(PROJECT.PUSH_PROJECT, [project])
          this.$store.commit(NAVIGATOR.NAVIGATOR_PUSH_PROJECT, [project])
          this.$router.push('/project/' + project.uid)
        })
      }
    },
    okToModal () {
      this.$store.commit(USER_VIEWED_MODAL, 'project')
    }
  }
}
</script>

<style scoped></style>
