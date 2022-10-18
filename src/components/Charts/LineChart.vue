<template>
  <canvas ref="root" />
</template>

<script>
import {
  Chart,
  LineElement,
  PointElement,
  LineController,
  LinearScale,
  CategoryScale,
  Tooltip
} from 'chart.js'
import { shallowRef } from 'vue'

Chart.register(LineElement, PointElement, LineController, LinearScale, CategoryScale, Tooltip)

export default {
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      chart: null
    }
  },
  watch: {
    data: {
      handler: function (newValue, oldValue) {
        if (newValue) {
          if (this.chart) {
            this.chart.data = newValue
            this.chart.update()
          }
        }
      },
      deep: true
    }
  },
  mounted () {
    this.chart = shallowRef(
      new Chart(this.$refs.root, {
        type: 'line',
        data: this.data,
        options: {
          layout: {
            padding: 3
          },
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              display: false
            },
            x: {
              display: true
            }
          },
          plugins: {
            legend: {
              display: false
            }
          }
        }
      })
    )
  }
}
</script>
