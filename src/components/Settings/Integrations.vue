<template>
  <div
    v-if="displayModal"
    class="mt-[100px] flex flex-col items-center justify-center"
  >
    <IntegrationsOnboarding
      @okToModal="okToModal"
    />
  </div>
  <div v-if="!displayModal">
    <div class="w-full">
      <div class="flex items-center justify-between w-full">
        <NavBar
          class="w-full pt-[8px]"
          title="Интеграции"
        />
        <div class="flex flex-none px-[12px] pt-[8px]">
          <Icon
            :path="listView.path"
            :width="listView.width"
            :height="listView.height"
            :box="listView.viewBox"
            class="cursor-pointer hover:text-gray-800 mr-2"
            :class="{
              'text-gray-800': !isGridView,
              'text-gray-400': isGridView
            }"
            @click="updateGridView(false)"
          />
          <Icon
            :path="gridView.path"
            :width="gridView.width"
            :height="gridView.height"
            :box="gridView.viewBox"
            class="cursor-pointer hover:text-gray-800 mr-2"
            :class="{
              'text-gray-800': isGridView,
              'text-gray-400': !isGridView
            }"
            @click="updateGridView(true)"
          />
        </div>
      </div>
      <div
        v-for="(dep, index) in integrations"
        :key="index"
      >
        <div v-if="shouldShowCorpIntegrations(dep.typeAccess)">
          <div
            class="flex w-full"
            :class="{ 'justify-between': index == 0, 'mt-[28px]': index != 0 }"
          >
            <p class="font-['Roboto'] text-[#424242] text-[19px] leading-[22px] font-bold">
              {{ dep.title }}
            </p>
          </div>
          <div
            class="grid gap-2 mt-3 grid-cols-1"
            :class="{
              'md:grid-cols-2 lg:grid-cols-4': isGridView,
              'lg:grid-cols-2': isPropertiesMobileExpanded && isGridView
            }"
          >
            <template
              v-for="integration in dep.items"
              :key="integration.path"
            >
              <router-link
                :to="'/settings/integrations/' + integration.path"
              >
                <ListBlocItem
                  :title="integration.name"
                  title-color="#4C4C4D"
                  :left-icon="integration.icon"
                />
              </router-link>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import NavBar from '@/components/Navbar/NavBar'
import Icon from '@/components/Icon.vue'
import ListBlocItem from '@/components/Common/ListBlocItem.vue'
import IntegrationsOnboarding from '@/components/Settings/IntegrationsOnboarding.vue'
import { INTEGRATIONS_TYPE_ACCESS } from '@/constants'
import { USER_VIEWED_MODAL } from '@/store/actions/onboarding.js'

import gridView from '@/icons/grid-view.js'
import listView from '@/icons/list-view.js'

import { setLocalStorageItem } from '@/store/helpers/functions'

export default {
  components: {
    NavBar,
    IntegrationsOnboarding,
    Icon,
    ListBlocItem
  },
  data () {
    return {
      gridView,
      listView,
      integrations: [
        {
          title: 'Мои интеграции',
          items: [
            {
              path: 'personalYandexMail',
              name: 'Яндекс.Почта',
              icon: 'yandex'
            },
            {
              path: 'personalTelegram',
              name: 'Телеграм',
              icon: 'telegram'
            }
          ],
          typeAccess: [INTEGRATIONS_TYPE_ACCESS.OWNER, INTEGRATIONS_TYPE_ACCESS.ADMIN, INTEGRATIONS_TYPE_ACCESS.USER]
        },
        {
          title: 'Общие интеграции',
          items: [
            {
              path: 'corporationYandexMail',
              name: 'Корпоративная Яндекс.Почта',
              icon: 'yandex'
            },
            {
              path: 'corporateMegafon',
              name: 'Мегафон',
              icon: 'megafon'
            }
          ],
          typeAccess: [INTEGRATIONS_TYPE_ACCESS.OWNER, INTEGRATIONS_TYPE_ACCESS.ADMIN]
        }
      ]
    }
  },
  computed: {
    isGridView () {
      setLocalStorageItem('isGridView', true)
      return this.$store.state.isGridView
    },
    isPropertiesMobileExpanded () {
      return this.$store.state.isPropertiesMobileExpanded
    },
    employees () {
      return this.$store.state.employees.employees
    },
    user () {
      return this.$store.state.user.user
    },
    currUserType () {
      return this.employees[this.user.current_user_uid].type
    },
    displayModal () {
      return !this.$store.state.onboarding.visitedModals?.includes('integrations') && this.$store.state.onboarding.showModals
    }
  },
  methods: {
    updateGridView (value) {
      this.$store.commit('basic', { key: 'isGridView', value: value })
      setLocalStorageItem('isGridView', value)
    },
    shouldShowCorpIntegrations (access) {
      return access.includes(this.currUserType)
    },
    okToModal () {
      this.$store.commit(USER_VIEWED_MODAL, 'integrations')
    }
  }
}
</script>
