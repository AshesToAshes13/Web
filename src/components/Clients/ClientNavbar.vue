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
          {{ client.date_create }}
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
    }
  }
}
</script>
