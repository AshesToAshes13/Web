import store from '@/store/index.js'
import * as REGLAMENT from '@/store/actions/reglaments'
import router from '@/router'

const shouldDoAnything = (reglamentUid) => router.currentRoute.value.fullPath === `/reglaments/${reglamentUid}`

export function createReglamentAnswer (obj) {
  if (shouldDoAnything(obj.obj.uid_reglament)) {
    store.commit(REGLAMENT.REGLAMENT_PUSH_ANSWER, obj.obj)
  }
}

export function deleteReglamentAnswer (obj) {
  store.commit(REGLAMENT.REGLAMENT_DELETE_ANSWER, obj.obj) // second param is answer uuid
}

export function updateReglamentAnswer (obj) {
  if (shouldDoAnything(obj.obj.uid_reglament)) {
    if (obj.obj.is_passed && router.currentRoute.value.params.id === obj.obj.uid_reglament) {
      store.commit(REGLAMENT.UPDATE_ADD_USERS_REGLAMENT_PASSED, obj.obj)
    }
    store.commit(REGLAMENT.REGLAMENT_UPDATE_ANSWER_NAME, obj.obj)
  }
}
