<template>
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
              >
                <svg
                  class="flex-none"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.6486 5.13099V4.19718C16.6486 3.33099 15.9668 2.62535 15.1299 2.62535H8.87113L8.68333 2.30423C8.56901 2.11831 8.36896 2 8.15666 2H3.51875C2.68181 2 2 2.70563 2 3.57183V15.4282C2 16.2944 2.68181 17 3.51875 17H16.4812C17.3182 17 18 16.2944 18 15.4282V6.69437C18.0041 5.8831 17.408 5.21549 16.6486 5.13099ZM3.23297 3.57183C3.23297 3.40704 3.36361 3.27183 3.52284 3.27183H7.81372L9.47945 6.08592C9.58968 6.27183 9.78973 6.39014 10.0061 6.39014H16.4894C16.6486 6.39014 16.7793 6.52535 16.7793 6.69014V15.4282C16.7793 15.593 16.6486 15.7282 16.4894 15.7282H3.51875C3.35953 15.7282 3.22888 15.593 3.22888 15.4282V3.57183H3.23297ZM15.4157 5.11831H10.345L9.62234 3.89718H15.1258C15.285 3.89718 15.4157 4.03239 15.4157 4.19718V5.11831Z"
                    fill="black"
                    fill-opacity="0.5"
                  />
                </svg>
              </ListBlocItem>
            </router-link>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import NavBar from '@/components/Navbar/NavBar'
import Icon from '@/components/Icon.vue'
import ListBlocItem from '@/components/Common/ListBlocItem.vue'

import gridView from '@/icons/grid-view.js'
import listView from '@/icons/list-view.js'

import { setLocalStorageItem } from '@/store/helpers/functions'

export default {
  components: {
    NavBar,
    Icon,
    ListBlocItem
  },
  data () {
    return {
      gridView,
      listView
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
    integrations () {
      return [
        {
          title: 'Мои интеграции',
          items: [
            {
              path: 'personalYandexMail',
              name: 'Яндекс.Почта'
            },
            {
              path: 'personalTelegram',
              name: 'Телеграм'
            }
          ],
          // TODO: сделать userType константами с понятным названием вроде OWNER, ADMIN
          typeAccess: [1, 2, 3]
        },
        {
          title: 'Корпоративные интеграции',
          items: [
            {
              path: 'corporationYandexMail',
              name: 'Яндекс.Почта'
            },
            {
              path: 'corporateMegafon',
              name: 'Мегафон'
            }
          ],
          typeAccess: [1, 2, 3]
        }
      ]
    }
  },
  methods: {
    updateGridView (value) {
      this.$store.commit('basic', { key: 'isGridView', value: value })
      setLocalStorageItem('isGridView', value)
    },
    shouldShowCorpIntegrations (access) {
      return access.includes(this.currUserType)
    }
  }
}
</script>
