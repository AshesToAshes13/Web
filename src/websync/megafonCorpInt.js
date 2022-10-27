import store from '@/store/index.js'
import * as MEGAFON from '@/store/actions/integrations/corpoMegafonInt'
import * as CLIENT_FILES_AND_MESSAGES from '@/store/actions/clientfilesandmessages'
import { stripPhoneNumber } from '@/helpers/functions'

export function createMegafonIntegration (obj) {
  store.commit(MEGAFON.SET_MEGAFON_INTEGRATION, {
    atsKey: obj.obj.integration.ats_key,
    crmKey: obj.obj.integration.crm_key,
    atsLink: obj.obj.integration.ats_link,
    megafonUsers: obj.obj.users.map((user) => ({
      id: user.id,
      organizationEmail: user.organization_email,
      uidUser: user.uid_user,
      megafonUserLogin: user.megafon_user_login
    }))
  })
}

export function updateMegafonIntegration (obj) {
  store.commit(MEGAFON.SET_MEGAFON_INTEGRATION, {
    atsKey: obj.obj.integration.ats_key,
    crmKey: obj.obj.integration.crm_key,
    atsLink: obj.obj.integration.ats_link,
    megafonUsers: obj.obj.users.map((user) => ({
      id: user.uid,
      organizationEmail: user.organization_email,
      uidUser: user.uid_user,
      megafonUserLogin: user.megafon_user_login
    }))
  })
}

export function addMegafonCallToClientChat (obj) {
  if (obj.obj.phone === stripPhoneNumber(store.state.clients.selectedClient.phone)) {
    store.commit(CLIENT_FILES_AND_MESSAGES.PUSH_CALL_HISTORY, [obj.obj])
    store.commit(CLIENT_FILES_AND_MESSAGES.MERGE_FILES_AND_MESSAGES)
  }
}

export function removeMegafonIntegration () {
  store.commit(MEGAFON.MEGAFON_REMOVE_CORP_INTEGRATION)
}
