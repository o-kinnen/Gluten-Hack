<template>
  <div class="d-flex justify-content-center align-items-center vh-100 bg-fond text-white rounded mb-4">
    <div class="card p-4 bg-form rounded" style="width: 400px;">
      <div class="text-center mb-3">
        <h3 class="text-white">Bienvenue !</h3>
      </div>
      <form @submit.prevent="login">
        <div class="mb-3">
          <label for="email" class="form-label text-white">Email</label>
          <input type="email" v-model="email" class="form-control" id="email" placeholder="exemple@gmail.com">
        </div>
        <div class="mb-3">
          <label for="password" class="form-label text-white">Mot de passe</label>
          <input type="password" v-model="password" class="form-control" id="password" placeholder="Veuillez saisir votre mot de passe">
        </div>
        <div v-if="errorMessage" class="alert alert-danger" role="alert">
          {{ errorMessage }}
        </div>
        <div class="d-flex justify-content-between">
          <a href="/reset-password" class="text-white">Vous avez oublié votre mot de passe ?</a>
        </div>
        <div class="d-grid gap-2 mt-3">
          <button type="submit" class="btn btn-login rounded text-white">S'identifier</button>
        </div>
      </form>
      <div class="text-center mt-3">
        <span class="text-white">Vous êtes nouveau ? <a href="/register" class="text-white">Créer un compte</a></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserLogin',
  data () {
    return {
      email: '',
      password: '',
      errorMessage: ''
    }
  },
  methods: {
    async login () {
      this.errorMessage = ''
      if (!this.email || !this.password) {
        this.errorMessage = 'Veuillez remplir tous les champs.'
        return
      }
      try {
        const response = await fetch('http://localhost:3000/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: this.email,
            password: this.password
          })
        })
        const data = await response.json()
        if (response.ok) {
          localStorage.setItem('token', data.token)
          this.$router.push('/profile')
        } else {
          this.errorMessage = data.message || 'Échec de la connexion. Veuillez vérifier votre email et votre mot de passe.'
        }
      } catch (error) {
        this.errorMessage = 'Erreur lors de la communication avec le serveur. Veuillez réessayer plus tard.'
      }
    }
  }
}
</script>
