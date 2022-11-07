<template>
  <div
    class="board-card max-w-[252px] group bg-white rounded-[6px] border px-[18px] py-[20px] transition-colors hover:cursor-pointer"
    :class="{ 'border-[rgba(0,0,0,0.1)]': !selected, 'border-[#ff9123]': selected }"
    :style="getCardStyle"
    @click="selectCard"
    @contextmenu="copyEmail($event)"
  >
    <div
      v-if="onlineUsers.length"
      class="-mt-[30px] -ml-[10px] mb-[10px] flex -space-x-1.5"
    >
      <img
        v-for="user in onlineUsers"
        :key="user"
        :title="user.name"
        class="w-[20px] h-[20px] rounded-full border-[1px] border-blue-300"
        :src="user.fotolink"
      >
    </div>
    <div
      v-show="!readOnly"
      class="flex justify-end mt-[-10px] mr-[-10px] mb-[5px]"
      :class="{'mb-[10px]': haveCover} "
    >
      <div
        :ref="`card-icon-${card.uid}`"
        class="w-[20px] h-[20px] overflow-hidden cursor-pointer invisible group-hover:visible transition-colors bg-[#ffffff8e] hover:bg-[#fffffff8] rounded"
        :style="getDotsStyle"
        @click.stop=""
      >
        <PopMenu
          @openMenu="lockVisibility(card.uid)"
          @closeMenu="unlockVisibility(card.uid)"
        >
          <div
            class="flex items-center justify-center w-[20px] h-[20px]"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M9.35524 16.1055C8.37421 16.1055 7.57892 15.3102 7.57892 14.3291C7.57892 13.3481 8.37421 12.5528 9.35524 12.5528C10.3363 12.5528 11.1316 13.3481 11.1316 14.3291C11.1316 15.3102 10.3363 16.1055 9.35524 16.1055ZM9.35524 10.7765C8.37421 10.7765 7.57892 9.9812 7.57892 9.00016C7.57892 8.01912 8.37421 7.22383 9.35524 7.22383C10.3363 7.22383 11.1316 8.01912 11.1316 9.00016C11.1316 9.9812 10.3363 10.7765 9.35524 10.7765ZM7.57892 3.67118C7.57892 4.65222 8.37421 5.4475 9.35524 5.4475C10.3363 5.4475 11.1316 4.65222 11.1316 3.67118C11.1316 2.69015 10.3363 1.89486 9.35524 1.89486C8.37421 1.89486 7.57892 2.69015 7.57892 3.67118Z"
                fill="#7e7e80"
              />
            </svg>
          </div>
          <template #menu>
            <PopMenuItem
              class="min-w-[150px]"
              icon="move"
              @click="clickMove"
            >
              Переместить
            </PopMenuItem>
            <PopMenuItem
              v-if="!isArchive"
              class="min-w-[150px]"
              @click="clickMoveToTop"
            >
              В начало колонки
            </PopMenuItem>
            <PopMenuItem
              v-if="!isArchive"
              class="min-w-[150px]"
              @click="clickMoveToBottom"
            >
              В конец колонки
            </PopMenuItem>
            <PopMenuDivider v-if="!isArchive" />
            <PopMenuItem
              v-if="!isArchive"
              class="min-w-[150px]"
              @click="clickSuccess"
            >
              Архивировать: Успех
            </PopMenuItem>
            <PopMenuItem
              v-if="!isArchive"
              class="min-w-[150px]"
              @click="clickReject"
            >
              Архивировать: Отказ
            </PopMenuItem>
            <PopMenuDivider />
            <PopMenuItem
              class="min-w-[150px]"
              icon="delete"
              type="delete"
              @click="clickDelete"
            >
              Удалить
            </PopMenuItem>
          </template>
        </PopMenu>
      </div>
    </div>
    <div
      v-if="haveCover"
      class="overflow-hidden rounded-[6px] mb-[20px] flex place-content-center"
      :style="{ background: card.cover_color, height: `${coverHeight}px` }"
    >
      <div
        v-if="card.cover_link"
        class="bg-cover bg-center bg-origin-content bg-clip-content"
        :style="{
          'background-image': `url(${card.cover_link})`,
          height: `${coverSize.y}px`,
          width: `${coverSize.x}px`
        }"
      />
    </div>
    <div class="flex items-start justify-between">
      <div class="w-full">
        <p
          class="text-[#424242] font-['Roboto'] mt-[-15px] text-[14px] leading-[18px] font-medium tracking-[.02em]"
          style="word-break: break-word;"
        >
          {{ card.name }}
        </p>
      </div>
    </div>
    <div
      v-if="shouldShowCLient"
      class="flex justify-between mt-[20px]"
    >
      <div class="flex flex-wrap gap-1">
        <!-- выводим дату -->
        <div
          v-if="showDate"
          class="flex items-center mr-1"
        >
          <BoardCardDate
            :date-move="card.date_move"
          />
        </div>
        <!-- Иконка date_reminder -->
        <div
          v-if="!!card.date_reminder"
          class="flex items-center space-x-0.5"
        >
          <BoardCardDateReminder
            :date-reminder="dateToLabelFormat(new Date(card.date_reminder))"
          />
        </div>
        <div
          v-if="!!card.client_name"
          class="flex items-center space-x-0.5"
        >
          <BoardCardClientName
            :client-name="card.client_name"
          />
        </div>
        <!-- выводим бюджет -->
        <div
          v-if="cost"
          class="flex items-center"
        >
          <BoardCardBudget
            :cost="cost"
          />
        </div>
      </div>
      <!-- Иконки справа -->
      <div
        v-if="shouldShowCardIcons"
        class="flex items-center"
      >
        <!-- Иконка файлов -->
        <BoardCardIcons
          :show-files-icon="!!card.has_files"
          :show-comment-icon="!!card.comment.length"
          :show-messages-icon="!!card.has_msgs"
        />
      </div>
    </div>
    <div
      v-if="card.user"
      class="flex items-center"
      :class="{
        'mt-2': !shouldShowUserImage,
        'mt-[20px]': shouldShowUserImage
      }"
    >
      <BoardCardEmployee
        :card-employee="card.user"
      />
    </div>
  </div>
