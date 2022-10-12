<template>
  <!-- DATE -->
  <div v-if="isTasks">
    <div
      class="max-w-xl mx-auto"
    >
      <img
        v-show="currentImageIndex === 0"
        class="mx-auto mt-10"
        width="300"
        height="300"
        src="@/assets/images/emptytask.png"
        alt="Empty task image"
      >
      <img
        v-show="currentImageIndex === 1"
        class="mx-auto mt-10"
        width="300"
        height="300"
        src="@/assets/images/emptytask1.png"
        alt="Empty task image"
      >
      <img
        v-show="currentImageIndex === 2"
        class="mx-auto mt-10"
        width="300"
        height="300"
        src="@/assets/images/emptytask2.png"
        alt="Empty task image"
      >
      <!-- Анбоардинг -->
      <div
        v-if="displayModal"
        class="flex flex-col w-[600px]"
      >
        <p class="font-bold p-3">
          Не отвлекайтесь на другие задачи, а работайте только с одной конкретной задачей
        </p>
        <p class="text-sm p-3">
          Работайте с задачами и поручениями, которые должны быть выполнены сегодня
        </p>
        <OnBoardingButton
          @okToModal="okToModal"
        />
      </div>
      <!-- Пустой таск лист -->
      <div
        v-if="!displayModal"
        class="mb-[35px]"
      >
        <p class="text-xl text-[#3D3E40] font-medium mt-10 text-center">
          Задач пока нет.<br> Создайте задачи на сегодня или запланируйте завтрашний день.
        </p>
        <div class="grid grid-cols-1">
          <button
            class="w-[238px] h-[40px] bg-[#FF912380] px-2 rounded-[8px] text-[#3D3E40] text-sm hover:bg-[#F5DEB3] mr-auto ml-auto mt-[35px] whitespace-nowrap font-medium font-[16px]"
            @click="goToNextDay"
          >
            Запланировать завтра
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- PROJECT -->
  <div v-if="isProjects">
    <div
      class="pointer-events-none max-w-xl mx-auto"
    >
      <img
        class="mx-auto mt-10"
        width="300"
        height="300"
        src="@/assets/images/emptyproject.png"
        alt="Empty task image"
      >
      <p class="text-xl text-center font-bold">
        Для чего нужны проекты?
      </p>
      <div class="flex items-center mt-10">
        <icon
          :path="ready.path"
          :width="ready.width"
          :height="ready.height"
          :box="ready.viewBox"
          class="cursor-pointer hover:text-gray-800 mr-2 text-green-500"
        />
        <p class="text-lg text-left text-gray-600">
          Ставьте цели и планы на будущее
        </p>
      </div>
      <div class="flex items-center mt-3">
        <icon
          :path="ready.path"
          :width="ready.width"
          :height="ready.height"
          :box="ready.viewBox"
          class="cursor-pointer hover:text-gray-800 mr-2 text-green-500"
        />
        <p class="text-lg text-left text-gray-600">
          Работайте над задачами в команде
        </p>
      </div>
      <div class="flex items-center mt-3">
        <icon
          :path="ready.path"
          :width="ready.width"
          :height="ready.height"
          :box="ready.viewBox"
          class="cursor-pointer hover:text-gray-800 mr-2 text-green-500"
        />
        <p class="text-lg text-left text-gray-600">
          Сохраняйте личные файлы, встречи, поездки и т.д.
        </p>
      </div>
      <div class="flex items-center mt-3">
        <icon
          :path="ready.path"
          :width="ready.width"
          :height="ready.height"
          :box="ready.viewBox"
          class="cursor-pointer hover:text-gray-800 mr-2 text-green-500"
        />
        <p class="text-lg text-left text-gray-600">
          Собирайте списки ваших любимых книг, фильмов и т.д.
        </p>
      </div>
      <div class="flex items-center mt-3">
        <icon
          :path="ready.path"
          :width="ready.width"
          :height="ready.height"
          :box="ready.viewBox"
          class="cursor-pointer hover:text-gray-800 mr-2 text-green-500"
        />
        <p class="text-lg text-left text-gray-600">
          Начните работу с проектом, создав задачу
        </p>
      </div>
    </div>
  </div>

  <!-- TAG -->
  <div v-if="isTags">
    <div
      class="pointer-events-none max-w-xl mx-auto"
    >
      <img
        class="mx-auto mt-10"
        width="300"
        height="300"
        src="@/assets/images/emptytag.png"
        alt="Empty task image"
      >
      <p class="text-xl text-center font-bold">
        Для чего нужны метки?
      </p>
      <div class="flex items-center mt-10">
        <icon
          :path="ready.path"
          :width="ready.width"
          :height="ready.height"
          :box="ready.viewBox"
          class="cursor-pointer hover:text-gray-800 mr-2 text-green-500"
        />
        <p class="text-lg text-left text-gray-600">
          Группируйте похожие задачи в списки дел
        </p>
      </div>
      <div class="flex items-center mt-3">
        <icon
          :path="ready.path"
          :width="ready.width"
          :height="ready.height"
          :box="ready.viewBox"
          class="cursor-pointer hover:text-gray-800 mr-2 text-green-500"
        />
        <p class="text-lg text-left text-gray-600">
          Сосредоточьте работу вашей команды на главном
        </p>
      </div>
      <div class="flex items-center mt-3">
        <icon
          :path="ready.path"
          :width="ready.width"
          :height="ready.height"
          :box="ready.viewBox"
          class="cursor-pointer hover:text-gray-800 mr-2 text-green-500"
        />
        <p class="text-lg text-left text-gray-600">
          Визуализируйте порядок выполнения задач
        </p>
      </div>
      <div class="flex items-center mt-3">
        <icon
          :path="ready.path"
          :width="ready.width"
          :height="ready.height"
          :box="ready.viewBox"
          class="cursor-pointer hover:text-gray-800 mr-2 text-green-500"
        />
        <p class="text-lg text-left text-gray-600">
          Начните работу с меткой, создав задачу
        </p>
      </div>
    </div>
  </div>

  <!-- COLOR  -->
  <div v-if="isColors">
    <div
      class="pointer-events-none max-w-xl mx-auto"
    >
      <img
        class="mx-auto mt-10"
        width="300"
        height="300"
        src="@/assets/images/emptycolor.png"
        alt="Empty task image"
      >
      <p class="text-xl text-center font-bold mt-5">
        Для чего нужны цвета?
      </p>
      <div class="flex items-center mt-10">
        <icon
          :path="ready.path"
          :width="ready.width"
          :height="ready.height"
          :box="ready.viewBox"
          class="cursor-pointer hover:text-gray-800 mr-2 text-green-500"
        />
        <p class="text-lg text-left text-gray-600">
          Выделяйте основные задачи в большом списке дел
        </p>
      </div>
      <div class="flex items-center mt-3">
        <icon
          :path="ready.path"
          :width="ready.width"
          :height="ready.height"
          :box="ready.viewBox"
          class="cursor-pointer hover:text-gray-800 mr-2 text-green-500"
        />
        <p class="text-lg text-left text-gray-600">
          Сосредоточьте внимание команды на том, что важно
        </p>
      </div>
      <div class="flex items-center mt-3">
        <icon
          :path="ready.path"
          :width="ready.width"
          :height="ready.height"
          :box="ready.viewBox"
          class="cursor-pointer hover:text-gray-800 mr-2 text-green-500"
        />
        <p class="text-lg text-left text-gray-600">
          Оживите скучные списки дел
        </p>
      </div>
      <div class="flex items-center mt-3">
        <icon
          :path="ready.path"
          :width="ready.width"
          :height="ready.height"
          :box="ready.viewBox"
          class="cursor-pointer hover:text-gray-800 mr-2 text-green-500"
        />
        <p class="text-lg text-left text-gray-600">
          Начните работу с цветом, создав задачу
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import Icon from '@/components/Icon.vue'
import ready from '@/icons/ready.js'
import * as TASK from '@/store/actions/tasks.js'
import { USER_VIEWED_MODAL } from '@/store/actions/onboarding.js'
import OnBoardingButton from '../onBoarding/onBoardingButton.vue'

