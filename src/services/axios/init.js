import { initAuthorization } from '@/services/axios/authorization.js'
import interceptors from '@/services/axios/interceptors.js'

export default function initAxios (axios) {
  initAuthorization(axios)
  interceptors(axios)
}
