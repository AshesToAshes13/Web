<template>
  <PopMenu
    @openMenu="openMenu"
    @closeMenu="closeMenu"
  >
    <slot />
    <template #menu>
      <PopMenuItem
        icon="answer"
        @click="onQuoteMessage"
      >
        Ответить
      </PopMenuItem>

      <PopMenuItem
        v-if="isShowNewCover"
        icon="copy"
        @click="onNewCardCover"
      >
        Сделать обложкой
      </PopMenuItem>
      <PopMenuItem
        v-if="canDelete && !message.uid_client"
        icon="delete"
        type="delete"
        @click="onDeleteMessage"
      >
        Удалить
      </PopMenuItem>
    </template>
  </PopMenu>
</template>
<script>
import PopMenu from '@/components/Common/PopMenu.vue'
import PopMenuItem from '@/components/Common/PopMenuItem.vue'
export default {
  components: {
    PopMenu,
    PopMenuItem
  },
  props: {
    canDelete: {
      type: Boolean,
      default: true
    },
    message: {
      type: Object,
      default: () => ({})
    },
    isShowNewCover: {
      type: Boolean,
      default: false
    }
  },
  emits: ['onQuoteMessage', 'onDeleteMessage', 'onNewCardCover', 'openMenu', 'closeMenu'],
  methods: {
    onQuoteMessage () {
      this.$emit('onQuoteMessage')
    },
    onDeleteMessage () {
      this.$emit('onDeleteMessage')
    },
    onNewCardCover () {
      this.$emit('onNewCardCover')
    },
    openMenu () {
      this.$emit('openMenu')
    },
    closeMenu () {
      this.$emit('closeMenu')
    }
  }
}

</script>
