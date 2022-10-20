<template>
  <div class="flex justify-between items-center">
    <ModalBoxDelete
      v-if="showConfirm"
      title="Удалить контакт"
      class="break-words"
      :text="`Вы действительно хотите удалить контакт ${client.name}?`"
      @cancel="showConfirm = false"
      @yes="removeClient"
    />
    <NavBar
      title="Контакты"
      route="/clients"
      :breadcrumbs="breadcrumbs"
    />
    <PopMenu>
      <NavBarButtonIcon icon="menu" />
      <template #menu>
        <PopMenuHeader
          v-if="client.date_create"
          title="Дата добавления:"
        >
          {{ dateToLabelFormat(new Date(client.date_create)) }}
        </PopMenuHeader>
        <PopMenuItem
          icon="delete"
          type="delete"
          @click="showConfirm = true"
        >
          Удалить
        </PopMenuItem>
      </template>
    </PopMenu>
  </div>
</template>
<script>
import NavBar from '@/components/Navbar/NavBar'
import PopMenu from '@/components/Common/PopMenu'
import PopMenuHeader from '@/components/Common/PopMenuHeader'
import PopMenuItem from '@/components/Common/PopMenuItem'
import NavBarButtonIcon from '@/components/Navbar/NavBarButtonIcon'
import ModalBoxDelete from '@/components/Common/ModalBoxDelete'

export default {
  components: { ModalBoxDelete, NavBarButtonIcon, PopMenuItem, PopMenuHeader, PopMenu, NavBar },
  props: {
    breadcrumbs: {
      type: Array,
      default: () => ([])
    },
    client: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['deleteClient'],
  data () {
    return {
      showConfirm: false
    }
  },
  methods: {
    removeClient () {
      this.showConfirm = false
      this.$emit('deleteClient')
    },
    dateToLabelFormat (calendarDate) {
      const day = calendarDate.getDate()
      const month = calendarDate.toLocaleString('default', { month: 'short' })
      const weekday = calendarDate.toLocaleString('default', { weekday: 'short' })
      const year = calendarDate.getFullYear()
      const hours = String(calendarDate.getHours()).padStart(2, '0')
      const minutes = String(calendarDate.getMinutes()).padStart(2, '0')
      const seconds = String(calendarDate.getSeconds()).padStart(2, '0')

      return `${day} ${month} ${year}, ${weekday}, ${hours}:${minutes}:${seconds}`
    }
  }
}
</script>
