import axios from 'axios'
import Notifications, { notify } from 'notiwind'
import { createApp } from 'vue'
import linkify from 'vue-linkify'
import vue3GoogleLogin from 'vue3-google-login'
import App from './App.vue'
import router from './router'
import store from './store'

import './css/main.css'

const token = localStorage.getItem('user-token')
const isGridView = JSON.parse(localStorage.getItem('isGridView'))
const clickedOffer = localStorage.getItem('clicked-offer') || ''

function pad2 (n) {
  return (n < 10 ? '0' : '') + n
}

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    if (store.state.navigator.submenu.status === true) {
      store.state.navigator.submenu.status = false
      return
    }
    store.dispatch('asidePropertiesToggle', false)
  }
})

const chosenDate = new Date()
const month = pad2(chosenDate.getMonth() + 1)
const day = pad2(chosenDate.getDate())
const year = chosenDate.getFullYear()
const formattedDate = day + '-' + month + '-' + year
let isRefreshNow = false
axios.defaults.headers.common.LocalDate = formattedDate

if (token) {
  axios.defaults.headers.common.Authorization = token
  if (process.env.VUE_APP_EXTENDED_LOGS) {
    console.log(
      'set axios authorization',
      axios.defaults.headers.common.Authorization
    )
  }
}

// Add a response interceptor
axios.interceptors.response.use(
  (resp) => resp,
  function (error) {
    const errorMessage =
      error?.response?.data.message ||
      error?.response?.data.error ||
      error?.message ||
      error?.code
    const method = error?.config?.method || ''
    const url = (error?.config?.url || '')
      .replace(process.env.VUE_APP_LEADERTASK_API, 'leadertask/')
      .replace(process.env.VUE_APP_INSPECTOR_API, 'inspector/')
    const requestUrl = `${method ? method.toUpperCase() + ' ' : ''}${url}`

    const avoidedErrorMessages = [
      'old_password invalid',
      "in user's org present employees",
      'the employee is the director of the organization',
      'the employee is already present in this organization',
      'limit. invalid license.',
      'Request aborted'
    ]
    if (typeof errorMessage === 'string') {
      if (errorMessage === 'canceled') return
      //
      if (
        errorMessage.includes('invalid token') ||
        errorMessage.includes('token expired')
      ) {
        if (isRefreshNow) {
          return
        }
        isRefreshNow = true
        store
          .dispatch('AUTH_REFRESH_TOKEN')
          .then(() => {
            window.location.reload()
          })
          .catch(() => {
            if (store.getters.isAuthenticated) {
              store.dispatch('AUTH_LOGOUT')
            }
          })
          .finally(() => {
            isRefreshNow = false
          })
        return
      }
      if (!avoidedErrorMessages.includes(errorMessage)) {
        const text = `${
          requestUrl ? '<' + requestUrl + '>: ' : ''
        }${errorMessage}`
        console.log('REST API Error', text, { ...error })
        notify(
          {
            group: 'api',
            title: 'REST API Error, please make screenshot',
            action: '',
            text: text.trim()
          },
          15000
        )
      }
    } else {
      console.log('REST API Error (other)', { ...error })
    }
    return Promise.reject(error)
  }
)

store.commit('basic', { key: 'isGridView', value: isGridView })
store.commit('SET_CLICK_OFFER', clickedOffer)

/* Default title tag */
const defaultDocumentTitle = 'Leadertask 2.0'

/* Collapse mobile aside menu on route change */
router.beforeEach((to, from) => {
  store.dispatch('asidePropertiesToggle', false)
})

router.afterEach((to) => {
  /* Set document title from route meta */
  if (to.meta && to.meta.title) {
    document.title = `${to.meta.title} — ${defaultDocumentTitle}`
  } else {
    document.title = defaultDocumentTitle
  }

  /* Full screen mode */
  store.dispatch('fullScreenToggle', !!to.meta.fullScreen)
})

/* On error send error to Alex's server  */
window.onerror = function (msg, url, lineNo, columnNo, error) {
  if (msg.indexOf('callback is not a function') !== -1) {
    return
  }
  if (msg === 'NetworkError') {
    return
  }
  if (!url) {
    url = 'https://web'
  }
  const data = {
    msg: msg,
    url: url,
    line: lineNo,
    column: columnNo
  }
  if (axios.defaults.headers.common.Authorization) {
    axios({
      url: process.env.VUE_APP_LEADERTASK_API + 'api/v1/errors/front',
      method: 'POST',
      data: data
    })
  }
}

createApp(App)
  .use(store)
  .use(router)
  .use(vue3GoogleLogin, {
    clientId:
      '770584674672-8vif3lutuhc786suh8vuomht37t1uah8.apps.googleusercontent.com'
  })
  .use(Notifications)
  .directive('linkified', linkify)
  .mount('#app')
