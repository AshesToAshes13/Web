<template>
  <ModalBoxNotificationInstruction
    v-model="shouldShowModalBox"
    button="warning"
    has-button
    has-cancel
    button-label="Хорошо, я понял"
    @confirm="setShouldShowModalValue('0')"
  >
    <p>
      Мы используем системные уведомления для отображения важных событий в приложении, которые нельзя увидеть при свернутом браузере или в другой вкладке.
    </p>
    <p>
      Чтобы всегда быть в курсе актуального положения дел, пожалуйста, разрешите отображение уведомлений в настройках браузера.
    </p>
    <p>
      Инстрyкции как включить уведомления для разных браузеров:
    </p>
    <a
      href="https://support.google.com/chrome/answer/3220216?hl=ru&co=GENIE.Platform%3DAndroid"
      target="_blank"
      class="text-blue-400"
    >Google Chrome</a>
    <br>
    <a
      href="https://support.apple.com/ru-ru/guide/safari/sfri40734/mac"
      target="_blank"
      class="text-blue-400"
    >Safari</a>
    <br>
    <a
      href="https://sendpulse.com/ru/knowledge-base/push-notifications/enable-disable-push-notifications-mozilla-firefox"
      target="_blank"
      class="text-blue-400"
    >Firefox</a>
  </ModalBoxNotificationInstruction>
  <ModalBox
    v-if="showInviteModalBox"
    title="Вас пригласили в компанию"
    ok="Принять"
    decline="Отказаться"
    @ok="okInviteModalBox"
    @decline="declineInviteModalBox"
    @cancel="cancelInviteModalBox"
  />
  <MainSection
    v-if="isContentLoaded"
    class="flex xl:ml-[292px] overflow-auto h-screen"
  >
    <MainMenu
      v-if="$store.state.auth.token"
    />
    <SubMenu
      v-if="isSubMenuActive"
    />
    <MenuOverlay
      v-show="isSubMenuActive"
      :z-index="'z-20'"
      @overlay-click="closeSubMenu"
    />
    <overlay
      v-show="isAsideLgActive"
      :z-index="'z-20'"
      @overlay-click="overlayClick"
    />
    <PropertiesRight />

    <ErrorNotification />
    <Notification />
    <InspectorNotification />

    <div class="flex-1 px-3 overflow-auto scroll-style">
      <slot />
    </div>
  </MainSection>
  <AppSkeleton v-else />
</template>

<script>
import * as CORP_YANDEX from '@/store/actions/integrations/corpoYandexInt.js'
// import * as CORP_MEGAFON from '@/store/actions/integrations/corpoMegafonInt.js'
import * as PERSONAL_YANDEX from '@/store/actions/integrations/personalYandexInt.js'

import MainMenu from '@/components/AsideMenu/MainMenu.vue'
import SubMenu from '@/components/AsideMenu/SubMenu.vue'
import Overlay from '@/components/modals/Overlay.vue'
import MenuOverlay from '@/components/modals/MenuOverlay.vue'

import { setLocalStorageItem } from '@/store/helpers/functions'
import PropertiesRight from '@/components/PropertiesRight.vue'
import ErrorNotification from '@/components/Notifications/ErrorNotification.vue'
import Notification from '@/components/Notifications/Notification.vue'
import InspectorNotification from '@/components/Notifications/InspectorNotification.vue'
import ModalBox from '@/components/modals/ModalBox.vue'
import AppSkeleton from '@/AppSkeleton.vue'

import MainSection from '@/components/MainSection.vue'
import ModalBoxNotificationInstruction from '@/components/modals/ModalBoxNotificationInstruction.vue'

import { USER_INVITE_ME, USER_REQUEST } from '@/store/actions/user'
import { NAVIGATOR_REQUEST } from '@/store/actions/navigator'

import { initWebSync, disconnectWebSync } from '@/websync/index.js'
import { initInspectorSocket } from '@/inspector/index.js'

