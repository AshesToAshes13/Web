import axios from 'axios'
import * as PROJECT from '../actions/projects'
import { visitChildren } from '@/store/helpers/functions'

const getDefaultState = () => {
  return {
    projects: {},
    selectedProject: undefined
  }
}

const state = getDefaultState()
const getters = {
  favoriteProjects (state) {
    const arr = []
    const projects = state.projects
    Object.keys(projects).forEach(key => {
      if (projects[key].favorite === 1) {
        arr.push(projects[key])
      }
    })

    return arr.sort((project1, project2) => { return project1.name.localeCompare(project2.name) })
  },
  privateProjects (state, getters, rootState) {
    return rootState.navigator.navigator?.new_private_projects[0].items ?? []
  },
  commonProjects (state, getters, rootState) {
    return rootState.navigator.navigator?.new_private_projects[1].items ?? []
  },
  /**
   * @typedef {Object} DepartmentsProject
   * @property {string} UID - id отдела
   * @property {string} name - название отдела
   * @property {number} order - порядок отдела
   * @property {Array} emails - емейлы сотрудников отдела
   * @property {Array} projects - проекты отдела
   */
  /**
   * @return {DepartmentsProject} Отделы с проектами, которые им доступны
   */
  departmentsProjects (state, getters, rootState, rootGetters) {
    return rootGetters.sortedDepartments
      .filter((department) => {
        // Оставляем только отдел пользователя
        return rootState.employees.employees[rootState.user.user.current_user_uid].uid_dep === department.uid
      })
      .map((department) => {
        const departmentProjects = getters.commonProjects.filter((project) => {
          return project.deps.includes(department.uid)
        })

        return {
          ...department,
          projects: departmentProjects
        }
      })
  }
}

const actions = {
  [PROJECT.CREATE_PROJECT_REQUEST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_LEADERTASK_API + 'api/v1/projects'
      axios({ url: url, method: 'POST', data: data })
        .then((resp) => {
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [PROJECT.CHANGE_PROJECT_NAME]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const project = state.projects[data.projectUid]
      if (!project) { return reject(new Error(`not find project ${data.projectUid}`)) }
      project.name = data.newProjectTitle
      dispatch(PROJECT.UPDATE_PROJECT_REQUEST, project)
        .then((resp) => {
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [PROJECT.CHANGE_PROJECT_COLOR]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const project = state.projects[data.projectUid]
      if (!project) { return reject(new Error(`not find project ${data.projectUid}`)) }
      project.color = data.newProjectColor
      dispatch(PROJECT.UPDATE_PROJECT_REQUEST, project)
        .then((resp) => {
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [PROJECT.CHANGE_PROJECT_MEMBERS]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const project = state.projects[data.projectUid]
      if (!project) { return reject(new Error(`not find project ${data.projectUid}`)) }
      project.members = data.newProjectMembers
      dispatch(PROJECT.UPDATE_PROJECT_REQUEST, project)
        .then((resp) => {
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [PROJECT.CHANGE_PROJECT_DEPS]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const project = state.projects[data.projectUid]
      if (!project) { return reject(new Error(`not find project ${data.projectUid}`)) }
      project.deps = data.newDeps
      console.log(project)
      dispatch(PROJECT.UPDATE_PROJECT_REQUEST, project)
        .then((resp) => {
          resolve(resp)
        })
        .catch((err) => {
          console.log(err)
          reject(err)
        })
    })
  },
  [PROJECT.UPDATE_PROJECT_REQUEST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_LEADERTASK_API + 'api/v1/projects'
      axios({ url: url, method: 'PATCH', data: data })
        .then((resp) => {
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [PROJECT.REMOVE_PROJECT_REQUEST]: ({ commit, dispatch }, uid) => {
    return new Promise((resolve, reject) => {
      const url =
        process.env.VUE_APP_LEADERTASK_API + 'api/v1/projects?uid=' + uid
      axios({ url: url, method: 'DELETE' })
        .then((resp) => {
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [PROJECT.QUIT_PROJECT_REQUEST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url =
        process.env.VUE_APP_LEADERTASK_API +
        'api/v1/projects/exit?uid=' +
        data.uid +
        '&email=' +
        data.value
      axios({ url: url, method: 'POST' })
        .then((resp) => {
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [PROJECT.ADD_PROJECT_TO_FAVORITE]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      dispatch(PROJECT.UPDATE_PROJECT_REQUEST, { ...data, favorite: 1 })
        .then((resp) => {
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [PROJECT.REMOVE_PROJECT_FROM_FAVORITE]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      dispatch(PROJECT.UPDATE_PROJECT_REQUEST, { ...data, favorite: 0 })
        .then((resp) => {
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
}

const mutations = {
  [PROJECT.REMOVE_PROJECT_REQUEST]: (state, uid) => {
    visitChildren([state.projects[uid]], value => (delete state.projects[value.uid]))
    delete state.projects[uid]
  },
  [PROJECT.PUSH_PROJECT]: (state, projects) => {
    for (const project of projects) {
      state.projects[project.uid] = project
    }
  },
  [PROJECT.SELECT_PROJECT]: (state, project) => {
    state.selectedProject = project
  },
  [PROJECT.RESET_STATE_PROJECT]: (state) => {
    Object.assign(state, getDefaultState())
  }
}
export default {
  state,
  getters,
  actions,
  mutations
}
