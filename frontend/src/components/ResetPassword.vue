<template>
  <div class="d-flex justify-content-center align-items-center vh-100 bg-fond text-white rounded mb-4">
    <div class="card p-4 bg-form rounded" style="width: 400px;">
      <div class="text-center mb-3">
        <h3 class="text-white">Réinitialiser le mot de passe</h3>
      </div>
      <form @submit.prevent="sendResetLink">
        <div class="mb-3">
          <label for="email" class="form-label text-white">Email</label>
          <input type="email" v-model="email" class="form-control" id="email" placeholder="exemple@domaine.com">
        </div>
        <div v-if="errorMessage" class="alert alert-danger" role="alert">
          {{ errorMessage }}
        </div>
        <div v-if="successMessage" class="alert alert-success" role="alert">
          {{ successMessage }}
        </div>
        <div class="d-grid gap-2 mt-3">
          <button type="submit" class="btn btn-login rounded text-white">Réinitialiser le mot de passe</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ResetPassword',
  data () {
    return {
      email: '',
      errorMessage: '',
      successMessage: ''
    }
  },
  methods: {
    async sendResetLink () {
      this.errorMessage = ''
      this.successMessage = ''
      try {
        const response = await fetch('http://localhost:3000/users/send-reset-link', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: this.email })
        })
        const data = await response.json()
        if (data.success) {
          this.successMessage = 'Un email de réinitialisation de mot de passe a été envoyé.'
        } else {
          this.errorMessage = data.message || 'Erreur lors de l\'envoi de l\'email de réinitialisation.'
        }
      } catch (error) {
        this.errorMessage = 'Erreur lors de la communication avec le serveur. Veuillez réessayer plus tard.'
      }
    }
  }
}
</script>
