<template>
  <div class="d-flex justify-content-center align-items-center vh-100 bg-fond text-white rounded mb-4">
    <div class="card p-4 bg-form rounded" style="width: 400px;">
      <div class="text-center mb-3">
        <h3 class="text-white">Créer un compte</h3>
      </div>
      <form @submit.prevent="register">
        <div class="mb-3">
          <label for="name" class="form-label text-white">Nom</label>
          <input type="text" v-model="name" class="form-control" id="name" placeholder="Votre nom">
        </div>
        <div class="mb-3">
          <label for="email" class="form-label text-white">Email</label>
          <input type="email" v-model="email" class="form-control" id="email" placeholder="exemple@gmail.com">
        </div>
        <div class="mb-3">
          <label for="password" class="form-label text-white">Mot de passe</label>
          <input type="password" v-model="password" class="form-control" id="password" placeholder="Veuillez saisir votre mot de passe">
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
          <button type="submit" class="btn btn-login rounded text-white">S'inscrire</button>
        </div>
      </form>
      <div class="text-center mt-3">
        <span class="text-white">Vous avez déjà un compte ? <a href="/login" class="text-white">Se connecter</a></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserRegister',
  data () {
    return {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      errorMessage: '',
      successMessage: ''
    }
  },
  methods: {
    async register () {
      this.errorMessage = ''
      this.successMessage = ''
      if (this.password !== this.confirmPassword) {
        this.errorMessage = 'Les mots de passe ne correspondent pas.'
        return
      }
      try {
        const response = await fetch('http://localhost:3000/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: this.name,
            email: this.email,
            password: this.password
          })
        })
        const data = await response.json()
        if (response.ok) {
          this.successMessage = 'Inscription réussie ! Vous pouvez maintenant vous connecter.'
          this.name = ''
          this.email = ''
          this.password = ''
          this.confirmPassword = ''
        } else {
          this.errorMessage = data.message || 'Registration failed. Please check your details and try again.'
        }
      } catch (error) {
        this.errorMessage = 'Erreur lors de la communication avec le serveur. Veuillez réessayer plus tard.'
      }
    }
  }
}

</script>
