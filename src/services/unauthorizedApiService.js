import axios from 'axios'

const url = process.env.VUE_APP_LEADERTASK_API

class UnautorizedApi {
  async validateEmail (email) {
    const res = await axios.get(`${url}api/v1/users/exists?email=${email}`)
    return res.data
  }
}

const unautorizedApi = new UnautorizedApi()

export default unautorizedApi
