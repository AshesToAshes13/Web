import store from '@/store/index.js'
import * as PERSONAL_TELEGERAM from '@/store/actions/integrations/personalTelegramIntegration.js'

export function updateTelegramIntegration (obj) {
  store.commit(PERSONAL_TELEGERAM.TELEGRAM_GET_PERSONAL_INTEGRATION, obj.obj)
}
