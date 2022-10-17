<template>
  <div>
    <BoardModalBoxRename
      v-if="showModal"
      :show="showModal"
      title="Добавить подметку"
      @cancel="showModal = false"
      @save="createTag"
    />
    <ModalBoxDelete
      v-if="showConfirm"
      title="Удалить метку"
      :text="`Вы действительно хотите удалить метку ${selectedTagName}?`"
      @cancel="showConfirm = false"
      @yes="removeTag"
    />
    <div class="flex justify-between items-center">
      <PopMenu v-if="isCanDelete">
        <PropsButtonMenu />
        <template #menu>
          <PopMenuItem
            icon="delete"
            type="delete"
            @click="showConfirm = true"
          >
            Удалить
          </PopMenuItem>
        </template>
      </PopMenu>
      <div v-else />
      <PropsButtonClose
        @click="closeProperties"
      />
    </div>
    <input
      v-model="currName"
      type="text"
      placeholder="Наименование"
      class="mt-[25px] p-0 font-roboto font-bold text-[18px] leading-[21px] text-[#424242] w-full border-none focus:ring-0 focus:outline-none"
      @blur="changeTagName"
    >
    <div
      class="mt-[30px] font-roboto text-[16px] leading-[19px] font-medium text-[#4c4c4d]"
    >
      Цвет
    </div>
    <div class="w-full mt-[15px] gap-[4px] flex flex-col">
      <div
        v-for="(clrs, index) in defaultColors"
        :key="index"
        class="flex gap-[4px]"
      >
        <PropsColorBoxItem
          v-for="clr in clrs"
          :key="clr.color"
          :color="clr.color"
          :selected="clr.selected"
          @select="changeTagColor"
        />
      </div>
    </div>
    <div
      class="mt-[30px] font-roboto text-[16px] leading-[19px] font-medium text-[#4c4c4d]"
    >
      Подметки
    </div>
    <ListBlocAdd
      class="mt-2"
      @click="showModal = true"
    />
    <div>
      <ListBlocItem
        v-for="(child, idx) in selectedTag.children"
        :key="idx"
        class="mt-1"
        :color="child.back_color"
        :title="child.name"
        @click="selectTag(child)"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M12.1053 6.19143C12.2299 6.06141 12.4022 5.9879 12.5822 5.9879L17.3518 5.9879C17.7166 5.9879 18.0124 6.28367 18.0124 6.64852V11.4181C18.0124 11.5982 17.9389 11.7704 17.8089 11.895L11.8928 17.5646C11.6333 17.8133 11.2227 17.8089 10.9686 17.5548L6.44553 13.0317C6.19141 12.7776 6.18705 12.367 6.4357 12.1075L12.1053 6.19143ZM11.3464 5.07372L5.03431 11.6603C4.53701 12.1792 4.54574 13.0005 5.05398 13.5087L10.4916 18.9463C10.9998 19.4546 11.8211 19.4633 12.3401 18.966L18.9266 12.6539C19.1866 12.4047 19.3337 12.0601 19.3337 11.7V5.9879C19.3337 5.2582 18.7421 4.66666 18.0124 4.66666H12.3003C11.9402 4.66666 11.5956 4.81369 11.3464 5.07372ZM13.643 8.84632C13.8449 8.64439 14.1127 8.53321 14.3985 8.53321C14.6844 8.53321 14.9521 8.64439 15.1541 8.84632C15.356 9.04825 15.4672 9.31598 15.4672 9.60186C15.4672 9.88774 15.356 10.1555 15.1541 10.3574C14.9521 10.5593 14.6844 10.6705 14.3985 10.6705C14.1127 10.6705 13.8449 10.5593 13.643 10.3574C13.4411 10.1555 13.3299 9.88774 13.3299 9.60186C13.3299 9.31598 13.4411 9.04825 13.643 8.84632Z"
            :fill="child.back_color"
          />
        </svg>
      </ListBlocItem>
    </div>
  </div>
</template>

<script>
import ModalBoxDelete from '@/components/Common/ModalBoxDelete.vue'
import PropsColorBoxItem from '@/components/Common/PropsColorBoxItem.vue'
import PopMenu from '@/components/Common/PopMenu.vue'
import PopMenuItem from '@/components/Common/PopMenuItem.vue'
import ListBlocAdd from '@/components/Common/ListBlocAdd.vue'
import ListBlocItem from '@/components/Common/ListBlocItem.vue'
import BoardModalBoxRename from '@/components/Board/modalboxes/BoardModalBoxRename.vue'
import PropsButtonClose from '@/components/Common/PropsButtonClose.vue'
import PropsButtonMenu from '@/components/Common/PropsButtonMenu.vue'

import { UPDATE_TAG_REQUEST, REMOVE_TAG_REQUEST, CREATE_TAG_REQUEST, SELECT_TAG } from '@/store/actions/tasks'

import { NAVIGATOR_REMOVE_TAG, NAVIGATOR_PUSH_TAG } from '@/store/actions/navigator'
import { uuidv4 } from '@/helpers/functions'

