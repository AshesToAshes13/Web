<script>
export default {
  props: {
    cardName: {
      type: String,
      default: ''
    },
    canEdit: Boolean
  },
  emits: ['changeName', 'onPasteFile'],
  methods: {
    onPasteName (e) {
      e.preventDefault()
      const text = e.clipboardData.getData('text/plain')
      window.document.execCommand('insertText', false, text)
      const items = (e.clipboardData || e.originalEvent.clipboardData)?.items
      if (items) {
        for (const item of items) {
          if (item.kind === 'file') {
            this.$emit('onPasteFile', e)
            break
          }
        }
      }
    }
  }
}
</script>
<template>
  <div
    v-linkified:options="{ className: 'text-blue-600', tagName: 'a' }"
    class="text-[18px] font-[700] my-[25px] text-[#424242] min-h-[24px] break-words"
    :contenteditable="canEdit"
    @blur="$emit('changeName', $event)"
    @paste="onPasteName($event)"
    v-html="cardName?.replaceAll('\n','<br/>')"
  />
</template>
