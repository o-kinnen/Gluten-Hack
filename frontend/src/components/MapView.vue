<template>
    <div class="map-container" ref="map"></div>
</template>

<script>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
export default {
  name: 'MapView',
  data () {
    return {
      map: null
    }
  },
  mounted () {
    this.map = L.map(this.$refs.map).setView([50.8503, 4.3517], 13) // Centre de Bruxelles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map)
    const restaurants = [
      { name: 'Restaurant 1', lat: 50.8503, lng: 4.3517 },
      { name: 'Restaurant 2', lat: 50.8523, lng: 4.3587 }

    ]
    restaurants.forEach((restaurant) => {
      L.marker([restaurant.lat, restaurant.lng])
        .addTo(this.map)
        .bindPopup(restaurant.name)
    })
  }
}
</script>
<style scoped>
  .map-container {
    height: 100vh;
    width: 100%;
  }
</style>
