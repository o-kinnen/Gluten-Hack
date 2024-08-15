<template>
  <div class="d-flex justify-content-center align-items-center min-vh-50 bg-fond text-white rounded mb-4">
    <div class="card p-4 bg-form rounded" style="width: 400px;">
      <div class="text-center mb-3">
        <img src="../../img/icone.png" alt="Gluten Hack Logo" height="80" class="mb-3">
        <h3 class="text-white">Bienvenue {{ name }} !</h3>
      </div>
      <div class="text-center">
        <button @click="logout" class="btn btn-color rounded text-white mb-3">Se déconnecter</button>
      </div>
      <div class="text-center">
        <button @click="deleteAccount" class="btn btn-color rounded text-white">Supprimer le compte</button>
      </div>
      <div v-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
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
        const response = await fetch(`${process.env.VUE_APP_URL_BACKEND}/users/profile`, {
          credentials: 'include'
        })
        const data = await response.json()
        if (response.ok) {
          this.name = data.name
          this.email = data.email
        } else {
          this.errorMessage = data.message || 'Erreur lors de la récupération des informations du profil.'
          this.$router.push('/login')
        }
      } catch (error) {
        this.errorMessage = 'Erreur lors de la communication avec le serveur. Veuillez réessayer plus tard.'
      }
    },
    async logout () {
      try {
        const response = await fetch(`${process.env.VUE_APP_URL_BACKEND}/users/logout`, {
          method: 'POST',
          credentials: 'include'
        })
        if (response.ok) {
          this.$store.dispatch('logout')
          this.$router.push('/login')
        } else {
          this.errorMessage = 'Erreur lors de la déconnexion.'
        }
      } catch (error) {
        this.errorMessage = 'Erreur lors de la déconnexion.'
      }
    },
    async deleteAccount () {
      if (confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
        try {
          const response = await fetch(`${process.env.VUE_APP_URL_BACKEND}/users/delete`, {
            method: 'DELETE',
            credentials: 'include'
          })
          if (response.ok) {
            alert('Votre compte a été supprimé avec succès.')
            this.logout()
          } else {
            this.errorMessage = 'Erreur lors de la suppression du compte.'
          }
        } catch (error) {
          this.errorMessage = 'Erreur lors de la suppression du compte.'
        }
      }
    }
  },
  created () {
    this.fetchProfile()
  }
}
</script>
