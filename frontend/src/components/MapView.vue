<template>
  <div class="container text-center d-flex flex-column justify-content-center align-items-center" style="height: 100vh;">
    <h1 class="text-center text-white mb-4">Trouver un restaurant</h1>
    <img src="../../img/map.gif" alt="Gluten Hack Logo" height="100" class="mb-3">
    <div class="map-container rounded">
      <div id="map" class="map-content"></div>
    </div>
  </div>
</template>

<script>
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
export default {
  name: 'MapView',
  data () {
    return {
      map: null,
      defaultCoords: [4.3517, 50.8503],
      isGeolocationSupported: true
    }
  },
  mounted () {
    this.initializeMap()
  },
  methods: {
    initializeMap () {
      mapboxgl.accessToken = process.env.VUE_APP_MAPBOX_API_KEY
      this.map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: this.defaultCoords,
        zoom: 13
      })
      this.map.on('load', () => {
        this.initializeGeolocation()
      })
    },
    initializeGeolocation () {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords
            if (this.map) {
              this.map.flyTo({
                center: [longitude, latitude],
                zoom: 13
              })
              this.addCurrentLocationMarker(longitude, latitude)
              this.loadYelpRestaurants(longitude, latitude)
            } else {
              console.error('Map is not initialized at geolocation success.')
            }
          },
          (error) => {
            this.handleGeolocationError(error)
          }
        )
      } else {
        console.error('Géolocalisation non supportée.')
        this.isGeolocationSupported = false
        this.loadYelpRestaurants(this.defaultCoords[0], this.defaultCoords[1])
      }
    },
    handleGeolocationError (error) {
      if (error) {
        console.error('Geolocation error:', error.message)
        alert('Erreur de géolocalisation. Nous utiliserons les coordonnées par défaut pour afficher les restaurants.')
      }
      this.loadYelpRestaurants(this.defaultCoords[0], this.defaultCoords[1])
    },
    addCurrentLocationMarker (longitude, latitude) {
      if (!this.map) {
        console.error('La carte n\'est pas encore initialisée.')
        return
      }
      new mapboxgl.Marker({ color: 'blue' })
        .setLngLat([longitude, latitude])
        .setPopup(new mapboxgl.Popup().setHTML('<h4>Vous êtes ici</h4>'))
        .addTo(this.map)
    },
    async loadYelpRestaurants (longitude, latitude) {
      try {
        const response = await fetch(`${process.env.VUE_APP_URL_BACKEND}/api/yelp-restaurants?latitude=${latitude}&longitude=${longitude}&term=gluten-free`, {
          credentials: 'include'
        })
        const data = await response.json()
        if (!data.businesses || data.businesses.length === 0) {
          throw new Error('No businesses found in response.')
        }
        const restaurants = data.businesses.map(business => ({
          name: business.name,
          address: business.location.address1,
          latitude: business.coordinates.latitude,
          longitude: business.coordinates.longitude
        }))
        this.addMarkers(restaurants)
      } catch (error) {
        console.error('Erreur lors de la récupération des restaurants sans gluten:', error)
      }
    },
    addMarkers (restaurants) {
      if (!this.map) {
        console.error('Map is not initialized in addMarkers.')
        return
      }
      restaurants.forEach((restaurant) => {
        const url = `https://www.google.com/search?q=${encodeURIComponent(restaurant.name)}`
        new mapboxgl.Marker({ color: 'red' })
          .setLngLat([restaurant.longitude, restaurant.latitude])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 })
              .setHTML(
                `<b><a href='${url}' target='_blank'>${restaurant.name}</a></b><br>${restaurant.address}`
              )
          )
          .addTo(this.map)
      })
    }
  }
}
</script>
