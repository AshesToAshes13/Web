<template>
  <ModalBox
    :title="title"
    @cancel="onCancel"
  >
    <form
      class="flex flex-col"
      @submit="onSave"
    >
      <span
        v-if="error"
        class="red-500"
      >
        {{ error }}
      </span>
      <div class="mb-3 flex flex-col">
        <label for="atsKey">
          <span class="mb-1">Ключ для авторизации в АТС</span>
          <span class="mb-1 text-[11px] block">(генерируется автоматически в Личном Кабинете Мегафон)</span>
        </label>
        <input
          id="atsKey"
          v-model="atsKey"
          name="atsKey"
          type="text"
          class="bg-[#f4f5f7]/50 rounded-[6px] focus:ring-0 border w-full px-[14px] py-[11px] text-[14px] leading-[16px] text-[#4c4c4d] font-roboto"
        >
      </div>
      <div class="mb-3 flex flex-col">
        <span class="mb-1">Ссылка на АТС</span>
        <input
          v-model="atsLink"
          type="text"
          class="bg-[#f4f5f7]/50 rounded-[6px] focus:ring-0 border w-full px-[14px] py-[11px] text-[14px] leading-[16px] text-[#4c4c4d] font-roboto"
        >
      </div>
      <div class="mb-3 flex flex-col">
        <span class="mb-1">Ключ для авторизации в ЛидерТаск CRM</span>
        <input
          v-model="crmKey"
          type="text"
          class="bg-[#f4f5f7]/50 rounded-[6px] focus:ring-0 border w-full px-[14px] py-[11px] text-[14px] leading-[16px] text-[#4c4c4d] font-roboto"
        >
      </div>
      <div class="mb-3 flex flex-col">
        <span class="mb-1">Пользователи Мегафон</span>
        <span class="mb-1 text-[11px]">Установите пользователям ЛидерТаск их логины из ЛК Мегафон</span>
        <div
          v-for="(megafonUser, index) in megafonUsers"
          :key="index"
          class="mb-1 flex"
        >
          <EmployeesPopper
            v-model="megafonUser.uidUser"
            class="mr-2"
            :can-edit="true"
            :org-employees="orgEmployees"
          />
          <input
            v-model="megafonUser.megafonUserLogin"
            class="block bg-[#f4f5f7]/50 rounded-[6px] focus:ring-0 border w-full px-[5px] py-[3px] text-[14px] leading-[16px] text-[#4c4c4d] font-roboto"
          >
        </div>
        <button
          class="mb-3"
          type="button"
          @click="onAddNewMegafonUser"
        >
          Добавить
        </button>
      </div>
      <button
        type="submit"
        class="focus:ring min-w-[90px] focus:outline-none inline-flex cursor-pointer whitespace-nowrap justify-center items-center duration-150 px-[12px] py-[10px] rounded-md bg-[#ff9123] text-white text-[13px] leading-[15px] font-medium font-roboto disabled:opacity-70 disabled:cursor-default"
      >
        Сохранить
      </button>
    </form>
  </ModalBox>
</template>
<script>
import ModalBox from '@/components/modals/ModalBox.vue'
import EmployeesPopper from '../Employees/EmployeesPopper.vue'

export default {
  components: {
    ModalBox,
    EmployeesPopper
  },
  props: {
    error: {
      type: String,
      default: ''
    }
  },
  emits: ['onSave', 'onCancel'],
  data () {
    return {
      atsKey: this.$store.state.corpMegafonIntegration.atsKey,
      atsLink: this.$store.state.corpMegafonIntegration.atsLink,
      crmKey: this.$store.state.corpMegafonIntegration.crmKey,
      megafonUsers: this.$store.state.corpMegafonIntegration.megafonUsers
    }
  },
  computed: {
    orgEmployees () {
      return this.$store.state.navigator.navigator.emps.items
    }
  },
  methods: {
    onSave (event) {
      event.preventDefault()
      this.megafonUsers = this.megafonUsers.filter(user => user.uidUser !== '' || user.megafonUserLogin !== '')
      this.$emit('onSave', {
        crmKey: this.crmKey,
        atsKey: this.atsKey,
        atsLink: this.atsLink,
        megafonUsers: this.megafonUsers
      })
    },
    onCancel () {
      this.$emit('onCancel')
    },
    onAddNewMegafonUser () {
      this.megafonUsers.push({
        uidUser: '',
        megafonUserLogin: ''
      })
    }
  }
}
</script>