export default {
  components: {
    Icon,
    OnBoardingButton
  },
  data () {
    return {
      ready,
      tomorrow: '',
      DATE_UID: '901841d9-0016-491d-ad66-8ee42d2b496b',
      COLOR_UID: 'ed8039ae-f3de-4369-8f32-829d401056e9',

      currentImageIndex: Math.floor(Math.random() * 3)
    }
  },
  computed: {
    isTags () { return this.$route.name === 'tags' },
    isProjects () { return this.$route.name === 'project' },
    isColors () { return this.$route.name === 'colors' },
    isTasks () { return this.$route.name === 'tasksToday' },
    displayModal () {
      return !this.$store.state.onboarding.visitedModals?.includes('tasks') && this.$store.state.onboarding.showModals
    }
  },
  methods: {
    dateToLabelFormat (calendarDate) {
      const day = calendarDate.getDate()
      const month = calendarDate.toLocaleString('default', { month: 'short' })
      const weekday = calendarDate.toLocaleString('default', {
        weekday: 'short'
      })
      return day + ' ' + month + ', ' + weekday
    },
    getTomorrow () {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      this.tomorrow = `${tomorrow.getFullYear()}-${('0' + (tomorrow.getMonth() + 1)).slice(-2)}-${('0' + (tomorrow.getDate())).slice(-2)}`
      console.log(this.tomorrow)
    },
    goToNextDay () {
      this.getTomorrow()
      this.$router.push('/tasks/' + this.tomorrow)
      this.$store.commit(TASK.CLEAN_UP_LOADED_TASKS)
    },
    okToModal () {
      this.$store.commit(USER_VIEWED_MODAL, 'tasks')
    }
  }
}
</script>
