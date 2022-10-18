<template>
  <div class="flex items-center gap-[10px]">
    <BoardModalBoxRename
      v-if="showAdd"
      :show="showAdd"
      title="Добавить подпроект"
      @cancel="showAdd = false"
      @save="onAddNewProject"
    />
    <ProjectModalBoxProjectsLimit
      v-if="showProjectsLimit"
      @cancel="showProjectsLimit = false"
      @ok="showProjectsLimit = false"
    />
    <BoardModalBoxDelete
      v-if="showDeleteProject"
      title="Удалить проект"
      :text="deleteMessage"
      @cancel="showDeleteProject = false"
      @yes="onDeleteProject"
    />
    <BoardModalBoxDelete
      v-if="showConfirmQuit"
      title="Покинуть проект"
      :text="quitMessage"
      @cancel="showConfirmQuit = false"
      @yes="quitProject"
    />
    <PopMenu>
      <NavBarButtonIcon icon="menu" />
      <template #menu>
        <PopMenuItem
          @click="clickCompletedTasks"
        >
          {{ showCompletedTasks ? 'Скрыть завершенные задачи' : 'Показать завершенные задачи' }}
        </PopMenuItem>
        <PopMenuDivider />
        <PopMenuItem
          icon="options"
          @click="clickEditProject"
        >
          Свойства проекта
        </PopMenuItem>
        <PopMenuItem
          v-if="canAddChild"
          icon="add"
          @click="clickAddProject"
        >
          Создать подпроект
        </PopMenuItem>
        <PopMenuItem
          v-if="canDelete"
          icon="delete"
          type="delete"
          @click="clickDeleteProject"
        >
          Удалить проект
        </PopMenuItem>
        <PopMenuItem
          v-if="!canDelete"
          icon="delete"
          type="delete"
          @click="clickQuitProject"
        >
          Покинуть проект
        </PopMenuItem>
      </template>
    </PopMenu>
  </div>
</template>

<script>
import NavBarButtonIcon from '@/components/Navbar/NavBarButtonIcon.vue'
import PopMenu from '@/components/Common/PopMenu.vue'
import PopMenuItem from '@/components/Common/PopMenuItem.vue'
import PopMenuDivider from '@/components/Common/PopMenuDivider.vue'
import BoardModalBoxDelete from '@/components/Board/modalboxes/BoardModalBoxDelete.vue'
import ProjectModalBoxProjectsLimit from '@/components/ProjectModalBoxProjectsLimit.vue'
import BoardModalBoxRename from '@/components/Board/modalboxes/BoardModalBoxRename.vue'
import * as PROJECT from '@/store/actions/projects'
import * as NAVIGATOR from '@/store/actions/navigator'

import {
  REMOVE_PROJECT_REQUEST,
  SELECT_PROJECT
} from '@/store/actions/projects'
import { NAVIGATOR_REMOVE_PROJECT } from '@/store/actions/navigator'

export default {
  components: {
    NavBarButtonIcon,
    PopMenu,
    BoardModalBoxRename,
    ProjectModalBoxProjectsLimit,
    PopMenuItem,
    PopMenuDivider,
    BoardModalBoxDelete
  },
  props: {
    projectUid: {
      type: String,
      default: ''
    },
    showCompletedTasks: {
      type: Boolean,
      default: false
    }
  },
  emits: ['popNavBar', 'toggleCompletedTasks'],
  data () {
    return {
      showDeleteProject: false,
      showAdd: false,
      showConfirmQuit: false,
      showProjectsLimit: false
    }
  },
  computed: {
    deleteMessage () {
      if (this.project.children.length !== 0) {
        return `Вы действительно хотите удалить проект ${this.project.name}? \n\n Внимание! Все дочерние проекты будут удалены.`
      }
      return `Вы действительно хотите удалить проект ${this.project.name}?`
    },
    quitMessage () {
      return `Вы действительно хотите покинуть проект ${this.project.name}? Обратно можно попасть, только если владелец проекта опять вас добавит.`
    },
    selectedProject () {
      return this.$store.state.projects.selectedProject
    },
    selectedProjectUid () {
      return this.selectedProject?.uid || ''
    },
    project () {
      return this.$store.state.projects.projects[this.projectUid]
    },
    canAddChild () {
      const user = this.$store.state.user.user
      return this.project?.email_creator === user.current_user_email
    },
    canDelete () {
      return this.project?.email_creator.toLowerCase() === this.$store.state.user?.user?.current_user_email.toLowerCase()
    }
  },
  methods: {
    clickEditProject () {
      if (!this.$store.state.isPropertiesMobileExpanded) {
        this.$store.dispatch('asidePropertiesToggle', true)
      }
      this.$store.commit('basic', { key: 'propertiesState', value: 'project' })
      this.$store.commit(SELECT_PROJECT, this.project)
    },
    clickDeleteProject () {
      this.showDeleteProject = true
    },
    clickQuitProject () {
      this.showConfirmQuit = true
    },
    clickAddProject () {
      // если лицензия истекла
      if (Object.keys(this.$store.state.projects.projects).length >= 10 && this.$store.getters.isLicenseExpired) {
        this.showProjectsLimit = true
        return
      }
      this.showAdd = true
    },
    uuidv4 () {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (
          c ^
          (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16)
      )
    },
    onAddNewProject (name) {
      this.showAdd = false
      const title = name.trim()
      if (title) {
        // добавляем новый проект и переходим в него
        const maxOrder =
          this.project?.children?.reduce(
            (maxOrder, child) =>
              child.order > maxOrder ? child.order : maxOrder,
            0
          ) ?? 0
        const user = this.$store.state.user.user

        const project = {
          uid: this.uuidv4(),
          name: title,
          uid_parent: this.project?.uid ?? '00000000-0000-0000-0000-000000000000',
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
        console.log(`create project uid: ${project.uid}`, project)

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
    onDeleteProject () {
      this.showDeleteProject = false
      //
      this.$store.dispatch(REMOVE_PROJECT_REQUEST, this.projectUid)
        .then(() => {
          this.$store.dispatch('asidePropertiesToggle', false)
          this.$router.push(this.project.uid_parent === '00000000-0000-0000-0000-000000000000' ? '/project' : '/project/' + this.project.uid_parent)
          this.$store.commit(SELECT_PROJECT, undefined)
          //
          this.$store.commit(NAVIGATOR_REMOVE_PROJECT, this.project)
          // для актуального значения количества проектов
          this.$store.commit(REMOVE_PROJECT_REQUEST, this.projectUid)
          //
        })
    },
    clickCompletedTasks () {
      this.$emit('toggleCompletedTasks')
    },
    quitProject () {
      this.showConfirmQuit = false
      this.$store.dispatch(PROJECT.QUIT_PROJECT_REQUEST, {
        uid: this.projectUid,
        value: this.$store.state.user.user.current_user_email
      })
        .then((resp) => {
          console.log('quitProject', resp)
          this.$store.dispatch('asidePropertiesToggle', false)
          this.$store.commit(NAVIGATOR_REMOVE_PROJECT, this.project)
          this.$store.commit(PROJECT.REMOVE_PROJECT_REQUEST, this.project.uid)
          this.$router.push('/project')
        })
    }
  }
}
</script>

<style scoped>

</style>
