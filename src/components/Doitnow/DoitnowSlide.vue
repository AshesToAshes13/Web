<template>
  <DoitnowContent>
    <DoitnowSlidesModalBoxEmployeeLimit
      v-if="showUsersLimit"
      @cancel="showUsersLimit = false"
      @ok="showUsersLimit = false"
    />
    <DoitnowSlidesModalBoxAddEmployee
      v-if="showAddEmployee"
      :show="showAddEmployee"
      @cancel="showAddEmployee = false"
      @save="onAddNewEmp"
    />
    <DoitnowSlidesModalBoxOtherOrg
      v-if="showOtherOrg"
      @cancel="showOtherOrg = false"
      @ok="showOtherOrg = false"
    />
    <DoitnowSlidesAlreadyExist
      v-if="alreadyExist"
      @cancel="alreadyExist = false"
    />
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
    <!-- Временные паддинги (по дизайну такие) -->
    <div class="flex justify-center mt-[102px]">
      <DoitnowSlideDoitnowStart
        v-if="name === 'doitnowstart'"
        :show-preview-picture="showPreviewPicture"
        @clickDoitnowStartSuccessEmit="clickDoitnowStartSuccess"
        @playVideoEmit="playVideo"
      />
      <!-- addEmployees -->
      <DoitnowSlideAddEmployee
        v-if="name === 'addEmployees'"
        :show-preview-picture="showPreviewPicture"
        @clickAddEmployeesEmit="clickAddEmployees"
        @playVideoEmit="playVideo"
      />
      <!-- delegateTasks -->
      <DoitnowSlideDelegateTasks
        v-if="name === 'delegateTasks'"
        :show-preview-picture="showPreviewPicture"
        @clickShowInspectorEmit="clickShowInspector"
        @playVideoEmit="playVideo"
      />
      <!-- addAvatar -->
      <DoitnowSlidesAddAvatar
        v-if="name === 'addAvatar'"
        :show-preview-picture="showPreviewPicture"
        @playVideoEmit="playVideo"
        @changeUserPhotoEmit="changeUserPhoto"
      />
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
import { NAVIGATOR_SUCCESS } from '@/store/actions/navigator'
import * as SLIDES from '@/store/actions/slides.js'
import UploadAvatar from '../UploadAvatar.vue'
import * as EMPLOYEE from '@/store/actions/employees'
import DoitnowSlideDoitnowStart from './DoitnowSlides/DoitnowSlideDoitnowStart.vue'
import DoitnowSlideAddEmployee from './DoitnowSlides/DoitnowSlideAddEmployee.vue'
import DoitnowSlidesModalBoxEmployeeLimit from './DoitnowSlides/DoitnowSlidesModalBoxEmployeeLimit.vue'
import DoitnowSlidesModalBoxAddEmployee from './DoitnowSlides/DoitnowSlidesModalBoxAddEmployee.vue'
import DoitnowSlidesModalBoxOtherOrg from './DoitnowSlides/DoitnowSlidesModalBoxOtherOrg.vue'
import DoitnowSlidesAlreadyExist from './DoitnowSlides/DoitnowSlidesAlreadyExist.vue'
import DoitnowSlideDelegateTasks from './DoitnowSlides/DoitnowSlideDelegateTasks.vue'
import DoitnowSlidesAddAvatar from './DoitnowSlides/DoitnowSlidesAddAvatar.vue'

export default {
  components: {
    DoitnowRightButtonPostpone,
    DoitnowContent,
    InspectorModalBox,
    UploadAvatar,
    DoitnowSlideDoitnowStart,
    DoitnowSlideAddEmployee,
    DoitnowSlidesModalBoxEmployeeLimit,
    DoitnowSlidesModalBoxAddEmployee,
    DoitnowSlidesModalBoxOtherOrg,
    DoitnowSlidesAlreadyExist,
    DoitnowSlideDelegateTasks,
    DoitnowSlidesAddAvatar
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
      avatarType: '',
      showPreviewPicture: true,
      showAddEmployee: false,
      showUsersLimit: false,
      showOtherOrg: false,
      alreadyExist: false

    }
  },
  computed: {
    storeNavigator () {
      return this.$store.getters.sortedNavigator
    },
    isLicenseExpired () {
      return this.$store.getters.isLicenseExpired
    },
    user () {
      return this.$store.state.user.user
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
      this.showPreviewPicture = true
      this.$emit('next')
    },
    clickShowInspector () {
      this.showInspector = true
    },
    clickAddEmployees () {
      if (this.isLicenseExpired) {
        this.showUsersLimit = true
        return
      }
      // если у нас куплены рабочие места
      // проверяем на превышение лицензии
      if (this.user.count_workplaces !== 0 && this.user.count_workplaces <= this.currUserWorkspaces) {
        this.showUsersLimit = true
        return
      }

      this.showAddEmployee = true
      this.$store.commit(NAVIGATOR_SUCCESS)
    },
    onAddNewEmp (name, email) {
      this.showAddEmployee = false
      const empName = name.trim()
      const empEmail = email.trim()
      if (empName && empEmail) {
        this.$store.dispatch(EMPLOYEE.CREATE_EMPLOYEE_REQUEST, {
          name: empName,
          email: empEmail
        })
          .catch((e) => {
            if (e.response?.data?.error === 'the employee is already present in this organization' || e.response?.data?.error === 'the employee has license') {
              this.showOtherOrg = true
            }
            if (e.response?.data?.error === 'the employee is the director of the organization') {
              this.alreadyExist = true
            }
          })
          .then((resp) => {
            this.$store.commit(SLIDES.CHANGE_VISIBLE, { name: 'addEmployees', visible: false })
            this.nextTask()
            console.log('onAddNewEmp', resp)
          })
      }
    },
    clickDoitnowStartSuccess () {
      this.$store.commit(SLIDES.CHANGE_VISIBLE, { name: 'doitnowstart', visible: false })
      this.nextTask()
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
    },
    playVideo () {
      this.showPreviewPicture = false
    }
  }
}
</script>