</template>

<script>
import PopMenu from '@/components/Common/PopMenu.vue'
import PopMenuItem from '@/components/Common/PopMenuItem.vue'
import PopMenuDivider from '@/components/Common/PopMenuDivider.vue'
import BoardCardIcons from '@/components/Board/card/BoardCardIcons.vue'
import BoardCardDateReminder from '@/components/Board/card/BoardCardDateReminder.vue'
import BoardCardBudget from '@/components/Board/card/BoardCardBudget.vue'
import BoardCardClientName from '@/components/Board/card/BoardCardClientName.vue'
import BoardCardEmployee from '@/components/Board/card/BoardCardEmployee.vue'
import BoardCardDate from '@/components/Board/card/BoardCardDate.vue'

export default {
  components: {
    PopMenu,
    PopMenuItem,
    PopMenuDivider,
    BoardCardIcons,
    BoardCardDateReminder,
    BoardCardBudget,
    BoardCardClientName,
    BoardCardEmployee,
    BoardCardDate
  },
  props: {
    card: {
      type: Object,
      default: () => ({})
    },
    showDate: {
      type: Boolean,
      default: false
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      required: true
    },
    colorDots: {
      type: String,
      required: true
    }
  },
  emits: ['select', 'moveSuccess', 'moveReject', 'moveColumn', 'delete', 'moveCardToTop', 'moveCardToBottom', 'copyEmail'],
  data () {
    return {
      isCardShow: false
    }
  },
  computed: {
    getCardStyle () {
      return this.isCardShow
        ? {
            background: this.color
          }
        : {
            '--card-background-hover': this.color
          }
    },
    getDotsStyle () {
      return {
        '--dots-background': this.colorDots
      }
    },
    isArchive () {
      return (
        this.card.uid_stage === 'f98d6979-70ad-4dd5-b3f8-8cd95cb46c67' ||
        this.card.uid_stage === 'e70af5e2-6108-4c02-9a7d-f4efee78d28c'
      )
    },
    employees () {
      return this.$store.state.employees.employees
    },
    onlineUsers () {
      const onlineUsers = []
      for (const property in this.employees) {
        if (
          this.employees[property].onlineCardUid === this.card.uid &&
          property !== this.$store.state.user.user.current_user_uid
        ) {
          onlineUsers.push(this.employees[property])
        }
      }
      if (this.selected) {
        onlineUsers.push(this.employees[this.$store.state.user.user.current_user_uid])
      }
      return onlineUsers
    },
    // делаем картинки маленькими - ограничиваем по высоте и ширине
    coverSize () {
      if (this.card.cover_size_x > 0 && this.card.cover_size_y > 0) {
        const size = { x: this.card.cover_size_x, y: this.card.cover_size_y }
        const maxWidth = 220
        const maxHeight = 220
        const ratio = size.x / size.y
        if (size.x < size.y) {
          if (size.y > maxHeight) {
            size.y = maxHeight
            size.x = Math.ceil(size.y * ratio)
          }
        } else {
          if (size.x > maxWidth) {
            size.x = maxWidth
            size.y = Math.ceil(size.x / ratio)
          }
        }
        return size
      }
      return { x: 0, y: 0 }
    },
    coverHeight () {
      if (
        this.card.uid_cover_file !== '00000000-0000-0000-0000-000000000000' &&
        this.card.cover_size_x > 0 &&
        this.card.cover_size_y > 0
      ) {
        const minCoverHeight = 40
        return minCoverHeight < this.coverSize.y
          ? this.coverSize.y
          : minCoverHeight
      } else if (this.card.cover_color && this.card.cover_color !== '#A998B6') {
        const colorHeight = 11
        return colorHeight
      }
      return 0
    },
    haveCover () {
      return this.coverHeight > 0
    },
    cost () {
      if (this.card.cost > 0) {
        const fractional = this.card.cost % 100
        const value = Math.floor(this.card.cost / 100)
        let valString = ''
        let valueString = value.toString()
        while (valueString) {
          valString = valueString.slice(-3) + ' ' + valString
          valueString = valueString.slice(0, -3)
        }
        valString = valString.trim()
        if (fractional > 0) {
          const frString = (fractional < 10 ? '0' : '') + fractional
          return `${valString}.${frString}`
        }
        return valString
      }
      return ''
    },
    checkIfEmailInString () {
      const regex = /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/
      return regex.exec(this.card.name) ? regex.exec(this.card.name)[0] : ''
    }
  },
  methods: {
    dateToLabelFormat (calendarDate) {
      const day = calendarDate.getDate()
      const month = calendarDate.toLocaleString('default', { month: 'short' })
      const hours = String(calendarDate.getHours()).padStart(2, '0')
      const minutes = String(calendarDate.getMinutes()).padStart(2, '0')
      const time = hours === '00' && minutes === '00' ? '' : `${hours}:${minutes}`
      return `${day} ${month} ${time}`
    },
    print (val) {
      console.log(val)
    },
    selectCard () {
      this.$emit('select')
    },
    shouldShowCLient () {
      return this.showDate ||
        this.cost ||
        this.card.has_files ||
        this.card.has_msgs ||
        this.card.date_reminder ||
        this.card.comment.length ||
        this.card.client_name
    },
    shouldShowCardIcons () {
      return this.card.has_files ||
        this.card.has_msgs ||
        this.card.date_reminder ||
        this.card.comment.length
    },
    shouldShowUserImage () {
      return !this.showDate ||
        !this.cost ||
        !this.card.has_files ||
        !this.card.has_msgs ||
        !this.card.comment.length
    },
    lockVisibility (cardUid) {
      const icon = this.$refs[`card-icon-${cardUid}`]
      icon.style.visibility = 'visible'
      this.isCardShow = true
    },
    unlockVisibility (cardUid) {
      const icon = this.$refs[`card-icon-${cardUid}`]
      icon.style.visibility = null
      this.isCardShow = false
    },
    clickSuccess () {
      this.$emit('moveSuccess')
    },
    clickReject () {
      this.$emit('moveReject')
    },
    copyEmail (event) {
      if (this.checkIfEmailInString) {
        event.preventDefault()
        this.$emit('copyEmail')
      }
    },
    clickDelete () {
      this.$emit('delete')
    },
    clickMove () {
      this.$emit('moveColumn')
    },
    clickMoveToTop () {
      this.$emit('moveCardToTop')
    },
    clickMoveToBottom () {
      this.$emit('moveCardToBottom')
    }
  }
}
</script>

<style scoped>
.light {
  --popper-theme-background-color: #ffffff;
  --popper-theme-background-color-hover: #ffffff;
  --popper-theme-text-color: #444444;
  --popper-theme-border-width: 1px;
  --popper-theme-border-style: solid;
  --popper-theme-border-color: rgba(0, 0, 0, 0.12);
  --popper-theme-border-radius: 10px;
  --popper-theme-padding: 17px 15px;
  --popper-theme-box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.25);
}
.board-card:hover {
  background: var(--card-background-hover);
}
.board-card-dots {
  background: var(--dots-background);
}
</style>
