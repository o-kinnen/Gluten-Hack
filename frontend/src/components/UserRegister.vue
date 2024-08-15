<template>
  <div class="d-flex justify-content-center align-items-center vh-100 bg-fond text-white rounded mb-4">
    <div class="card p-4 bg-form rounded" style="width: 400px;">
      <div class="text-center mb-3">
        <h3 class="text-white">Créer un compte</h3>
      </div>
      <form @submit.prevent="register">
        <div class="mb-3">
          <label for="name" class="form-label text-white">Nom</label>
          <input type="text" v-model="name" class="form-control" id="name" placeholder="Votre nom" :class="{'is-invalid': v$.name.$error}" @blur="v$.name.$touch()">
          <div v-if="v$.name.$error" class="invalid-feedback">Le nom est requis.</div>
        </div>
        <div class="mb-3">
          <label for="email" class="form-label text-white">Email</label>
          <input type="email" v-model="email" class="form-control" id="email" placeholder="exemple@gmail.com" :class="{'is-invalid': v$.email.$error}" @blur="v$.email.$touch()">
          <div v-if="v$.email.$error" class="invalid-feedback">
            L'email doit être valide.
          </div>
        </div>
        <div class="mb-3">
          <label for="password" class="form-label text-white">Mot de passe</label>
          <input type="password" v-model="password" class="form-control" id="password" placeholder="Veuillez saisir votre mot de passe" :class="{'is-invalid': v$.password.$error}" @blur="v$.password.$touch()">
          <div v-if="v$.password.$error" class="invalid-feedback">Le mot de passe doit contenir au moins 8 caractères.</div>
        </div>
        <div class="mb-3">
          <label for="confirmPassword" class="form-label text-white">Confirmez le mot de passe</label>
          <input type="password" v-model="confirmPassword" class="form-control" id="confirmPassword" placeholder="Veuillez saisir à nouveau votre mot de passe" :class="{'is-invalid': v$.confirmPassword.$error}" @blur="v$.confirmPassword.$touch()">
          <div v-if="v$.confirmPassword.$error" class="invalid-feedback">Les mots de passe ne correspondent pas.</div>
        </div>
        <div v-if="errorMessage" class="alert alert-danger" role="alert">
          {{ errorMessage }}
        </div>
        <div v-if="successMessage" class="alert alert-success" role="alert">
          {{ successMessage }}
        </div>
        <div class="d-grid gap-2 mt-3">
          <button type="submit" class="btn btn-login rounded text-white" :disabled="v$.$invalid">S'inscrire</button>
        </div>
      </form>
      <div class="text-center mt-3">
        <span class="text-white">Vous avez déjà un compte ? <router-link to="/login" class="text-white">Se connecter</router-link></span>
      </div>
    </div>
  </div>
</template>

<script>
import useVuelidate from '@vuelidate/core'
import { required, email, minLength, sameAs } from '@vuelidate/validators'
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
  validations () {
    return {
      name: { required },
      email: { required, email },
      password: { required, minLength: minLength(8) },
      confirmPassword: { required, sameAsPassword: sameAs(this.password) }
    }
  },
  setup () {
    const v$ = useVuelidate()
    return { v$ }
  },
  methods: {
    async register () {
      this.errorMessage = ''
      this.successMessage = ''
      this.v$.$touch()

      if (this.v$.$invalid) {
        return
      }

      try {
        const response = await fetch(`${process.env.VUE_APP_URL_BACKEND}/users/register`, {
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
          this.successMessage = 'Inscription réussie ! Redirection vers la page de connexion...'
          setTimeout(() => {
            this.$router.push('/login')
          }, 1500)
        } else {
          this.errorMessage = data.message || 'L\'inscription a échoué. Veuillez vérifier vos informations et réessayer.'
        }
      } catch (error) {
        this.errorMessage = 'Erreur lors de la communication avec le serveur. Veuillez réessayer plus tard.'
      }
    }
  }
}
</script>
