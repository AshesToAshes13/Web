import * as SLIDES from '@/store/actions/slides.js'

function getCurrDateTimeString () {
  const date = new Date()
  const year = String(date.getFullYear()).padStart(4, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
}

const state = {
  slides: [
    {
      uid: 'doitnowstart',
      name: 'doitnowstart',
      mode: 'slide',
      visible:
        JSON.parse(localStorage.getItem('slides'))?.doitnowstart?.visible ??
        true,
      reminder:
        JSON.parse(localStorage.getItem('slides'))?.doitnowstart?.reminder ??
        getCurrDateTimeString()
    },
    {
      uid: 'addEmployees',
      name: 'addEmployees',
      mode: 'slide',
      visible:
        JSON.parse(localStorage.getItem('slides'))?.addEmployees?.visible ??
        true,
      reminder:
        JSON.parse(localStorage.getItem('slides'))?.addEmployees?.reminder ??
        getCurrDateTimeString()
    },
    {
      uid: 'delegateTasks',
      name: 'delegateTasks',
      mode: 'slide',
      visible:
        JSON.parse(localStorage.getItem('slides'))?.delegateTasks?.visible ??
        true,
      reminder:
        JSON.parse(localStorage.getItem('slides'))?.delegateTasks?.reminder ??
        getCurrDateTimeString()
    },
    {
      uid: 'addAvatar',
      name: 'addAvatar',
      mode: 'slide',
      visible:
        JSON.parse(localStorage.getItem('slides'))?.addAvatar?.visible ?? true,
      reminder:
        JSON.parse(localStorage.getItem('slides'))?.addAvatar?.reminder ??
        getCurrDateTimeString()
    }
  ]
}

const actions = {}

const mutations = {
  [SLIDES.CHANGE_VISIBLE]: (state, value) => {
    for (let i = 0; i < state.slides.length; i++) {
      if (state.slides[i].name === value.name) {
        const dateStr = getCurrDateTimeString()
        // сохраняем в стейт
        state.slides[i].visible = value.visible
        state.slides[i].reminder = value.reminder || dateStr
        // сохраняем в стору
        let data = {}
        try {
          data = JSON.parse(localStorage.getItem('slides'))
          data[value.name].visible = value.visible
          data[value.name].reminder = value.reminder || dateStr
        } catch (e) {
          data = {
            doitnowstart: {
              visible: true,
              reminder: dateStr
            },
            addEmployees: {
              visible: true,
              reminder: dateStr
            },
            delegateTasks: {
              visible: true,
              reminder: dateStr
            },
            addAvatar: {
              visible: true,
              reminder: dateStr
            }
          }
          data[value.name].visible = value.visible
          data[value.name].reminder = value.reminder || dateStr
        }
        localStorage.setItem('slides', JSON.stringify(data))
      }
    }
  }
}

export default {
  state,
  actions,
  mutations
}