export default {
  components: {
    ModalBoxDelete,
    PropsColorBoxItem,
    BoardModalBoxRename,
    PopMenu,
    PopMenuItem,
    PropsButtonMenu,
    ListBlocAdd,
    ListBlocItem,
    PropsButtonClose
  },
  data () {
    return {
      showConfirm: false,
      currName: '',
      showModal: false
    }
  },
  computed: {
    defaultColors () {
      const allColors = [
        '',
        '#7fc870',
        '#69c494',
        '#dff2e1',
        '#ffaf40',
        '#ffd7a0',
        '#5ba4cf',
        '#9eedff',
        '#b381b3',
        '#e5e5e5',
        '#ddd1c2',
        '#ef7665',
        '#ffc6b5',
        '#ff8ed4',
        '#f5dbf5',
        '#6a7077',
        '#f6dd29',
        '#f5f547'
      ]
      // добавляем в конец выбранный цвет если его тут нет
      const usedColor = this.selectedTagColor.toLowerCase()
      if (!allColors.includes(usedColor)) {
        allColors.splice(allColors.length - 1, 1, usedColor)
      }
      const colors = allColors.map(color => ({ color: color, selected: color === usedColor }))
      // разбираем на ряды по 9
      const rowLength = 9
      const arrColors = []
      while (colors.length) arrColors.push(colors.splice(0, rowLength))
      return arrColors
    },
    selectedTag () {
      return this.$store.state.tasks.selectedTag
    },
    user () {
      return this.$store.state.user.user
    },
    selectedTagUid () {
      return this.selectedTag?.uid || ''
    },
    selectedTagName () {
      return this.selectedTag?.name || ''
    },
    selectedTagColor () {
      const backColor = this.selectedTag?.back_color
      if (backColor && backColor !== '#A998B6') return backColor
      return ''
    },
    isCanDelete () {
      const user = this.$store.state.user.user
      return this.selectedTag.email_creator === user.current_user_email
    },
    isCanEdit () {
      return this.isCanDelete
    }
  },
  watch: {
    selectedTagName: {
      immediate: true,
      handler: function (val) {
        this.currName = val
      }
    }
  },
  mounted () {
    this.childrens = this.selectedTag.children
  },
  methods: {
    selectTag (tag) {
      if (!this.$store.state.isPropertiesMobileExpanded) {
        this.$store.dispatch('asidePropertiesToggle', true)
      }
      this.$store.commit('basic', { key: 'propertiesState', value: 'tag' })
      this.$store.commit(SELECT_TAG, tag)
    },
    createTag (name) {
      this.showModal = false
      const title = name.trim()
      const tag = {
        uid_parent: this.selectedTag.uid,
        back_color: this.defaultColors[1][Math.floor(Math.random() * this.defaultColors[1].length - 1)].color,
        comment: '',
        collapsed: 0,
        children: [],
        order: 1,
        group: 0,
        show: 0,
        favorite: 0,
        uid: uuidv4(),
        name: title,
        email_creator: this.user.current_user_email,
        bold: 0
      }
      this.$store.dispatch(CREATE_TAG_REQUEST, tag)
        .then(() => {
          tag.global_property_uid = '00a5b3de-9474-404d-b3ba-83f488ac6d30'
          this.$store.commit(NAVIGATOR_PUSH_TAG, [tag])
          this.$store.commit(SELECT_TAG, tag)
        })
    },
    print (msg, param) {
      console.log(msg, param)
    },
    removeTag () {
      this.showConfirm = false

      this.$store.dispatch(REMOVE_TAG_REQUEST, this.selectedTagUid)
        .then((resp) => {
          console.log('removeTag', resp)
          //
          this.$store.dispatch('asidePropertiesToggle', false)
          this.$store.commit(REMOVE_TAG_REQUEST, this.selectedTagUid)
          this.$store.commit(NAVIGATOR_REMOVE_TAG, this.selectedTag)
        })
    },
    closeProperties () {
      this.$store.dispatch('asidePropertiesToggle', false)
    },
    changeTagName () {
      if (this.selectedTagUid) {
        const title = this.currName.trim()
        if (title && this.selectedTagName !== title) {
          this.selectedTag.name = title
          this.$store.dispatch(UPDATE_TAG_REQUEST, this.selectedTag)
            .then((resp) => {
              console.log('changeColorName', resp)
            })
        }
      } else {
        const data = {
          uid_parent: '00000000-0000-0000-0000-000000000000',
          back_color: this.selectedTag.back_color,
          comment: '',
          collapsed: 0,
          order: 1,
          group: 0,
          show: 0,
          favorite: 0,
          uid: uuidv4(),
          name: this.selectedTagName,
          bold: 0
        }
        this.$store.dispatch(CREATE_TAG_REQUEST, data)
      }
    },
    changeTagColor (color) {
      if (this.selectedTagUid) {
        if (this.selectedTagColor.toLowerCase() !== color) {
          this.selectedTag.back_color = color || '#A998B6'
          this.$store.dispatch(UPDATE_TAG_REQUEST, this.selectedTag)
            .then((resp) => {
              console.log('changeTagColor', resp, color)
            })
        }
      } else {
        const data = {
          uid_parent: '00000000-0000-0000-0000-000000000000',
          back_color: this.selectedTag.back_color,
          comment: '',
          collapsed: 0,
          order: 1,
          group: 0,
          show: 0,
          favorite: 0,
          uid: uuidv4(),
          name: this.selectedTagName,
          bold: 0
        }
        this.$store.dispatch(CREATE_TAG_REQUEST, data)
        if (this.isCanEdit && this.selectedTagColor.toLowerCase() !== color) {
          this.selectedTag.back_color = color || '#A998B6'
          this.$store.dispatch(UPDATE_TAG_REQUEST, this.selectedTag)
            .then((resp) => {
              console.log('changeTagColor', resp, color)
            })
        }
      }
    }
  }
}
</script>

<style>

</style>
