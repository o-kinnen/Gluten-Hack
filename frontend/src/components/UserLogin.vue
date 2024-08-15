<template>
  <div class="d-flex justify-content-center align-items-center vh-100 bg-fond text-white rounded mb-4">
    <div class="card p-4 bg-form rounded" style="width: 400px;">
      <div class="text-center mb-3">
        <h3 class="text-white">{{ $t('welcomeForm') }}</h3>
      </div>
      <form @submit.prevent="login">
        <div class="mb-3">
          <label for="email" class="form-label text-white">Email</label>
          <input type="email" v-model="email" class="form-control" id="email" placeholder="exemple@gmail.com" :class="{'is-invalid': $v.email.$error}" @blur="$v.email.$touch()">
          <div v-if="$v.email.$error" class="invalid-feedback">L'email doit être valide.</div>
        </div>
        <div class="mb-3">
          <label for="password" class="form-label text-white">{{ $t('password') }}</label>
          <input type="password" v-model="password" class="form-control" id="password" placeholder="Veuillez saisir votre mot de passe" :class="{'is-invalid': $v.password.$error}" @blur="$v.password.$touch()">
          <div v-if="$v.password.$error" class="invalid-feedback">Le mot de passe est requis.</div>
        </div>
        <div v-if="errorMessage" class="alert alert-danger" role="alert">
          {{ errorMessage }}
        </div>
        <div class="d-flex justify-content-between">
          <a href="/reset-password" class="text-white">Vous avez oublié votre mot de passe ?</a>
        </div>
        <div class="d-grid gap-2 mt-3">
          <button type="submit" class="btn btn-login rounded text-white" :disabled="$v.$invalid">S'identifier</button>
        </div>
      </form>
      <div class="text-center mt-3">
        <span class="text-white">Vous êtes nouveau ? <a href="/register" class="text-white">Créer un compte</a></span>
      </div>
    </div>
  </div>
</template>

<script>
import useVuelidate from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'

export default {
  name: 'UserLogin',
  data () {
    return {
      email: '',
      password: '',
      errorMessage: ''
    }
  },
  validations () {
    return {
      email: { required, email },
      password: { required }
    }
  },
  setup () {
    const v$ = useVuelidate()
    return { v$ }
  },
  computed: {
    $v () {
      return this.v$
    }
  },
  methods: {
    async login () {
      this.errorMessage = ''
      this.$v.$touch()

      if (this.$v.$invalid) {
        return
      }

      try {
        const response = await fetch(`${process.env.VUE_APP_URL_BACKEND}/users/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            email: this.email,
            password: this.password
          })
        })
        const data = await response.json()
        if (response.ok) {
          this.$store.dispatch('login')
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
