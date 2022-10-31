import { setLocalStorageItem } from '@/store/helpers/functions'

export function getUserToken () {
  return localStorage.getItem('user-token') || ''
}

export function initAuthorization (axios) {
  const token = getUserToken()
  if (token) {
    if (axios.defaults.headers.common.Authorization !== token) {
      axios.defaults.headers.common.Authorization = token
      if (process.env.VUE_APP_EXTENDED_LOGS) {
        console.log(
          'set axios authorization',
          axios.defaults.headers.common.Authorization
        )
      }
    }
  } else if (axios.defaults.headers.common.Authorization) {
    delete axios.defaults.headers.common.Authorization
    if (process.env.VUE_APP_EXTENDED_LOGS) {
      console.log('clear axios authorization')
    }
  }
}

export function removeUserToken (axios) {
  localStorage.removeItem('user-token')
  localStorage.removeItem('user-refresh-token')
  initAuthorization(axios)
}

export function setUserToken (axios, userToken, userRefreshToken) {
  setLocalStorageItem('user-token', userToken)
  setLocalStorageItem('user-refresh-token', userRefreshToken)
  initAuthorization(axios)
}
