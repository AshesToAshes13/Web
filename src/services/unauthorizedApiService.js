import axios from 'axios'

const url = process.env.VUE_APP_LEADERTASK_API

class UnautorizedApi {
  async validateEmail (email) {
    const res = await axios.get(`${url}api/v1/users/exists?email=${email}`)
    return res.data
  }

  async collectError (uidUser, msg, urlFile, line, column) {
    if (uidUser) {
      try {
        const res = await axios.post(`${url}api/v1/errors/front`, {
          uid_user: uidUser,
          msg: msg,
          url: urlFile || 'https://web',
          line: line,
          column: column
        })
        return res.data
      } catch (e) {}
    }
  }

  async auth (email, password) {
    const encodedPassword = encodeURIComponent(password)
    const res = await axios.post(
      `${url}api/v1/users/auth?login=${email}&password=${encodedPassword}&system=web&type_device=web`
    )
    return res.data
  }

  async authByGoogle (token, cid) {
    const res = await axios.post(`${url}api/v1/tokens/bygoogle`, {
      token: token,
      system: 'web',
      language: 'russian',
      type_device: 'web',
      cid: cid || 'webnew'
    })
    return res.data
  }
}

const unautorizedApi = new UnautorizedApi()

export default unautorizedApi
