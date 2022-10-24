import { showNotify } from '@/store/helpers/functions'
import store from '@/store/index.js'
import { createCard } from '@/websync/card.js'
import { createReglament } from '@/websync/reglaments.js'
import { createReglamentQuestion } from '@/websync/reglament_question'
import { createReglamentAnswer } from '@/websync/reglament_answer'
import { createCardMessage } from '@/websync/card_message.js'
import { createIntegration } from '@/websync/yandexCorpInt.js'
import { createMegafonIntegration } from '@/websync/megafonCorpInt.js'
import { createColor } from '@/websync/colors_dop.js'
import { createEmployee } from '@/websync/employee.js'
import { createProject } from '@/websync/project.js'
import { createTag } from '@/websync/tag.js'
import { createTask } from '@/websync/task.js'
import { createTaskMessage } from '@/websync/task_message.js'
import { createInvite } from '@/websync/invite.js'
import * as TYPES from '@/websync/types.js'
import { createDepartment } from '@/websync/departments'
import { addBoard } from '@/websync/board'
import { createClient } from '@/websync/clients'
import { createMessage } from '@/websync/clients_chat'

function currentUserUid () {
  return store?.state?.user?.user?.current_user_uid
}

function isNotificationSoundOn () {
  return store?.state?.inspector?.is_notification_sound_on
}

function currentUserEmail () {
  return store?.state?.user?.user?.current_user_email
}

export default function processCreate (obj) {
  switch (obj.type) {
    case TYPES.TYPE_OBJECT_REGLAMENT:
      createReglament(obj)
      break
    case TYPES.TYPE_OBJECT_REGLAMENT_QUESTION:
      createReglamentQuestion(obj)
      break
    case TYPES.TYPE_OBJECT_REGLAMENT_ANSWER:
      createReglamentAnswer(obj)
      break
    case TYPES.TYPE_OBJECT_TAG:
      createTag(obj)
      break
    case TYPES.TYPE_OBJECT_PROJECT:
      if (obj.obj.email_creator !== currentUserEmail()) {
        showNotify(
          {
            uid: obj.uid_json,
            group: 'top',
            title: 'Новый проект',
            obj: obj,
            text: obj.obj.name
          },
          isNotificationSoundOn()
        )
      }
      createProject(obj)
      break
    case TYPES.TYPE_OBJECT_TASK:
      if (
        obj.obj.uid_customer !== currentUserUid() &&
        obj.obj.email_performer === currentUserEmail()
      ) {
        showNotify(
          {
            uid: obj.uid_json,
            group: 'top',
            title: 'Новое поручение',
            obj: obj,
            text: obj.obj.name.length > 25 ? obj.obj.name.substring(0, 25) + '...' : obj.obj.name
          },
          isNotificationSoundOn()
        )
      }
      createTask(obj)
      break
    case TYPES.TYPE_OBJECT_CONTACT:
      break
    case TYPES.TYPE_OBJECT_CONTACT_GROUP:
      break
    case TYPES.TYPE_OBJECT_CONTACT_COMMUNICATION:
      break
    case TYPES.TYPE_OBJECT_GROUP:
      break
    case TYPES.TYPE_OBJECT_FILTER:
      break
    case TYPES.TYPE_OBJECT_MARKER:
      createColor(obj)
      break
    case TYPES.TYPE_OBJECT_YANDEX_CORP_INT:
      createIntegration(obj)
      break
    case TYPES.TYPE_OBJECT_MEGAFON_CORP_INT:
      createMegafonIntegration(obj)
      break
    case TYPES.TYPE_OBJECT_PERIOD:
      break
    case TYPES.TYPE_OBJECT_PROJECT_MEMBER:
      break
    case TYPES.TYPE_OBJECT_TASK_FILE:
      createTaskMessage(obj)
      break
    case TYPES.TYPE_OBJECT_TASK_MSG:
      createTaskMessage(obj)
      break
    case TYPES.TYPE_OBJECT_TASK_TAG:
      break
    case TYPES.TYPE_OBJECT_GROUP_MEMBER:
      break
    case TYPES.TYPE_OBJECT_LABEL:
      break
    case TYPES.TYPE_OBJECT_TASK_LABEL:
      break
    case TYPES.TYPE_OBJECT_FILE:
      break
    case TYPES.TYPE_OBJECT_EMP:
      createEmployee(obj)
      break
    case TYPES.TYPE_OBJECT_CONTACT_FILE:
      break
    case TYPES.TYPE_OBJECT_CONTACT_FOTO:
      break
    case TYPES.TYPE_OBJECT_USER_GROUP:
      createDepartment(obj)
      break
    case TYPES.TYPE_OBJECT_INVITE:
      createInvite(obj)
      break
    case TYPES.TYPE_OBJECT_NOTIFICATION:
      break
    case TYPES.TYPE_OBJECT_BOARD:
      addBoard(obj.obj)
      break
    case TYPES.TYPE_OBJECT_CARD:
      createCard(obj)
      break
    case TYPES.TYPE_OBJECT_CARD_FILE:
      createCardMessage(obj)
      break
    case TYPES.TYPE_OBJECT_CARD_MSG:
      createCardMessage(obj)
      break
    case TYPES.TYPE_OBJECT_CLIENT:
      createClient(obj)
      break
    case TYPES.TYPE_OBJECT_CLIENT_FILE:
      break
    case TYPES.TYPE_OBJECT_CLIENT_MSG:
      createMessage(obj)
      break
    case TYPES.TYPE_OBJECT_CLIENT_EXT_FIELD:
      break
    case TYPES.TYPE_OBJECT_LOCALIZE:
      break
    case TYPES.TYPE_OBJECT_OPTIONS:
      break
  }
}