export default {
  components: {
    MainMenu,
    SubMenu,
    ModalBoxNotificationInstruction,
    MainSection,
    Overlay,
    MenuOverlay,
    PropertiesRight,
    ErrorNotification,
    Notification,
    InspectorNotification,
    ModalBox,
    AppSkeleton
  },
  data () {
    return {
      shouldShowModalBox: false,
      isContentLoaded: false
    }
  },
  computed: {
    isSubMenuActive () {
      return this.$store.state.navigator.submenu.status
    },
    user () {
      return this.$store.state.user.user
    },
    isAsideLgActive () {
      return this.$store.state.isAsideLgActive
    },
    storeNavigator () {
      return this.$store.getters.sortedNavigator
    },
    showInviteModalBox () {
      if (this.$store.state.navigator.navigator?.invite_me?.uid && this.$store.state.navigator.navigator?.invite_me?.uid !== '00000000-0000-0000-0000-000000000000') return true
      return false
    }
  },
  watch: {
    isSubMenuActive (newval, oldval) {
      if (!newval) {
        const allPaths = [
          'tasks',
          'account',
          'reglaments',
          'project',
          'board',
          'settings',
          'doitnow'
        ]
        for (let i = 0; i < allPaths.length; i++) {
          if (this.$route.path.includes(allPaths[i])) {
            this.$store.state.navigator.submenu.activeTab = allPaths[i]
            return
          }
        }
      }
    }
  },
  mounted () {
    this.initApplication()
  },
  unmounted () {
    disconnectWebSync()
  },
  methods: {
    closeSubMenu () {
      this.$store.state.navigator.submenu.status = false
    },
    initApplication () {
      const fm = document.createElement('script')
      fm.setAttribute('src', process.env.VUE_APP_LEADERTASK_API + 'scripts/websync/fm.min.js')
      fm.onload = () => {
        // подключаем скрыпты в правильном порядке - сначала fm.min потом fm.websync.min
        const websync = document.createElement('script')
        websync.setAttribute('src', process.env.VUE_APP_LEADERTASK_API + 'scripts/websync/fm.websync.min.js')
        document.head.appendChild(websync)
      }
      document.head.appendChild(fm)

      this.$store.dispatch(USER_REQUEST)
        .then(resp => {
          this.getNavigator()
          this.getIntegrations()
        })
    },
    getNavigator () {
      if (this.$store.state.auth.token) {
        const data = {
          organization: this.$store?.state?.user?.user?.owner_email,
          user_uid: this.$store?.state?.user?.user?.current_user_uid
        }
        let reglaments = []
        this.$store.commit(NAVIGATOR_REQUEST)
        this.$store.dispatch('REGLAMENTS_REQUEST', data).then(resp => {
          reglaments = resp.data
        }).finally(() => {
          this.$store.dispatch(NAVIGATOR_REQUEST).then((resp) => {
            this.storeNavigator.reglaments = {
              uid: 'fake-uid',
              items: reglaments
            }
            initWebSync()
            initInspectorSocket()
            this.$store.dispatch('GET_SOUND_SETTING', this.$store?.state?.user?.user?.current_user_uid)
            this.isContentLoaded = true
          })
        })
      }
    },
    getIntegrations () {
      // this.$store.dispatch(CORP_MEGAFON.MEGAFON_CHECK_INTEGRATION, this.user.owner_email)
      this.$store.dispatch(CORP_YANDEX.YANDEX_GET_ORGANIZATION_LOGIN_AND_PASS, this.user.owner_email)
      this.$store.dispatch(PERSONAL_YANDEX.YANDEX_GET_PERSONAL_LOGIN_AND_PASS, this.user.current_user_email)
    },
    setShouldShowModalValue (value) {
      setLocalStorageItem('shouldShowModal', value)
      Notification.requestPermission().then(function (permission) {
        if (permission === 'granted') {
          setLocalStorageItem('shouldShowModal', '0')
        } else if (permission === 'denied') {
          setLocalStorageItem('shouldShowModal', '0')
        }
      })
    },
    requestNotificationPermissionOrShowModalBox () {
      if (parseInt(localStorage.getItem('shouldShowModal')) === 0) {
        return
      }

      if (!('Notification' in window)) {
        alert('This browser does not support desktop notification')
        setLocalStorageItem('shouldShowModal', '0')
      } else if (Notification.permission === 'granted') {
        setLocalStorageItem('shouldShowModal', '0')
      } else if (Notification.permission === 'default') {
        setLocalStorageItem('shouldShowModal', '1')
      } else if (Notification.permission === 'denied') { // handle denied case
        setLocalStorageItem('shouldShowModal', '1')
      }

      if (parseInt(localStorage.getItem('shouldShowModal')) === 1) {
        this.shouldShowModalBox = true
      }
    },
    overlayClick () {
      this.$store.dispatch('asideLgToggle', false)
    },
    okInviteModalBox () {
      const data = {
        uid: this.$store.state.navigator.navigator?.invite_me?.uid,
        accept: true
      }
      this.$store.dispatch(USER_INVITE_ME, data)
        .then(() => {
          this.$store.state.navigator.navigator.invite_me.uid = '00000000-0000-0000-0000-000000000000'
          location.reload()
        })
    },
    declineInviteModalBox () {
      const data = {
        uid: this.$store.state.navigator.navigator?.invite_me?.uid,
        accept: false
      }
      this.$store.dispatch(USER_INVITE_ME, data)
      this.$store.state.navigator.navigator.invite_me.uid = '00000000-0000-0000-0000-000000000000'
    },
    cancelInviteModalBox () {
      this.$store.state.navigator.navigator.invite_me.uid = '00000000-0000-0000-0000-000000000000'
    }
  }
}
</script>
