<template>
  <div id="map" style="height: 100vh;"></div>
</template>

<script>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon from '../assets/marker-icon-2x.png'
import markerShadow from '../assets/marker-shadow.png'

export default {
  name: 'MapView',
  data () {
    return {
      map: null
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.initializeMap()
    })
  },
  methods: {
    async initializeMap () {
      const mapElement = document.getElementById('map')
      if (!mapElement) {
        console.error('Carte non initialisée, élément DOM introuvable.')
        return
      }
      this.map = L.map(mapElement).setView([50.8503, 4.3517], 13)
      const DefaultIcon = L.icon({
        iconUrl: markerIcon,
        shadowUrl: markerShadow,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      })
      L.Marker.prototype.options.icon = DefaultIcon
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map)
      try {
        const response = await fetch('http://localhost:3000/restaurants', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        const restaurants = await response.json()
        this.addMarkers(restaurants)
      } catch (error) {
        console.error('Erreur lors de la récupération des restaurants:', error)
      }
    },
    addMarkers (restaurants) {
      if (this.map) {
        restaurants.forEach((restaurant) => {
          const url = `https://www.google.com/search?q=${encodeURIComponent(restaurant.name)}`
          L.marker([restaurant.latitude, restaurant.longitude])
            .addTo(this.map)
            .bindPopup(`<b><a href="${url}" target="_blank">${restaurant.name}</a></b><br>${restaurant.address}`)
        })
      } else {
        console.error('Carte non initialisée')
      }
    }
  }
}
</script>
