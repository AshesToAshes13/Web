<template>
  <div>
    <audio
      :id="callLink"
      ref="callMessage"
      class="hidden"
      @timeupdate="playback"
      @ended="ended"
      @pause="pause"
    >
      <source :src="callLink">
    </audio>
  </div>
  <div
    v-if="callLink"
    class="px-2 m-auto"
  >
    <div
      class="flex flex-row justify-center items-center w-full"
    >
      <div
        v-show="!isPlaying"
        class="flex-initial pr-3"
      >
        <svg
          width="12"
          height="14"
          viewBox="0 0 12 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="cursor-pointer"
          @click="toggleAudio()"
        >
          <path
            d="M1.66797 1.66406V12.3307L10.3346 6.9974L1.66797 1.66406Z"
            stroke="#4C4C4D"
            stroke-width="1.66667"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <div
        v-show="isPlaying"
        class="flex-initial pr-3"
      >
        <svg
          width="12"
          height="14"
          viewBox="0 0 8 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          @click="toggleAudio()"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M2.66602 9.00016C2.66602 9.17697 2.59578 9.34654 2.47075 9.47157C2.34573 9.59659 2.17616 9.66683 1.99935 9.66683H1.33268C1.15587 9.66683 0.986302 9.59659 0.861278 9.47157C0.736254 9.34654 0.666016 9.17697 0.666016 9.00016V1.00016C0.666016 0.823352 0.736254 0.653783 0.861278 0.528758C0.986302 0.403734 1.15587 0.333496 1.33268 0.333496H1.99935C2.17616 0.333496 2.34573 0.403734 2.47075 0.528758C2.59578 0.653783 2.66602 0.823352 2.66602 1.00016V9.00016ZM7.33268 9.00016C7.33268 9.17697 7.26244 9.34654 7.13742 9.47157C7.0124 9.59659 6.84283 9.66683 6.66602 9.66683H5.99935C5.82254 9.66683 5.65297 9.59659 5.52794 9.47157C5.40292 9.34654 5.33268 9.17697 5.33268 9.00016V1.00016C5.33268 0.823352 5.40292 0.653783 5.52794 0.528758C5.65297 0.403734 5.82254 0.333496 5.99935 0.333496H6.66602C6.84283 0.333496 7.0124 0.403734 7.13742 0.528758C7.26244 0.653783 7.33268 0.823352 7.33268 1.00016V9.00016Z"
            fill="#4C4C4D"
          />
        </svg>
      </div>
      <div class="overlay-container flex justify-center relative">
        <input
          id="position"
          v-model="playbackTime"
          type="range"
          min="0"
          :max="audioDuration"
          class="w-full"
          name="position"
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    callLink: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      playbackTime: 0,
      audioDuration: 100,
      audioLoaded: false,
      isPlaying: false
    }
  },
  watch: {
    playbackTime: function () {
      const diff = Math.abs(this.playbackTime - this.$refs.callMessage.currentTime)
      if (diff > 0.01) {
        this.$refs.callMessage.currentTime = this.playbackTime
      }
    },
    isPlaying: function () {
      if (this.isPlaying) {
        this.initSlider()
        if (!this.listenerActive) {
          this.listenerActive = true
        }
      }
    }
  },
  methods: {
    initSlider () {
      const audio = this.$refs.callMessage
      if (audio) {
        this.audioDuration = Math.round(audio.duration)
      }
    },
    playback (e) {
      const audio = this.$refs.callMessage
      this.playbackTime = audio.currentTime
    },
    pause () {
      this.isPlaying = false
      this.listenerActive = false
    },
    end () {
      this.isPlaying = false
      this.listenerActive = false
    },
    toggleAudio () {
      const audio = this.$refs.callMessage
      if (audio.paused) {
        audio.play()
        this.isPlaying = true
      } else {
        audio.pause()
        this.isPlaying = false
      }
    }
  }
}
</script>

<style scoped>
input[type=range]  {
  width: 200px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  outline: none;
  overflow: hidden;
  height: 2px;
}

input[type=range]::-webkit-slider-runnable-track {
  height: 2px;
  background-color: rgba(0, 0, 0, 0.15);;
}

input[type=range]::-webkit-slider-thumb {
  width: 0px;
  height: 0px;
  -webkit-appearance: none;
  box-shadow: -200px  0 0 200px  #4C4C4D;
}

input[type=range]::-moz-range-track {
  height: 2px;
  background-color: rgba(0, 0, 0, 0.15);;
}

input[type=range]::-moz-range-thumb {
  background: #4C4C4D;
  cursor: pointer;
  height: 2px;
  border-radius:0px;
  box-shadow: -200px  0px 0px 200px   #4C4C4D;
  padding: 0px;
  margin: 0px;
}
</style>
