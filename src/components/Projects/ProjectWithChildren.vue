<template>
  <div
    class="w-full"
  >
    <ProjectsOnboarding
      v-if="displayModalProjects"
      @okToModal="okToModal"
    />
    <div
      v-else
    >
      <NavBarProjects
        class="pt-[8px]"
        :project-uid="projectUid"
      />
      <div
        v-if="currentProject"
      >
        <div
          v-if="currentProject?.children?.length"
          class="grid gap-[8px] mb-[8px] grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
        >
          <template
            v-for="project in currentProject?.children"
            :key="project.uid"
          >
            <router-link :to="'/project/' + project.uid">
              <ProjectBlocItem
                :project="project"
              />
            </router-link>
          </template>
        </div>
        <TasksListNew
          :new-task-props="newTaskProps"
        />
      </div>
      <div
        v-else
      >
        <h1 class="text-3xl text-gray-600 font-bold mb-5">
          Нет доступа к проекту
        </h1>
      </div>
    </div>
  </div>
</template>

<script>
import NavBarProjects from '@/components/Navbar/NavBarProjects.vue'
import ProjectBlocItem from '@/components/Projects/ProjectBlocItem.vue'
import TasksListNew from '@/components/TasksListNew.vue'
import * as TASK from '@/store/actions/tasks'
import ProjectsOnboarding from './ProjectsOnboarding.vue'
import { USER_VIEWED_MODAL } from '@/store/actions/onboarding.js'

export default {
  components: {
    ProjectBlocItem,
    TasksListNew,
    NavBarProjects,
    ProjectsOnboarding
  },
  computed: {
    projectUid () {
      return this.$route.params.project_id
    },
    currentProject () {
      return this.$store.state.projects.projects[this.projectUid]
    },
    newTaskProps () {
      if (this.currentProject?.uid) {
        return ({
          uid_project: this.currentProject.uid
        })
      }
      return ({})
    },
    hsntProjectAccess () {
      return !Object.keys(this.$store.state.projects.projects).includes(this.$route.params.project_id)
    },
    displayModalProjects () {
      return !this.$store.state.onboarding.visitedModals?.includes('projects') && this.$store.state.onboarding.showModals
    }
  },
  watch: {
    projectUid (newUid) {
      if (newUid) {
        this.loadProject()
      }
    }
  },
  mounted () {
    this.loadProject()
  },
  methods: {
    loadProject () {
      // если нет такого проекта у нас - перекидываем в корень проектов
      if (this.hsntProjectAccess) {
        return
      }
      this.$store.dispatch(TASK.PROJECT_TASKS_REQUEST, this.currentProject.uid)
      this.$store.commit(TASK.CLEAN_UP_LOADED_TASKS)
    },
    okToModal () {
      this.$store.commit(USER_VIEWED_MODAL, 'projects')
    }
  }
}
</script>

<style scoped></style>
