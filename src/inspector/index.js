import {
  getInspectorMessage,
  isKnownInspectorMessageType
} from '@/inspector/message.js'
import router from '@/router/index.js'
import { showNotify } from '@/store/helpers/functions'
import store from '@/store/index.js'
import { createTaskMessage } from '@/websync/task_message.js'
import { computed } from 'vue'

import processCreate from '@/websync/create.js'
import processRemove from '@/websync/remove.js'
import * as TYPES from '@/websync/types.js'
import processUpdate from '@/websync/update.js'

/**
 * @type {WebSocket | undefined}
 */
let socket
/**
 * @type {boolean}
 */
let isSocketForceClosed = false

const user = computed(() => store.state.user.user)

const employees = computed(() => store.state.employees.employees)

function isNotificationSoundOn () {
  return store?.state?.inspector?.is_notification_sound_on
}

function parseObject (obj) {
  switch (obj.operation) {
    case TYPES.TYPE_OPERATION_CREATE:
      processCreate(obj)
      break
    case TYPES.TYPE_OPERATION_REMOVE:
      processRemove(obj)
      break
    case TYPES.TYPE_OPERATION_UPDATE:
      processUpdate(obj)
      break
  }
}
export function initInspectorSocket (force = false) {
  if (socket && socket.readyState !== WebSocket.CLOSED && !force) return
  if (socket && socket.readyState !== WebSocket.CLOSED) socket.close()

  isSocketForceClosed = false
  socket = new WebSocket(process.env.VUE_APP_INSPECTOR_WS)
  socket.onopen = function () {
    const auth = {
      type: 'auth',
      message: user.value.current_user_uid,
      data: user.value.current_user_email,
      organization: user.value.owner_email,
      token: localStorage.getItem('user-token'),
      employee: JSON.stringify(employees.value[user.value.current_user_uid])
    }
    socket.send(JSON.stringify(auth))

    if (
      router.currentRoute.value.name === 'boardWithChildren' &&
      router.currentRoute.value.params.board_id
    ) {
      const data = {
        type: 'boardOnline',
        uid_user: store.state.user.user.current_user_uid,
        uid_board: router.currentRoute.value.params.board_id
      }
      socket.send(JSON.stringify(data))
    }

    console.log('inspector connected success')
  }
  socket.onmessage = function (event) {
    if (process.env.VUE_APP_EXTENDED_LOGS) {
      console.log('inspector obj', event.data)
    }
    parseMessage(event.data)
  }
  socket.onclose = function () {
    setTimeout(function () {
      !isSocketForceClosed && initInspectorSocket()
    }, 1000)
  }
  socket.onerror = function (e) {
    socket.close()
  }
}

function parseMessage (data) {
  try {
    const parsedData = { ...JSON.parse(data) }

    if (parsedData?.uid_json) {
      createNotificationAndInspectorMessage(parsedData)
    } else if (
      ['userOnline', 'boardOnline', 'cardOnline'].includes(parsedData.type)
    ) {
      updateOnline(parsedData)
    }

    if (typeof parsedData?.type === 'number') {
      parseObject(parsedData)
    }
  } catch (e) {
    console.log('parseMessage inspector error', e)
  }
}

function updateOnline (message) {
  switch (message.type) {
    case 'userOnline':
      store.commit('ChangeUserOnline', {
        uidUser: message.uid_user,
        online: message.online
      })
      break
    case 'boardOnline':
      store.commit('ChangeUserOnlineBoard', {
        uidUser: message.uid_user,
        onlineBoardUid: message.uid_board
      })
      break
    case 'cardOnline':
      store.commit('ChangeUserOnlineBoard', {
        uidUser: message.uid_user,
        onlineBoardUid: message.uid_board
      })
      store.commit('ChangeUserOnlineCard', {
        uidUser: message.uid_user,
        onlineCardUid: message.uid_card
      })
      break
  }
}

function createNotificationAndInspectorMessage (parsedData) {
  if (!isKnownInspectorMessageType(parsedData.message)) {
    return
  }

  showNotify(
    {
      uid: parsedData?.uid_json,
      group: 'inspector',
      title: 'Инспектор',
      text: getInspectorMessage(parsedData.message, parsedData.task.taskJson),
      task: parsedData.task.taskJson
    },
    isNotificationSoundOn()
  )

  // Creating inspector message from notification
  parsedData.message_obj.uid_creator = 'inspector' // Let chat know it is message from inspector
  parsedData.message_obj.date_create = parsedData.message_obj.creation_date
  const message = {
    uid_task: parsedData.task.taskJson.uid,
    obj: parsedData.message_obj
  }
  createTaskMessage(message)
}

export function disconnectInspectorSocket () {
  isSocketForceClosed = true
  socket.close()
  console.log('inspector disconnected success')
}

export function sendInspectorMessage (message) {
  try {
    if (socket?.readyState !== WebSocket.CLOSED) {
      socket.send(JSON.stringify(message))
    }
  } catch (e) {
    console.log('sendInspectorMessage error', e, message)
  }
}
