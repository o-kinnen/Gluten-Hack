<template>
    <div class="d-flex justify-content-center align-items-center vh-100 bg-fond text-white rounded mb-4">
      <div class="card p-4 bg-form rounded" style="width: 400px;">
        <div class="text-center mb-3">
          <h3 class="text-white">Réinitialiser le mot de passe</h3>
        </div>
        <form @submit.prevent="resetPassword">
          <div class="mb-3">
            <label for="password" class="form-label text-white">Nouveau mot de passe</label>
            <input type="password" v-model="password" class="form-control" id="password" placeholder="Veuillez saisir votre nouveau mot de passe">
          </div>
          <div class="mb-3">
            <label for="confirmPassword" class="form-label text-white">Confirmez le mot de passe</label>
            <input type="password" v-model="confirmPassword" class="form-control" id="confirmPassword" placeholder="Veuillez saisir à nouveau votre mot de passe">
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
  name: 'ResetPasswordForm',
  data () {
    return {
      password: '',
      confirmPassword: '',
      errorMessage: '',
      successMessage: '',
      token: this.$route.query.token
    }
  },
  methods: {
    async resetPassword () {
      this.errorMessage = ''
      this.successMessage = ''
      if (this.password !== this.confirmPassword) {
        this.errorMessage = 'Les mots de passe ne correspondent pas.'
        return
      }
      try {
        const response = await fetch('http://localhost:3000/users/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token: this.token,
            newPassword: this.password
          })
        })
        const data = await response.json()
        if (data.success) {
          this.successMessage = 'Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter.'
        } else {
          this.errorMessage = data.message || 'Erreur lors de la réinitialisation du mot de passe.'
        }
      } catch (error) {
        this.errorMessage = 'Erreur lors de la communication avec le serveur. Veuillez réessayer plus tard.'
      }
    }
  }
}
</script>
