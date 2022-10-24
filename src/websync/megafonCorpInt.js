import store from '@/store/index.js'
import * as MEGAFON from '@/store/actions/integrations/corpoMegafonInt'

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

export function removeMegafonIntegration () {
  store.commit(MEGAFON.MEGAFON_REMOVE_CORP_INTEGRATION)
}
