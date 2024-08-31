<template>
  <div class="container text-center d-flex flex-column justify-content-center align-items-center" style="height: 100vh;">
    <div class="d-flex align-items-center mb-4">
      <h1 class="text-white">Trouver un restaurant</h1>
    </div>
    <div class="d-flex mb-4 align-items-center" style="width: 100%; max-width: 600px;">
      <input v-model="searchLocation" @blur="v$.searchLocation.$touch()" type="text" class="form-control" placeholder="Entrez un lieu situé en Belgique (ville, adresse)" :class="{'is-invalid': v$.searchLocation.$error}">
      <button class="btn btn-login rounded text-white" @click="searchByLocation" :disabled="v$.searchLocation.$invalid">Rechercher</button>
    </div>
    <div v-if="v$.searchLocation.$error" class="text-danger mb-3">
      Veuillez entrer un lieu valide.
    </div>
    <div class="map-container rounded">
      <div id="map" class="map-content"></div>
    </div>
    <div class="text-white mt-4">
      <p>Données fournies par <a href="https://www.yelp.com" target="_blank" class="text-white">Yelp</a> et <a href="https://foursquare.com" target="_blank" class="text-white">Foursquare</a>.</p>
    </div>
  </div>
</template>

<script>
import { required } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

export default {
  name: 'MapView',
  data () {
    return {
      map: null,
      defaultCoords: [4.3517, 50.8503],
      searchLocation: '',
      markers: []
    }
  },
  validations () {
    return {
      searchLocation: { required }
    }
  },
  setup () {
    return { v$: useVuelidate() }
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
              this.loadRestaurants(longitude, latitude)
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
        this.loadRestaurants(this.defaultCoords[0], this.defaultCoords[1])
      }
    },
    async searchByLocation () {
      this.v$.$touch()
      if (this.v$.$invalid) {
        return
      }

      try {
        this.clearMarkers()
        const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(this.searchLocation)}.json?access_token=${mapboxgl.accessToken}&country=BE`)
        const data = await response.json()
        if (data.features && data.features.length > 0) {
          const [longitude, latitude] = data.features[0].geometry.coordinates
          this.map.flyTo({
            center: [longitude, latitude],
            zoom: 13
          })
          await this.loadRestaurants(longitude, latitude)
        } else {
          alert('Lieu introuvable en Belgique, veuillez essayer une autre adresse.')
        }
      } catch (error) {
        console.error('Erreur lors de la recherche par lieu:', error)
      }
    },
    handleGeolocationError (error) {
      if (error) {
        console.error('Geolocation error:', error.message)
        alert('Erreur de géolocalisation. Nous utiliserons les coordonnées par défaut pour afficher les restaurants.')
      }
      this.loadRestaurants(this.defaultCoords[0], this.defaultCoords[1])
    },
    clearMarkers () {
      this.markers.forEach(marker => marker.remove())
      this.markers = []
    },
    async loadRestaurants (longitude, latitude) {
      await this.loadYelpRestaurants(longitude, latitude)
      await this.loadFoursquareRestaurants(longitude, latitude)
    },
    async loadYelpRestaurants (longitude, latitude) {
      try {
        const response = await fetch(`${process.env.VUE_APP_URL_BACKEND}/api/yelp-restaurants?latitude=${latitude}&longitude=${longitude}&term=gluten-free`, {
          credentials: 'include'
        })
        const data = await response.json()
        if (data.businesses && data.businesses.length > 0) {
          const restaurants = data.businesses.map(business => ({
            name: business.name,
            address: business.location.address1,
            latitude: business.coordinates.latitude,
            longitude: business.coordinates.longitude
          }))
          this.addMarkers(restaurants)
        } else {
          alert('Aucun restaurant sans gluten trouvé pour ce lieu via Yelp.')
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des restaurants via Yelp:', error)
      }
    },
    async loadFoursquareRestaurants (longitude, latitude) {
      try {
        const response = await fetch(
          `https://api.foursquare.com/v3/places/search?ll=${latitude},${longitude}&categories=13065&query=gluten-free&limit=10`,
          {
            headers: {
              Accept: 'application/json',
              Authorization: `${process.env.VUE_APP_FOURSQUARE_API_KEY}`
            }
          }
        )
        if (!response.ok) {
          throw new Error(`Erreur lors de la requête Foursquare: ${response.statusText}`)
        }
        const data = await response.json()
        if (data.results && data.results.length > 0) {
          const restaurants = data.results.map(place => {
            return {
              name: place.name,
              address: place.location.formatted_address,
              latitude: place.geocodes.main.latitude,
              longitude: place.geocodes.main.longitude
            }
          })
          this.addMarkers(restaurants)
        } else {
          alert('Aucun restaurant sans gluten trouvé via Foursquare pour ce lieu.')
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des restaurants via Foursquare:', error)
      }
    },
    addMarkers (restaurants) {
      if (!this.map) {
        console.error('Map is not initialized in addMarkers.')
        return
      }
      restaurants.forEach((restaurant) => {
        const formattedSearch = `${restaurant.name} ${restaurant.address}`
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(formattedSearch)}`
        const marker = new mapboxgl.Marker({ color: 'red' })
          .setLngLat([restaurant.longitude, restaurant.latitude])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 })
              .setHTML(
                `<b><a href="${searchUrl}" target='_blank'>${restaurant.name}</a></b><br>${restaurant.address}`
              )
          )
          .addTo(this.map)
        this.markers.push(marker)
      })
    }
  }
}
</script>
