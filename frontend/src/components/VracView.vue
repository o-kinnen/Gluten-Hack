<template>
  <div class="container text-center mt-5">
    <h2 class="text-white">Prendre en photo l'aliment</h2>
    <div class="d-flex justify-content-center align-items-center">
      <div class="card card-custom mb-5">
        <div class="card-body">
          <div class="camera">
            <video id="video" class="w-100" v-show="!photoTaken" autoplay></video>
            <canvas id="canvas" class="w-100" v-show="photoTaken"></canvas>
          </div>
          <div v-if="!photoTaken" class="mt-3">
            <button class="btn btn-login rounded text-white" @click="takePhoto">Prendre une photo</button>
          </div>
          <div v-if="photoTaken" class="mt-3">
            <button class="btn btn-login rounded text-white" @click="retakePhoto">Prendre une autre photo</button>
          </div>
          <p v-if="detectedItem" class="mt-3 text-white">
            Aliment détecté : {{ detectedItem }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'VracView',
  data () {
    return {
      detectedItem: '',
      videoElement: null,
      photoTaken: false
    }
  },
  mounted () {
    this.startCamera()
  },
  methods: {
    async startCamera () {
      this.videoElement = document.getElementById('video')
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        this.videoElement.srcObject = stream
      } catch (error) {
        console.error('Erreur d\'accès à la caméra :', error)
      }
    },
    async takePhoto () {
      const canvas = document.getElementById('canvas')
      const context = canvas.getContext('2d')
      const video = this.videoElement
      const scaleFactor = 0.5
      canvas.width = video.videoWidth * scaleFactor
      canvas.height = video.videoHeight * scaleFactor
      context.drawImage(video, 0, 0, canvas.width, canvas.height)
      this.photoTaken = true
      const dataURL = canvas.toDataURL('image/jpeg', 0.7)
      try {
        const response = await axios.post(
          `${process.env.VUE_APP_URL_BACKEND}/api/recognize-food`,
          {
            image: dataURL.split(',')[1]
          }
        )
        const labels = response.data.labels
        labels.sort((a, b) => b.score - a.score)
        const topLabel = labels.find(label => label.score > 0.7)
        if (topLabel) {
          this.detectedItem = topLabel.description
          console.log('Aliment détecté :', this.detectedItem)
        } else {
          console.log('Aucun aliment spécifique détecté.')
          this.detectedItem = 'Inconnu'
        }
      } catch (error) {
        console.error('Erreur lors de la détection :', error)
      }
    },
    retakePhoto () {
      this.photoTaken = false
      this.detectedItem = ''
      this.startCamera()
    }
  }
}
</script>
