import store from '@/store'

let isRefreshNow = false

const chosenDate = new Date()
const year = String(chosenDate.getFullYear()).padStart(4, '0')
const month = String(chosenDate.getMonth() + 1).padStart(2, '0')
const day = String(chosenDate.getDate()).padStart(2, '0')

function setLocalDateHeader (req) {
  req.headers.LocalDate = `${day}-${month}-${year}`
  return req
}

function onError (error) {
  const errorMessage =
    error?.response?.data.message ||
    error?.response?.data.error ||
    error?.message ||
    error?.code

  if (typeof errorMessage === 'string') {
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
  }
  return Promise.reject(error)
}

export default function interceptors (axios) {
  axios.interceptors.request.use(setLocalDateHeader)
  axios.interceptors.response.use((resp) => resp, onError)
}
