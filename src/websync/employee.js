import store from '@/store/index.js'
import { NAVIGATOR_PUSH_EMPLOYEE, NAVIGATOR_REMOVE_EMPLOYEE, NAVIGATOR_UPDATE_EMPLOYEE } from '@/store/actions/navigator'
import * as EMPLOYEE from '@/store/actions/employees'

export function createEmployee (obj) {
  store.commit(NAVIGATOR_PUSH_EMPLOYEE, [obj.obj])
}

export function removeEmployee (uid) {
  store.commit(NAVIGATOR_REMOVE_EMPLOYEE, { uid: uid })
  if (uid === store.state.user.user.current_user_uid) {
    location.reload()
  }
}

export function updateEmployee (obj) {
  store.dispatch(NAVIGATOR_UPDATE_EMPLOYEE, obj.obj)
  if (obj.obj.uid === store.state.employees.selectedEmployee.uid) {
    store.commit(EMPLOYEE.SELECT_EMPLOYEE, obj.obj)
  }
}
