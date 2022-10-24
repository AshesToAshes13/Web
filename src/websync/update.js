import { updateBoard } from '@/websync/board'
import { updateCard } from '@/websync/card.js'
import { removeCardMessage } from '@/websync/card_message'
import { updateColor } from '@/websync/colors_dop'
import { updateDepartment } from '@/websync/departments'
import { updateEmployee } from '@/websync/employee.js'
import { updateProject } from '@/websync/project.js'
import { updateReglament } from '@/websync/reglaments.js'
import { updateReglamentAnswer } from '@/websync/reglament_answer'
import { updateReglamentQuestion } from '@/websync/reglament_question'
import { updateTag } from '@/websync/tag'
import { updateTask } from '@/websync/task.js'
import { removeTaskMessage } from '@/websync/task_message'
import * as TYPES from '@/websync/types.js'
import { updateCurrentUser } from '@/websync/user.js'
import { updateClient } from '@/websync/clients.js'
import { updateMegafonIntegration } from './megafonCorpInt'

export default function processUpdate (obj) {
  switch (obj.type) {
    case TYPES.TYPE_OBJECT_REGLAMENT:
      updateReglament(obj)
      break
    case TYPES.TYPE_OBJECT_REGLAMENT_QUESTION:
      updateReglamentQuestion(obj)
      break
    case TYPES.TYPE_OBJECT_REGLAMENT_ANSWER:
      updateReglamentAnswer(obj)
      break
    case TYPES.TYPE_OBJECT_TAG:
      updateTag(obj)
      break
    case TYPES.TYPE_OBJECT_PROJECT:
      updateProject(obj)
      break
    case TYPES.TYPE_OBJECT_TASK:
      updateTask(obj)
      break
    case TYPES.TYPE_OBJECT_CONTACT:
      break
    case TYPES.TYPE_OBJECT_TASK_FILE:
      break
    case TYPES.TYPE_OBJECT_TASK_MSG:
      removeTaskMessage(obj)
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
      updateColor(obj)
      break
    case TYPES.TYPE_OBJECT_MEGAFON_CORP_INT:
      updateMegafonIntegration(obj)
      break
    case TYPES.TYPE_OBJECT_PERIOD:
      break
    case TYPES.TYPE_OBJECT_PROJECT_MEMBER:
      break
    case TYPES.TYPE_OBJECT_LABEL:
      break
    case TYPES.TYPE_OBJECT_FILE:
      break
    case TYPES.TYPE_OBJECT_EMP:
      updateEmployee(obj)
      break
    case TYPES.TYPE_OBJECT_CONTACT_FILE:
      break
    case TYPES.TYPE_OBJECT_CONTACT_FOTO:
      break
    case TYPES.TYPE_OBJECT_USER_GROUP:
      updateDepartment(obj)
      break
    case TYPES.TYPE_OBJECT_INVITE:
      break
    case TYPES.TYPE_OBJECT_NOTIFICATION:
      break
    case TYPES.TYPE_OBJECT_BOARD:
      updateBoard(obj)
      break
    case TYPES.TYPE_OBJECT_CARD:
      updateCard(obj)
      break
    case TYPES.TYPE_OBJECT_CARD_FILE:
      break
    case TYPES.TYPE_OBJECT_CARD_MSG:
      removeCardMessage(obj)
      break
    case TYPES.TYPE_OBJECT_CLIENT:
      updateClient(obj)
      break
    case TYPES.TYPE_OBJECT_CLIENT_FILE:
      break
    case TYPES.TYPE_OBJECT_CLIENT_MSG:
      break
    case TYPES.TYPE_OBJECT_CLIENT_EXT_FIELD:
      break
    case TYPES.TYPE_OBJECT_LOCALIZE:
      break
    case TYPES.TYPE_OBJECT_OPTIONS:
      break
    case TYPES.TYPE_OBJECT_CURRENT_USER:
      updateCurrentUser(obj)
      break
  }
}
