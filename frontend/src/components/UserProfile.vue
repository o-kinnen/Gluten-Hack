<template>
  <div class="d-flex justify-content-center align-items-center min-vh-50 bg-fond text-white rounded mb-4">
    <div class="card p-4 bg-form rounded" style="width: 400px;">
      <div class="text-center mb-3">
        <img src="../../img/icone.png" alt="Gluten Hack Logo" height="80" class="mb-3">
        <h3 class="text-white">Bienvenue {{ name }} !</h3>
      </div>
      <div class="text-center">
        <p class="text-white">Votre adresse email : {{ email }}</p>
        <button @click="logout" class="btn-color rounded text-white">Se déconnecter</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserProfile',
  data () {
    return {
      name: '',
      email: '',
      errorMessage: ''
    }
  },
  methods: {
    async fetchProfile () {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch('http://localhost:3000/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        const data = await response.json()
        if (response.ok) {
          this.name = data.name
          this.email = data.email
        } else {
          this.errorMessage = data.message || 'Erreur lors de la récupération des informations du profil.'
        }
      } catch (error) {
        this.errorMessage = 'Erreur lors de la communication avec le serveur. Veuillez réessayer plus tard.'
      }
    },
    logout () {
      localStorage.removeItem('token')
      this.$store.dispatch('logout')
      this.$router.push('/')
    }
  },
  created () {
    this.fetchProfile()
  }
}
</script>
