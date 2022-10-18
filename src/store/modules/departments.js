import {
  NAVIGATOR_PUSH_DEPARTAMENT,
  NAVIGATOR_REMOVE_DEPARTAMENT
} from '@/store/actions/navigator'
import axios from 'axios'
import * as DEPARTMENTS from '../actions/departments'

const getDefaultState = () => {
  return {
    deps: {},
    selectedDepartment: null
  }
}

const state = getDefaultState()

const getters = {
  sortedDepartments (state) {
    const deps = Object.values(state.deps)
    deps.sort((item1, item2) => {
      // сначала по порядку
      if (item1.order > item2.order) return 1
      if (item1.order < item2.order) return -1
      // если одинаковый, то по имени
      if (item1.name > item2.name) return 1
      if (item1.name < item2.name) return -1
      return 0
    })
    return deps
  }
}

const actions = {
  [DEPARTMENTS.CREATE_DEPARTMENT_REQUEST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_LEADERTASK_API + 'api/v1/dep'
      axios({ url: url, method: 'POST', data: data })
        .then((resp) => {
          // сохрянем ответ - теперь у нас есть такой отдел
          commit(DEPARTMENTS.PUSH_DEPARTMENT, resp.data)
          // добавляем его в навигатор
          commit(NAVIGATOR_PUSH_DEPARTAMENT, [resp.data])
          //
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [DEPARTMENTS.UPDATE_DEPARTMENT_REQUEST]: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_LEADERTASK_API + 'api/v1/dep'
      axios({ url: url, method: 'PATCH', data: data })
        .then((resp) => {
          commit(DEPARTMENTS.PUSH_DEPARTMENT, data)
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  [DEPARTMENTS.REMOVE_DEPARTMENT_REQUEST]: ({ commit, dispatch }, uid) => {
    return new Promise((resolve, reject) => {
      const url = process.env.VUE_APP_LEADERTASK_API + 'api/v1/dep?uid=' + uid
      axios({ url: url, method: 'DELETE' })
        .then((resp) => {
          commit('RemoveDepartment', uid)
          commit(NAVIGATOR_REMOVE_DEPARTAMENT, uid)
          resolve(resp)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
}

const mutations = {
  [DEPARTMENTS.PUSH_DEPARTMENT]: (state, department) => {
    state.deps[department.uid] = department
  },
  [DEPARTMENTS.SELECT_DEPARTMENT]: (state, department) => {
    state.selectedDepartment = department
  },
  [DEPARTMENTS.RESET_DEPARTMENTS_STATE]: (state) => {
    Object.assign(state, getDefaultState())
  },
  RemoveDepartment: (state, uid) => {
    delete state.deps[uid]
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
