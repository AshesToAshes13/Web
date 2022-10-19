import store from '@/store/index.js'
import * as TYPES from '@/websync/types.js'
import { computed } from 'vue'

import processCreate from '@/websync/create.js'
import processRemove from '@/websync/remove.js'
import processUpdate from '@/websync/update.js'

import { sendInspectorMessage } from '@/inspector'

const storeNavigator = computed(() => store.state.navigator.navigator)

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

export function initWebSync () {
  const clientProperty = 'client'
  const websync = window?.fm?.websync

  if (!websync) {
    setTimeout(() => initWebSync(), 2500)
    console.log('initWebSync - websync is not loaded, try reconnect...')
    return
  }
  const client = new websync[clientProperty](
    process.env.VUE_APP_SYNC_LEADERTASK_API +
      'websync.ashx?uid_session=' +
      storeNavigator.value.push_channel
  )
  websync.currentClient = client
  // client в перемунную и в функции использовать
  client.connect({
    onSuccess: function (e) {},
    onFailure: function (e) {
      console.log('websync could not connect: ' + e.getException().message)
    },
    onStreamFailure: function (e) {
      console.log(
        'websync network problems: ' +
          e.getErrorMessage() +
          (e.getRetry() ? ' Will' : ' Will not') +
          ' reconnect.'
      )
    }
  })

  client.subscribe({
    channel: '/' + storeNavigator.value.push_channel,
    onSuccess: function (e) {
      console.log('websync connected success')
    },
    onFailure: function (e) {
      console.log('websync could not subscribe' + e.getException().message)
      e.setRetry(true)
    },
    onReceive: function (e) {
      try {
        const str = e.getDataJson()
        // делаем копирование объекта, потому что
        // никак не получить доступ к полю obj.obj.type
        // возвращает не то что там записано
        const obj = { ...JSON.parse(str) }
        if (process.env.VUE_APP_EXTENDED_LOGS) console.log('websync obj', obj)

        if (
          obj.type === TYPES.TYPE_OBJECT_CARD &&
          obj.operation === TYPES.TYPE_OPERATION_UPDATE
        ) {
          sendInspectorMessage(obj)
        } else {
          parseObject(obj)
        }
      } catch (e) {
        console.log('websync onReceive catch error', e)
      }
    }
  })

  // вставляем магию - если не сделать то WebSync падает при дисконнекте
  client.raiseUnsubscribeSuccess = function (e) {}
}

export function disconnectWebSync () {
  if (window?.fm?.websync?.currentClient) {
    window.fm.websync.currentClient.disconnect()
    delete window.fm.websync.currentClient
  }
}
