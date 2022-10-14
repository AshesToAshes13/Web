<template>
  <DoitnowContent>
    <InspectorModalBox
      v-model="showInspector"
      button="warning"
      has-button
      has-cancel
      button-label="Delete"
      @delegated="showSlide = false"
    />
    <UploadAvatar
      v-if="changeAvatar"
      :img="uploadedAvatar"
      :image-type="avatarType"
      @close-window="changeAvatar = false"
      @nextTask="nextTask"
    />
    <div class="flex justify-center h-[87vh] pt-[102px]">
      <!-- addAvatar -->
      <div
        v-if="name === 'addAvatar'"
        class="flex flex-col items-center text-center"
      >
        <SlideBodyTitle title="Добавьте фото профиля!" />
        <div class="flex flex-col items-center gap-[45px]">
          <div class="max-w-[600px]">
            <article class="font-normal text-[18px] text-center leading-[29px] w-full pl-0">
              <p class=" text-[#4C4C4D]">
                Аватар поможет вашим коллегам быстрее найти Вас в списках.
              </p>
            </article>
          </div>

          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/Jx-TBirC_Cc"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            class="border rounded-xl"
          />

          <div class="mb-3">
            <input
              id="iconfile"
              type="file"
              class="hidden"
              accept="image/png, image/jpeg"
              @change="changeUserPhoto"
            >
            <label
              for="iconfile"
              class="w-[238px] h-[40px] justify-center cursor-pointer bg-[#F2B679] text-[#2E2E2E] text-[14px] px-[68px] py-3 rounded-md hover:bg-slate-200 hover:text-[#422b14] font-medium"
            >
              Загрузить
            </label>
            <br>
          </div>
        </div>
      </div>

      <!-- addEmployees -->
      <div
        v-if="name === 'addEmployees'"
        class="flex flex-col items-center text-center"
      >
        <SlideBodyTitle title="Добавьте сотрудника!" />
        <div class="flex flex-col items-center gap-[45px]">
          <div class="max-w-[600px]">
            <article class="font-normal text-[18px] text-center leading-[29px] w-full pl-0">
              <p class=" text-[#4C4C4D]">
                И Вы сможете поручать задачи, делегировать работу с клиентами и многое другое.
              </p>
            </article>
          </div>

          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/Jx-TBirC_Cc"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            class="border rounded-xl"
          />

          <SlideBodyButton
            text="Добавить сотрудников"
            @click="clickAddEmployees"
          />
        </div>
      </div>

      <!-- doitnowstart -->
      <div
        v-if="name === 'doitnowstart'"
        class="flex flex-col items-center text-center"
      >
        <SlideBodyTitle title="Вы в Очереди!" />
        <div class="flex flex-col items-center gap-[45px]">
          <div class="max-w-[600px]">
            <article class="font-normal text-[18px] text-center leading-[29px] w-full pl-0">
              <p class=" text-[#4C4C4D]">
                Она выдает вам задачи, заявки и важные уведомления по очереди, а Вы работаете с ними сфокусировано и не отвлекаетесь.
              </p>
            </article>
          </div>

          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/Jx-TBirC_Cc"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            class="border rounded-xl"
          />

          <SlideBodyButton
            text="Начать"
            @click="clickAddEmployees"
          />
        </div>
      </div>

      <!-- delegateTasks -->
      <div
        v-if="name === 'delegateTasks'"
        class="flex flex-col items-center text-center"
      >
        <SlideBodyTitle title="Делегируйте задачи!" />
        <div class="flex flex-col items-center gap-[45px]">
          <div class="max-w-[600px]">
            <article class="font-normal text-[18px] text-center leading-[29px] w-full pl-0">
              <p class=" text-[#4C4C4D]">
                Поручите задачу сотруднику, а наш бот проследит за ее выполнением в срок.
              </p>
            </article>
          </div>

          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/Jx-TBirC_Cc"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            class="border rounded-xl"
          />

          <SlideBodyButton
            v-if="name === 'delegateTasks'"
            text="Поручить задачу"
            @click="showInspector = true"
          />
        </div>
      </div>
    </div>
    <template #buttons>
      <DoitnowRightButtonPostpone
        :is-animation-doitnow="isAnimationDoitnow"
        @postpone="onPostpone"
      />
    </template>
  </DoitnowContent>
</template>
<script>
import DoitnowContent from '@/components/Doitnow/DoitnowContent.vue'
import DoitnowRightButtonPostpone from '@/components/Doitnow/DoitnowRightButtonPostpone.vue'

import InspectorModalBox from '@/components/Inspector/InspectorModalBox.vue'
import SlideBodyButton from './SlideBodyButton.vue'
import SlideBodyTitle from './SlideBodyTitle.vue'
import { NAVIGATOR_SUCCESS } from '@/store/actions/navigator'
import * as SLIDES from '@/store/actions/slides.js'
import UploadAvatar from '../UploadAvatar.vue'

export default {
  components: {
    DoitnowRightButtonPostpone,
    DoitnowContent,
    InspectorModalBox,
    SlideBodyButton,
    SlideBodyTitle,
    UploadAvatar
  },
  props: {
    name: {
      type: String,
      default: 'text'
    },
    isAnimationDoitnow: {
      type: Boolean,
      default: false
    }
  },
  emits: ['next'],
  data () {
    return {
      showInspector: false,
      showSlide: true,
      uploadedAvatar: '',
      changeAvatar: false,
      avatarType: ''
    }
  },
  computed: {
    storeNavigator () {
      return this.$store.getters.sortedNavigator
    }
  },
  watch: {
    showSlide (newval, oldval) {
      if (!newval) {
        this.nextTask()
      }
    }
  },
  methods: {
    clickAddAvatar () {
      this.nextTask()
      this.$router.push('/account/myaccount')
      this.$store.commit(NAVIGATOR_SUCCESS)
    },
    changeUserPhoto (event) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']
      const file = event.target.files[0]
      if (!allowedTypes.includes(file.type)) {
        this.notAllowedImageType = true
        return
      }
      if (file) {
        const reader = new FileReader()
        reader.addEventListener('load', () => {
          this.uploadedAvatar = reader.result
          this.avatarType = file.type
          this.changeAvatar = true
        })
        reader.readAsDataURL(file)
      }
    },
    nextTask () {
      this.$emit('next')
    },
    clickAddEmployees () {
      this.nextTask()
      this.$router.push('/settings/employees')
      this.$store.commit(NAVIGATOR_SUCCESS)
    },
    clickDoitnowStartSuccess () {
      this.$store.commit(SLIDES.CHANGE_VISIBLE, { name: 'doitnowstart', visible: false })
      this.nextTask()
    },
    clickAddReglament () {
      this.nextTask()
      this.$router.push('/reglaments')
      this.$store.commit(NAVIGATOR_SUCCESS)
    },
    onPostpone (date) {
      const year = String(date.getFullYear()).padStart(4, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')
      const dateStr = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
      //
      const slide = {
        name: this.name,
        visible: true,
        reminder: dateStr
      }
      this.$store.commit(SLIDES.CHANGE_VISIBLE, slide)
      this.nextTask()
    }
  }
}
</script>
