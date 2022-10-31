import initAxios from '@/services/axios/init.js'
import axios from 'axios'
import Notifications, { notify } from 'notiwind'
import { createApp } from 'vue'
import linkify from 'vue-linkify'
import vue3GoogleLogin from 'vue3-google-login'
import App from './App.vue'
import router from './router'
import store from './store'

import './css/main.css'

const isGridView = JSON.parse(localStorage.getItem('isGridView'))
const clickedOffer = localStorage.getItem('clicked-offer') || ''

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    if (store.state.navigator.submenu.status === true) {
      store.state.navigator.submenu.status = false
      return
    }
    store.dispatch('asidePropertiesToggle', false)
  }
})

initAxios(axios)

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

window.addEventListener('unhandledrejection', (event) => {
  // ловим не обработанные исключения от axios
  if (event?.reason?.isAxiosError) {
    const errorMessage =
      event.reason.response?.data.message ||
      event.reason?.response?.data.error ||
      event.reason?.message ||
      event.reason?.code
    const method = event.reason?.config?.method || ''
    const url = (event.reason?.config?.url || '')
      .replace(process.env.VUE_APP_LEADERTASK_API, 'leadertask/')
      .replace(process.env.VUE_APP_INSPECTOR_API, 'inspector/')
    const requestUrl = `${method ? method.toUpperCase() + ' ' : ''}${url}`

    const avoidedErrorMessages = ['Request aborted', 'canceled']
    if (typeof errorMessage === 'string') {
      if (!avoidedErrorMessages.includes(errorMessage)) {
        const text = `${
          requestUrl ? '<' + requestUrl + '>: ' : ''
        }${errorMessage}`
        console.log('REST API Error', text, { ...event.reason })
        notify(
          {
            group: 'api',
            title: 'REST API Error, please make screenshot',
            action: '',
            text: text.trim()
          },
          15000
        )
      } else {
        event.preventDefault()
      }
    } else {
      console.log('REST API Error (other)', { ...event.reason })
    }
  }
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
