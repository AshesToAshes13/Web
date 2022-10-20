import store from '@/store/index.js'

export function createIntegration (obj) {
  store.state.corpYandexIntegration.isIntegrated = true
  store.state.corpYandexIntegration.login = obj.obj.ya_login
  store.state.corpYandexIntegration.password = obj.obj.ya_password
}

export function removeIntegration () {
  store.state.corpYandexIntegration.isIntegrated = false
  store.state.corpYandexIntegration.login = null
  store.state.corpYandexIntegration.password = null
}
