import { prefixRoutes } from './utils'
import Home from '@/views/Home'

export default [
  ...prefixRoutes('/settings', Home, [
    {
      path: 'help',
      name: 'help',
      component: () => import('@/components/Settings/Support.vue'),
      meta: {
        title: 'Помощь'
      }
    },
    // {
    //   path: 'integrations',
    //   name: 'integrations',
    //   component: () => import('@/components/Settings/Integrations.vue'),
    //   meta: {
    //     title: 'Интеграции'
    //   }
    // },
    // ...prefixRoutes(':integrations_name', Home, [
    //   {
    //     path: 'corporationYandexMail',
    //     name: 'corporationYandexMail',
    //     component: () => import('@/components/Integrations/CorpoIntegrationsYandex.vue'),
    //     meta: {
    //       title: 'корп. Яндекс интеграция'
    //     }
    //   },
    //   {
    //     path: 'corporateMegafon',
    //     name: 'corporateMegafon',
    //     component: () => import('@/components/Integrations/CoproIntegrationsMegafon.vue'),
    //     meta: {
    //       title: 'Мегафон интеграция'
    //     }
    //   },
    //   {
    //     path: 'personalYandexMail',
    //     name: 'personalYandexMail',
    //     component: () => import('@/components/Integrations/PersonalIntegrationsYandex.vue'),
    //     meta: {
    //       title: 'перс. Яндекс интеграция'
    //     }
    //   },
    //   {
    //     path: 'personalTelegram',
    //     name: 'personalTelegram',
    //     component: () => import('@/components/Integrations/PersonalIntegrationsTelegram.vue'),
    //     meta: {
    //       title: 'перс. Телеграм интеграция'
    //     }
    //   }
    // ]),
    {
      path: 'tarif',
      name: 'tarif',
      component: () => import('@/components/Settings/Tarif.vue'),
      meta: {
        title: 'Тариф'
      }
    },
    {
      path: 'options',
      name: 'options',
      component: () => import('@/components/Settings/Options.vue'),
      meta: {
        title: 'Настройки'
      }
    },
    {
      path: 'tags',
      name: 'tags',
      component: () => import('@/components/Tags/Tags.vue'),
      meta: {
        title: 'Метки'
      }
    },
    {
      path: 'employees',
      name: 'employees',
      component: () => import('@/components/Employees.vue'),
      meta: {
        title: 'Сотрудники'
      }
    },
    {
      path: 'colors',
      name: 'colors',
      component: () => import('@/components/Colors.vue'),
      meta: {
        title: 'Цвета'
      }
    }
  ])
]
