<template>
  <Overlay>
    <div class="rounded-xl shadow-lg p-[24px] bg-white z-50 flex w-[900px]">
      <div class="grow max-h-[500px] w-[710px]">
        <Cropper
          background-class="bg-transparent"
          :stencil-props="{
            aspectRatio: 1
          }"
          min-width="128"
          min-height="128"
          :src="img"
          @change="change"
        />
      </div>
      <div class="flex flex-col pl-3">
        <button
          class="focus:ring min-w-[90px] focus:outline-none inline-flex cursor-pointer whitespace-nowrap justify-center items-center duration-150 px-[12px] py-[10px] rounded-md bg-[#ff9123] text-white text-[13px] leading-[15px] font-medium font-roboto mb-[5px]"
          @click="uploadAvatar"
        >
          Обновить аватар
        </button>
        <button
          class="focus:ring min-w-[90px] focus:outline-none inline-flex cursor-pointer whitespace-nowrap justify-center items-center duration-150 px-[12px] py-[10px] rounded-md border border-[#ff9123] bg-white text-[#ff9123] text-[13px] leading-[15px] font-medium font-roboto"
          @click="closeWindow"
        >
          Закрыть
        </button>
        <a
          ref="link"
          class="link"
          href="#"
        />
      </div>
    </div>
  </Overlay>
</template>

<script>
import Overlay from '@/components/modals/Overlay'
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'
import * as DOITNOW from '@/store/actions/doitnow.js'
import { USER_CHANGE_PHOTO } from '@/store/actions/user'

export default {
  components: { Overlay, Cropper },
  props: {
    img: {
      type: String,
      default: null
    },
    imageType: {
      type: String,
      default: ''
    }
  },
  emits: ['closeWindow', 'nextTask'],
  data: function () {
    return {
      canvas: null
    }
  },
  methods: {
    uploadAvatar () {
      if (this.imageType === 'image/png') {
        this.fillTransparentPngBgToWhite()
      }
      this.canvas.toBlob((blob) => {
        const formData = new FormData()
        formData.append('files[0]', blob)
        const data = {
          file: formData
        }
        this.$store.dispatch(USER_CHANGE_PHOTO, data)
          .then((resp) => {
            this.$store.commit(DOITNOW.SLIDES_CHANGE_VISIBLE, { name: 'addAvatar', visible: false })
          })
        this.$emit('closeWindow')
        this.$emit('nextTask')
      }, 'image/jpeg')
    },
    fillTransparentPngBgToWhite () {
      // Заполняет пустые пиксели png картинки на белые, чтобы избежать сплошного черного фона при конверте в jpeg
      const imgData = this.canvas.getContext('2d').getImageData(0, 0, this.canvas.width, this.canvas.height)
      const data = imgData.data
      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] < 255) {
          data[i] = 255
          data[i + 1] = 255
          data[i + 2] = 255
          data[i + 3] = 255
        }
      }
      this.canvas.getContext('2d').putImageData(imgData, 0, 0)
    },
    closeWindow () {
      this.$emit('closeWindow')
    },
    change ({ coordinates, canvas }) {
      this.canvas = canvas
    }
  }
}
</script>
